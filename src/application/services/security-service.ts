import {JwtService} from "./jwt-service";
import {AuthRepository} from "../../infrastructure/repositories/auth/auth-db-repo";
import {ActiveDevicesOutput} from "../../domain/refreshToken";
import {activeDeviceMapper, jwtDateMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";


@injectable()
export class SecurityService {
    constructor(@inject(AuthRepository) protected authRepository: AuthRepository,
                @inject(JwtService) protected jwtService: JwtService) {
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