import { Schema, model } from 'mongoose';


export class CommentatorInfo {
    constructor(public userId: string,
                public userLogin: string) {
    }
}

export class LikesInfo {
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: string) {
    }
}

export class BlogComment {
    constructor(public content: string,
                public commentatorInfo: CommentatorInfo,
                public createdAt: string,
                public postId: string,
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

export type PagedCommentOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: CommentOutput[]
}

export const CommentSchema = new Schema<BlogComment>({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
})

export const CommentModel = model('comments', CommentSchema)

