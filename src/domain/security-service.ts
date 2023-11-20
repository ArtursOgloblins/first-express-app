import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth/auth-db-repo";
import {ActiveDevicesOutput} from "../models/refreshToken";
import {activeDeviceMapper, jwtDateMapper} from "../helpers/mappers";
import {ObjectId} from "mongodb";

export const securityService = {
    async getDevices(refreshToken: string) {
        const refreshTokenDetails = await jwtService.getRefreshTokenDetails(refreshToken)
        const userId = new ObjectId(refreshTokenDetails.userId)
        const activeDevices =  await authRepository.getActiveDevices(userId)
        const mappedActiveDevices: ActiveDevicesOutput[] = activeDevices.map((d) => activeDeviceMapper(d))

        return mappedActiveDevices
    },

    async deleteOtherDevices(refreshToken: string) {
        const refreshTokenDetails = await jwtService.getRefreshTokenDetails(refreshToken)
        const {iat, deviceId} = refreshTokenDetails
        const createdAt = jwtDateMapper(iat)
        const userId = new ObjectId(refreshTokenDetails.userId)

        const tokenArgs = {createdAt, deviceId, userId}

        return await authRepository.deleteOtherDevices(tokenArgs)
    }
}