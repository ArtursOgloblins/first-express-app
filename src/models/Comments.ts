import {WithId} from "mongodb";

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

