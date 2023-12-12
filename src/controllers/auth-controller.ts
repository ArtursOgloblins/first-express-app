import {UsersService} from "../domain/users-service";
import {AuthRepository} from "../repositories/auth/auth-db-repo";
import {AuthService} from "../domain/auth-service";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepository} from "../repositories/users/users-query-repo";
import {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {helperMethods} from "../helpers/helperMethods";


export class AuthController {
    constructor(protected usersService: UsersService,
                protected authRepository: AuthRepository,
                protected authService: AuthService,
                protected jwtService: JwtService,
                protected usersQueryRepository: UsersQueryRepository) {
    }

    async userRegistration(req: Request, res: Response) {
        try {
            const {login, password, email} = req.body
            const newUser = await this.authService.createUser({login, password, email})

            if (newUser) {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            } else {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            }
        } catch (error) {
            console.error('registration:', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    }

    async userRegistrationConfirmation(req: Request, res: Response) {
        try {
            const confirmation = await this.authService.confirmRegistration(req.body.code)
            if (!confirmation) {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            } else {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            }
        } catch (error) {
            console.error('registration-confirmation:', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    }

    async registrationEmailResending(req: Request, res: Response) {
        try {
            const {ip, baseUrl} = req
            await this.usersService.saveRequest(ip, baseUrl)

            const emailResending = await this.authService.confirmationResending(req.body.email)
            if (!emailResending) {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            } else {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            }
        } catch (error) {
            console.error('registration-email-resending:', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    }

    async userLogin(req: Request, res: Response) {
        try {
            const {ip} = req
            const {loginOrEmail, password} = req.body
            const deviceName = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown device';
            const deviceId = await helperMethods.generateUniqueValue()
            const user = await this.usersService.checkCredentials(loginOrEmail, password)

            if (user !== null) {
                const userId = user._id
                const accessToken = await this.jwtService.createJWT(userId) //TODO: conver JWTserces to classes
                const newRefreshToken = await this.jwtService.createRefreshJWT(userId, deviceId)

                res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})

                await this.authService.saveRefreshToken({userId, newRefreshToken, deviceId, ip, deviceName})

                return res.send(accessToken).status(HTTP_STATUS.NO_CONTENT)
            } else {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }
        } catch (error) {
            console.error('Login error:', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }
    }

    async createRefreshToken(req: Request, res: Response) {
        const oldRefreshToken = req.cookies.refreshToken

        if (!oldRefreshToken) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }

        try {
            const validationResult = await this.jwtService.validateRefreshToken(oldRefreshToken)
            if (!validationResult) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }

            const {userId, deviceId} = validationResult
            const newAccessToken = await this.jwtService.createJWT(userId)
            const newRefreshToken = await this.jwtService.createRefreshJWT(userId, deviceId)

            await this.jwtService.refreshToken(newRefreshToken, deviceId, userId)
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
            return res.send(newAccessToken).status(HTTP_STATUS.NO_CONTENT)
        } catch (error) {
            console.error("Error on refreshing token: ", error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    }

    async userLogout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }

        try {
            const result = await this.jwtService.invalidateRefreshToken(refreshToken)
            if (!result) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }
            res.clearCookie('refreshToken', {httpOnly: true, secure: true})
            return res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } catch (error) {
            console.error('Error during logout: ', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    }

    async getCurrentUserInfo(req: Request, res: Response) {
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
    }

    async recoverPassword(req: Request, res: Response) {
        try {
            const {email} = req.body
            const user = await this.usersQueryRepository.getUserByEmail(email)
            if (!user) {
                return res.status(HTTP_STATUS.NO_CONTENT).send('No user found')
            }

            const sendPassword = await this.authService.sendPasswordRecoveryMail(email, user._id)
            if (!sendPassword) {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            }

            return res.sendStatus(HTTP_STATUS.NO_CONTENT)

        } catch (error) {
            console.error('Failed in password-recovery mail sending:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async updatePassword(req: Request, res: Response) {

        try {
            const {newPassword, recoveryCode} = req.body
            const recoveryDetails = await this.authRepository.getRecoveryDetails(recoveryCode)
            console.log('recoveryDetails', recoveryDetails)

            if (!recoveryDetails) {
                return res.status(HTTP_STATUS.NO_CONTENT).send('No recovery details found')
            }
            const {userId, expirationDate, isValid} = recoveryDetails
            const isExpired = new Date(expirationDate) < new Date()

            if (!isValid || isExpired) {
                return res.status(HTTP_STATUS.NO_CONTENT).send('Recovery details invalid or expired')
            }

            const updatePassword = await this.usersService.updatePassword(userId, newPassword)
            if (!updatePassword) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send('Error in password updating')
            }

            const resetRecoveryDetails = await this.authRepository.resetRecoveryDetails(recoveryCode)
            if (!resetRecoveryDetails) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send('Error in resetting recovery details')
            }

            return res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } catch (error) {
            console.error('Failed in sending new password:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }
}