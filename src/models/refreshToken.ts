import {ObjectId, WithId} from "mongodb";

export type RefreshToken = {
    userId: ObjectId,
    token: string,
    expires: Date,
}

export type RefreshTokenDb = WithId<RefreshToken>