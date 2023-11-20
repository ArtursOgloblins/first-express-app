import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {config} from "dotenv";
import {authRepository} from "../repositories/auth/auth-db-repo";
import {jwtDateMapper} from "../helpers/mappers";

config()

const jwtAccessTokenSecret  = process.env.JWT_SECRET || "defaultSecret"
const jwtRefreshTokenSecret = process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret";
export const jwtService = {
    async createJWT(userId: ObjectId) {
        const token = jwt.sign({userId: userId}, jwtAccessTokenSecret, {expiresIn: '10s'})
        return {
            accessToken: token
        }
    },

    async createRefreshJWT(userId: ObjectId, deviceId: string) {
        const duration = 20
        return jwt.sign({userId: userId, deviceId: deviceId}, jwtRefreshTokenSecret,
            {expiresIn: `${duration.toString()}s`})
    },

    async validateRefreshToken(token: string) {
        const refreshTokenDetails = await this.getRefreshTokenDetails(token)
        const {iat, deviceId} = refreshTokenDetails
        const createdAt = jwtDateMapper(iat)
        const userId = new ObjectId(refreshTokenDetails.userId)

        const validationsArgs = {createdAt, deviceId, userId}
        console.log(validationsArgs)

        return await authRepository.validateRefreshToken(validationsArgs)
    },

    async getRefreshTokenDetails(token: string) {
        try {
            const result: any = jwt.verify(token, jwtRefreshTokenSecret);
            return result
        } catch (error) {
            console.log('error in verify:', error)
            return null
        }
    },

    async refreshToken(token: string, deviceId: string, userId: ObjectId) {
        const refreshTokenDetails = await this.getRefreshTokenDetails(token)
        const createdAt = jwtDateMapper(refreshTokenDetails.iat)
        const expiresAt = jwtDateMapper(refreshTokenDetails.exp)
        userId = new ObjectId(userId)

        const refreshTokeArgs = {createdAt, expiresAt, deviceId, userId}

        return await authRepository.refreshToken(refreshTokeArgs)
    },

    async invalidateRefreshToken(token: string) {
        const refreshTokenDetails = await this.getRefreshTokenDetails(token)
        const {createdAt, deviceId} = refreshTokenDetails
        const userId = new ObjectId(refreshTokenDetails.userId)

        const logoutRefreshTokeArgs = {createdAt, deviceId, userId}

        return await authRepository.logOutUser(logoutRefreshTokeArgs)
    },

    async verifyToken(token: string) {
        try {
            const result: any = jwt.verify(token, jwtAccessTokenSecret)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log('error in verify:', error)
            return null
        }
    }
}