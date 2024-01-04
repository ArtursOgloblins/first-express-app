import {Schema, model} from 'mongoose';

export enum LikeStatuses {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
}

export class LikesInfo {
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: string) {
    }
}

export class Likes {
    constructor(public entityId: string,
                public userId: string,
                public login: string,
                public likeStatus: string,
                public createdAt: string) {
    }
}

export const LikesSchema = new Schema<Likes>({
    entityId: { type: String, required: true },
    userId: { type: String, required: true },
    login: { type: String, required: true },
    likeStatus: {type: String, required: true, enum: Object.values(LikeStatuses)},
    createdAt: {type: String, required: true}
})

export const LikesModel = model('likes', LikesSchema)