import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {UserDb} from "../models/Users";
import {config} from "dotenv";

config()

const jwtToken = process.env.JWT_SECRET || "defaultSecret"
export const jwtService = {
    async createJWT(user: UserDb) {
        const token = jwt.sign({userId: user._id}, jwtToken, {expiresIn: '1h'})
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, jwtToken)
            console.log('ín verify:', result)
            return new ObjectId(result.userId)
        } catch (error) {
            console.log('érror in verify:', error)
            return null
        }
    }
}