import {ObjectId, WithId} from "mongodb";

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