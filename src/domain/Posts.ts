import {WithId} from "mongodb";
import {Schema, model} from 'mongoose';

export class NewestLike {
    constructor(public addedAt: string,
                public userId: string,
                public login: string) {
    }
}


export class Post {
    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public newestLikes: NewestLike[]
                ) {
    }
}

export type PostDb = WithId<Post>

export type PostOutput = Post & {id: string}

export type PagedPostOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: PostOutput[]
}

export const PostSchema = new Schema<Post>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    newestLikes: [{
        addedAt: {type: String, required: true},
        userId: {type: String, required: true},
        login: {type: String, required: true}
    }]
})

export const PostModelClass = model('posts', PostSchema)