import {client} from "../db"
import {RefreshToken} from "../../models/refreshToken"

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const refreshTokenCollection = db.collection<RefreshToken>("refreshTokens")

export const authRepository = {
    async registerRefreshToken(refreshToken: RefreshToken) {
        return await refreshTokenCollection.insertOne(refreshToken)
    },

    async invalidateRefreshToken(token: string) {
        return await refreshTokenCollection.deleteOne({token: token})
    },

    async getToken(token: string) {
        return await refreshTokenCollection.findOne({token: token})
    }
}