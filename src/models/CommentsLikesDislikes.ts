import {Schema, model} from 'mongoose';

export class LikesInfo {
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: string) {}
}

export class CommentLikes {
    constructor(public commentId: string,
                public userId: string,
                public likeStatus: string) {
    }
}

export const CommentLikesSchema = new Schema<CommentLikes>({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    likeStatus: {type: String, required: true, enum: ['Like', 'Dislike']}
})

export const CommentLikesModel = model('commentLikes', CommentLikesSchema)