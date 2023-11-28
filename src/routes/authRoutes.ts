import express, {Request, Response} from "express";
import {userService} from "../domain/users-service";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {jwtService} from "../application/jwt-service";
import {authWithToken} from "../middleware/auth/authWithToken";
import {
    createUserValidation,
    emailValidation, passwordValidation,
    resendingEmailValidation
} from "../middleware/users/createUserValidation";
import {authService} from "../domain/auth-service";
import {registrationValidation} from "../middleware/auth/authValidations";
import {helperMethods} from "../helpers/helperMethods";
import {rateLimitValidation} from "../middleware/rateLimit";
import {usersQueryRepository} from "../repositories/users/users-query-repo";
import {authRepository} from "../repositories/auth/auth-db-repo";

const authRoutes = express.Router()

authRoutes.post('/registration',rateLimitValidation(), createUserValidation(),
    async (req: Request, res: Response) => {
    try {
        const {login, password, email} = req.body
        const newUser = await authService.createUser({login, password, email})

        if (newUser) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    } catch (error) {
        console.error('registration:', error)
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.post('/registration-confirmation', rateLimitValidation(), registrationValidation(),
    async (req: Request, res: Response) => {
    try {
        const confirmation = await authService.confirmRegistration(req.body.code)
        if (!confirmation) {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        }
    } catch (error) {
        console.error('registration-confirmation:', error)
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.post('/registration-email-resending',rateLimitValidation(), resendingEmailValidation(),
    async (req:Request, res:Response) => {
    try {
        const {ip, baseUrl} = req
        await userService.saveRequest(ip, baseUrl)

        const emailResending = await authService.confirmationResending(req.body.email)
        if (!emailResending) {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        }
    } catch (error) {
        console.error('registration-email-resending:', error)
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
    }
})

authRoutes.post('/login',rateLimitValidation(), async (req: Request, res: Response)=> {
    try {
        const {ip} = req
        const {loginOrEmail, password} = req.body
        const deviceName = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown device';
        const deviceId = await helperMethods.generateUniqueValue()
        const user = await userService.checkCredentials(loginOrEmail, password)

        if (user !== null) {
            const userId = user._id
            const accessToken= await jwtService.createJWT(userId)
            const newRefreshToken = await jwtService.createRefreshJWT(userId, deviceId)

            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})

            await authService.saveRefreshToken({userId, newRefreshToken, deviceId, ip, deviceName})

            res.send(accessToken).status(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    } catch (error) {
        console.error('Login error:', error)
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
    }
})

authRoutes.post('/refresh-token', async (req:Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken

    if(!oldRefreshToken) {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }

    try {
        const validationResult = await jwtService.validateRefreshToken(oldRefreshToken)
        if (!validationResult) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }

        const {userId, deviceId} = validationResult
        const newAccessToken = await jwtService.createJWT(userId)
        const newRefreshToken = await jwtService.createRefreshJWT(userId, deviceId)

        await jwtService.refreshToken(newRefreshToken, deviceId, userId)
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        return res.send(newAccessToken).status(HTTP_STATUS.NO_CONTENT)
    } catch (error) {
        console.error("Error on refreshing token: ", error)
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }

    try {
        const result = await jwtService.invalidateRefreshToken(refreshToken)
        if(!result){
            return  res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
        res.clearCookie('refreshToken', {httpOnly: true, secure: true})
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } catch (error) {
        console.error('Error during logout: ', error)
        return  res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.get('/me', authWithToken, async(req: Request, res: Response) => {
    if (req.user && req.user.accountData && typeof req.user._id) {
        try {
            const currentUser = {
                email: req.user.accountData.email,
                login: req.user.accountData.login,
                userId: req.user._id.toString()
            }
            res.status(HTTP_STATUS.OK).send(currentUser)
        } catch (error) {
            console.error('Failed to retrieve user data:', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    } else {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.post('/password-recovery',rateLimitValidation(), emailValidation(),
    async(req:Request, res: Response) => {
    try {
        const {email} = req.body
        const user = await usersQueryRepository.getUserByEmail(email)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.NO_CONTENT)
        }

        const sendPassword =  await authService.sendPasswordRecoveryMail(email, user._id)
        if (!sendPassword) {
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }

        return res.sendStatus(HTTP_STATUS.NO_CONTENT)

    } catch (error) {
        console.error('Failed in password-recovery mail sending:', error)
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
    }
})

authRoutes.post('/new-password',rateLimitValidation(), passwordValidation(),
    async(req: Request, res: Response ) => {

    try {
        const {newPassword, recoveryCode} = req.body
        const recoveryDetails = await authRepository.getRecoveryDetails(recoveryCode)
        console.log('recoveryDetails', recoveryDetails)

        if (!recoveryDetails) {
            return res.status(HTTP_STATUS.NO_CONTENT).send('No recovery details found')
        }
        const {userId, expirationDate, isValid} = recoveryDetails
        const isExpired = new Date(expirationDate) < new Date()

        if (!isValid || isExpired) {
            return res.status(HTTP_STATUS.NO_CONTENT).send('Recovery details invalid or expired')
        }

        const updatePassword = await userService.updatePassword(userId, newPassword)
        if (!updatePassword) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send('Error in password updating')
        }

        const resetRecoveryDetails = await authRepository.resetRecoveryDetails(recoveryCode)
        if (!resetRecoveryDetails) {
            return res.status(HTTP_STATUS.BAD_REQUEST).send('Error in resetting recovery details')
        }

        return res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } catch (error) {
        console.error('Failed in sending new password:', error)
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
    }
})

export default authRoutes