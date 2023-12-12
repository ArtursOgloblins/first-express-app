import {JwtService} from "../application/jwt-service";
import {AuthRepository} from "../repositories/auth/auth-db-repo";
import {ActiveDevicesOutput} from "../models/refreshToken";
import {activeDeviceMapper, jwtDateMapper} from "../helpers/mappers";
import {ObjectId} from "mongodb";

export class SecurityService {
    constructor(protected authRepository: AuthRepository,
                protected jwtService: JwtService) {
    }

    async getDevices(refreshToken: string) {
        const refreshTokenDetails = await this.jwtService.getRefreshTokenDetails(refreshToken)
        const userId = new ObjectId(refreshTokenDetails.userId)
        const activeDevices =  await this.authRepository.getActiveDevices(userId)
        const mappedActiveDevices: ActiveDevicesOutput[] = activeDevices.map((d) => activeDeviceMapper(d))

        return mappedActiveDevices
    }

    async deleteOtherDevices(refreshToken: string) {
        const refreshTokenDetails = await this.jwtService.getRefreshTokenDetails(refreshToken)
        const {iat, deviceId} = refreshTokenDetails
        const createdAt = jwtDateMapper(iat)
        const userId = new ObjectId(refreshTokenDetails.userId)

        const tokenArgs = {createdAt, deviceId, userId}

        return await this.authRepository.deleteOtherDevices(tokenArgs)
    }
}