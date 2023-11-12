import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UserDb} from "../models/Users";
import {config} from "dotenv";
import {authRepository} from "../repositories/auth/auth-db-repo";

config()

const jwtAccessTokenSecret  = process.env.JWT_SECRET || "defaultSecret"
const jwtRefreshTokenSecret = process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret";
export const jwtService = {
    async createJWT(user: UserDb) {
        const token = jwt.sign({userId: user._id}, jwtAccessTokenSecret, {expiresIn: '10s'})
        return {
            accessToken: token
        }
    },

    async createRefreshJWT(user: UserDb) {
        const duration = 20
        const newRefreshToken =  jwt.sign({userId: user._id}, jwtRefreshTokenSecret,
            {expiresIn: `${duration.toString()}s`})

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + duration)

        const refreshToken = {
            userId: user._id,
            token: newRefreshToken,
            expires: expiration,
        }
        await authRepository.registerRefreshToken(refreshToken)

        return newRefreshToken
    },

    async verifyRefreshToken(token: string) {
        const storedToken = await authRepository.getToken(token)

        if (!storedToken || new Date() > storedToken.expires) {
            return null
        }
        try {
            const result: any = jwt.verify(token, jwtRefreshTokenSecret);
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async invalidateRefreshToken(token: string) {
        await authRepository.invalidateRefreshToken(token)
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, jwtAccessTokenSecret)
            console.log('ín verify:', result)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log('érror in verify:', error)
            return null
        }
    }
}