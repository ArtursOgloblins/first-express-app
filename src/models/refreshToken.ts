import {ObjectId, WithId} from "mongodb";
import {Schema, model} from 'mongoose';

export type RefreshToken = {
    createdAt: string
    deviceId: string
    ip: string
    deviceName: string
    userId: ObjectId
}

export type RefreshTokenDb = WithId<RefreshToken>

export type ActiveDevicesOutput = {
    ip: string
    title: string
    lastActiveDate: string,
    deviceId: string
}

export const RefreshTokenSchema = new Schema<RefreshToken>({
    createdAt: { type: String, require: true },
    deviceId: { type: String, require: true },
    ip: { type: String, require: true },
    deviceName: {type: String, require: false},
    userId: {type: Schema.Types.ObjectId, require: true}
})
export const RefreshTokenModelClass = model('refreshTokens', RefreshTokenSchema)