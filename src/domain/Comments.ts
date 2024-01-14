import mongoose, { Schema, model } from 'mongoose';
import {LikesInfo, LikeStatuses} from "./Likes";


export class CommentatorInfo {
    constructor(public userId: string,
                public userLogin: string) {
    }
}

export class PostComment  {
    constructor(public content: string,
                public commentatorInfo: CommentatorInfo,
                public createdAt: string,
                public postId: string,
                public likesInfo: LikesInfo
                ) {
    }
}

//export type CommentOutput = Omit<BlogComment, 'postId'> & { id: string };
export class CommentOutput {
    constructor(public id: string,
                public content: string,
                public commentatorInfo: CommentatorInfo,
                public createdAt: string,
                public likesInfo: LikesInfo
                ) {
    }
}

interface CommentMethods {

}

interface CommentStaticMethods {
    createComment: (comment: PostComment) => PostComment
}

interface CommentDocument extends Document, PostComment, CommentMethods {}
interface CommentModelType extends mongoose.Model<CommentDocument>, CommentStaticMethods {}


export const CommentSchema = new Schema<PostComment>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    likesInfo: {
        likesCount: {type: Number, required: true, default: 0},
        dislikesCount: {type: Number, required: true, default: 0},
        myStatus:{type: String, enum: Object.values(LikeStatuses), default: LikeStatuses.None}
    }
})

CommentSchema.static('createComment', function createComment(commentData) {
    return new this(commentData)
})

export const CommentModel = model<PostComment, CommentModelType>('comments', CommentSchema)

