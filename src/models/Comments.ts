import {WithId} from "mongodb";
import { Schema, model } from 'mongoose';

export type Comment = {
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    postId: string
}

export type CommentDb = WithId<Comment>

export type CommentOutput = Omit<Comment, 'postId'> & { id: string };

export type PagedCommentOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: CommentOutput[]
}

export const CommentSchema = new Schema<Comment>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
})

export const CommentModelClass = model('User', CommentSchema)

