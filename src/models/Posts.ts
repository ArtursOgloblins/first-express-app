import {WithId} from "mongodb";

export type Post ={
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string
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