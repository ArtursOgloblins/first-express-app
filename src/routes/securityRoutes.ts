import express, {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {securityService} from "../domain/security-service";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth/auth-db-repo";

const securityRoutes = express.Router()

securityRoutes.get('/devices', async (req: Request, res:Response) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }

        const activeDevices = await securityService.getDevices(refreshToken)
        res.send(activeDevices)
    } catch (error) {
        console.log('Error in getting active devices')
        res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
})

securityRoutes.delete('/devices', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }

        await securityService.deleteOtherDevices(refreshToken)
        res.sendStatus(HTTP_STATUS.NO_CONTENT)

    } catch (error) {
        console.log('Error in deleting devices')
        res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
})

securityRoutes.delete('/devices/:deviceId', async (req: Request, res: Response) =>{
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
        }

        const refreshTokenDetails = await jwtService.getRefreshTokenDetails(refreshToken)
        const {userId} = refreshTokenDetails
        const {deviceId} = req.params

        const deviceToDelete = await authRepository.getDeviceByDeviceId(deviceId)
        console.log('deviceToDelete', deviceToDelete)
        if (!deviceToDelete) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND)
        } else if (deviceToDelete.userId != userId) {
            return res.sendStatus(HTTP_STATUS.FORBIDDEN)
        }

        await authRepository.deleteDeviceByDeviceId(deviceId)
        return res.sendStatus(HTTP_STATUS.NO_CONTENT)

    } catch (error) {

        console.error('Error in deleting devices', error);
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
    }
})

export default securityRoutes