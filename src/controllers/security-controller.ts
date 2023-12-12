import {AuthRepository} from "../repositories/auth/auth-db-repo";
import {SecurityService} from "../domain/security-service";
import {JwtService} from "../application/jwt-service";
import {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";

export class SecurityController {
    constructor(protected authRepository: AuthRepository,
                protected securityService: SecurityService,
                protected jwtService: JwtService) {
    }

    async getActiveDevices(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken
            const activeDevices = await this.securityService.getDevices(refreshToken)
            res.send(activeDevices)
        } catch (error) {
            console.log('Error in getting active devices')
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }
    }

    async deleteNonActiveDevices(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken
            const isTokenValid = await this.jwtService.validateRefreshToken(refreshToken)
            if (!isTokenValid) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }

            const refreshTokenDetails = await this.jwtService.getRefreshTokenDetails(refreshToken);
            if (!refreshTokenDetails) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }

            await this.securityService.deleteOtherDevices(refreshToken)
            return res.sendStatus(HTTP_STATUS.NO_CONTENT)

        } catch (error) {
            console.log('Error in deleting devices')
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }
    }

    async deleteDeviceById(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken
            const isTokenValid = await this.jwtService.validateRefreshToken(refreshToken)
            if (!isTokenValid) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }

            const refreshTokenDetails = await this.jwtService.getRefreshTokenDetails(refreshToken)
            if (!refreshTokenDetails) {
                return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
            }
            const {userId} = refreshTokenDetails
            const {deviceId} = req.params

            const deviceToDelete = await this.authRepository.getDeviceByDeviceId(deviceId)
            if (!deviceToDelete) {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND)
            } else if (deviceToDelete.userId != userId) {
                return res.sendStatus(HTTP_STATUS.FORBIDDEN)
            }

            await this.authRepository.deleteDeviceByDeviceId(deviceId)
            return res.sendStatus(HTTP_STATUS.NO_CONTENT)

        } catch (error) {

            console.error('Error in deleting devices', error)
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    }
}