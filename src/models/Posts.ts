import {WithId} from "mongodb";
import {Schema, model} from 'mongoose';

// export type Post ={
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string
//     createdAt: string
// }

export class Post {
    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string) {
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
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true }
})

export const PostModelClass = model('posts', PostSchema)