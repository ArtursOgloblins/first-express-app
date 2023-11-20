import {client} from "../db"
import {RefreshToken} from "../../models/refreshToken"
import {ObjectId} from "mongodb"
import {RefreshTokenArgs, ValidateRefreshTokenArgs} from "../../types/types"

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const refreshTokenCollection = db.collection<RefreshToken>("refreshTokens")

export const authRepository = {

    async addNewRefreshToken(newRefreshToken: RefreshToken) {
        return await refreshTokenCollection.insertOne(newRefreshToken)
    },

    async validateRefreshToken(validationsArgs: ValidateRefreshTokenArgs) {
        return await refreshTokenCollection.findOne(validationsArgs)
    },

    async refreshToken(inputData: RefreshTokenArgs) {
        return await refreshTokenCollection.findOneAndUpdate(
            {deviceId: inputData.deviceId, userId: inputData.userId},
            {$set: {createdAt: inputData.createdAt, expiresAt: inputData.expiresAt}},
            {returnDocument: 'after'})
    },

    async logOutUser(inputData: ValidateRefreshTokenArgs) {
         const result =  await refreshTokenCollection.deleteOne({
             userId: inputData.userId,
             createdAt: inputData.createdAt,
             deviceId: inputData.deviceId
         })
        return result.deletedCount === 1
    },

    async deleteOtherDevices(inputData: ValidateRefreshTokenArgs) {
        const deviceToKeep = await refreshTokenCollection.findOne({
            userId: inputData.userId,
            createdAt: inputData.createdAt,
            deviceId: inputData.deviceId
        })

        if (deviceToKeep) {
            return await refreshTokenCollection.deleteMany({
                _id: {$ne: deviceToKeep._id}
            });
        }
    },

    async getActiveDevices(userId: ObjectId) {
        const filter = {
            userId: new ObjectId(userId),
            expiringAt: {$gt: new Date().toISOString()}
        }
        return await refreshTokenCollection.find(filter).toArray()
    },

    async getDeviceByDeviceId(deviceId: string) {
        return await refreshTokenCollection.findOne({
            deviceId: deviceId,
            // expiringAt: {$gt: new Date().toISOString()}
        })
    },

    async deleteDeviceByDeviceId(deviceId: string) {
        const result = await refreshTokenCollection.deleteOne({
            deviceId: deviceId,
            // expiringAt: {$gt: new Date().toISOString()}
        })
        return result.deletedCount === 1
    }
}