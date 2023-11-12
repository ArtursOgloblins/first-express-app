import express, {Request, Response} from "express";
import {userService} from "../domain/users-service";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {jwtService} from "../application/jwt-service";
import {authWithToken} from "../middleware/auth/authWithToken";
import {createUserValidation, resendingEmailValidation} from "../middleware/users/createUserValidation";
import {authService} from "../domain/auth-service";
import {registrationValidation} from "../middleware/auth/authValidations";
import {usersQueryRepository} from "../repositories/users/users-query-repo";

const authRoutes = express.Router()

authRoutes.post('/registration',createUserValidation(),
    async (req: Request, res: Response) => {

    const {login, password, email} = req.body
    const newUser = await authService.createUser({login, password, email})
        if (newUser) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
})

authRoutes.post('/registration-confirmation', registrationValidation(),
    async (req: Request, res: Response) => {
    const confirmation = await authService.confirmRegistration(req.body.code)
    if (!confirmation) {
        res.sendStatus(HTTP_STATUS.BAD_REQUEST)
    } else {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    }
})

authRoutes.post('/registration-email-resending', resendingEmailValidation(),
    async (req:Request, res:Response) => {
    const emailResending = await authService.confirmationResending(req.body.email)
        if (!emailResending) {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        }
})

authRoutes.post('/login', async (req: Request, res: Response)=> {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user !== null) {
        const accessToken= await jwtService.createJWT(user)
        const newRefreshToken = await jwtService.createRefreshJWT(user)

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        res.send(accessToken).status(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.post('/refresh-token', async (req:Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken
    console.log("oldRefreshToken", oldRefreshToken)

    if(!oldRefreshToken) {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }

    try {
        const userId = await jwtService.verifyRefreshToken(oldRefreshToken)
        if (!userId) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
        await jwtService.invalidateRefreshToken(oldRefreshToken)

        const user = await usersQueryRepository.findUserById(userId)
        if (!user) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
        const newAccessToken = await jwtService.createJWT(user)
        const newRefreshToken = await jwtService.createRefreshJWT(user)

        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
        res.send(newAccessToken).status(HTTP_STATUS.NO_CONTENT)

    } catch (error) {
        console.error("Error on refreshing token: ", error)
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }

    const userId = await jwtService.verifyRefreshToken(refreshToken)
    if (!userId) {
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }

    try {
        await jwtService.invalidateRefreshToken(refreshToken)
        res.clearCookie('refreshToken', {httpOnly: true, secure: true})
        return res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } catch (error) {
        console.error('Error during logout: ', error)
        return  res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
    }
})

authRoutes.get('/me', authWithToken, async(req: Request, res: Response) => {
    const currentUser = {
        email: req.user!.accountData.email,
        login: req.user!.accountData.login,
        userId: req.user!._id.toString()
    }
    res.status(HTTP_STATUS.OK).send(currentUser);
})

export default authRoutes