import {RefreshToken, RefreshTokenDb, RefreshTokenModelClass} from "../../models/refreshToken"
import {ObjectId} from "mongodb"
import {RefreshTokenArgs, ValidateRefreshTokenArgs} from "../../types/types"
import {PasswordRecoveryDb, PasswordRecoveryModel} from "../../models/passwordRecovery";

export class AuthRepository {
    async addNewRefreshToken(newRefreshToken: RefreshToken) {
        return await RefreshTokenModelClass.create(newRefreshToken)
    }

    async validateRefreshToken(validationsArgs: ValidateRefreshTokenArgs) {
        return RefreshTokenModelClass.findOne(validationsArgs);
    }

    async refreshToken(inputData: RefreshTokenArgs) {
        return RefreshTokenModelClass.findOneAndUpdate(
            {deviceId: inputData.deviceId, userId: inputData.userId},
            {$set: {createdAt: inputData.createdAt, expiresAt: inputData.expiresAt}},
            {returnDocument: 'after'})
    }

    async logOutUser(inputData: ValidateRefreshTokenArgs) {
        const result =  await RefreshTokenModelClass.deleteOne({
            userId: inputData.userId,
            createdAt: inputData.createdAt,
            deviceId: inputData.deviceId
        })
        return result.deletedCount === 1
    }

    async deleteOtherDevices(inputData: ValidateRefreshTokenArgs) {
        const deviceToKeep = await RefreshTokenModelClass.findOne({
            userId: inputData.userId,
            createdAt: inputData.createdAt,
            deviceId: inputData.deviceId
        })

        if (deviceToKeep) {
            return RefreshTokenModelClass.deleteMany({
                _id: {$ne: deviceToKeep._id}
            });
        }
    }

    async getActiveDevices(userId: ObjectId): Promise<RefreshTokenDb[]> {
        const filter = {
            userId: new ObjectId(userId),
            expiringAt: {$gt: new Date().toISOString()}
        }
        return RefreshTokenModelClass.find(filter)
    }

    async getDeviceByDeviceId(deviceId: string) {
        return RefreshTokenModelClass.findOne({
            deviceId: deviceId,
            // expiringAt: {$gt: new Date().toISOString()}
        })
    }

    async deleteDeviceByDeviceId(deviceId: string) {
        const result = await RefreshTokenModelClass.deleteOne({
            deviceId: deviceId,
            // expiringAt: {$gt: new Date().toISOString()}
        })
        return result.deletedCount === 1
    }

    async getRecoveryDetails(recoveryCode: string): Promise<PasswordRecoveryDb | null>  {
        try {
            return await PasswordRecoveryModel.findOne({confirmationCode: recoveryCode}).lean()
        } catch (error) {
            console.error("Error getting userId by recovery code", error)
            throw new Error('Database query failed')
        }
    }

    async resetRecoveryDetails(recoveryCode: string) {
        try {
            const res =  await PasswordRecoveryModel.updateOne(
                {confirmationCode: recoveryCode},
                {$set:{isValid: false}}
            )
            return res.modifiedCount === 1

        } catch (error) {
            console.error("Error resetting recovery details", error)
            throw new Error('Database query failed')
        }
    }
}