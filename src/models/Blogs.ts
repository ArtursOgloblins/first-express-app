import {WithId} from "mongodb";

export type Blog = {
    name: string
    description: string
    websiteUrl: string
    "createdAt": string
    "isMembership": boolean
}

export type BlogDb = WithId<Blog>

export type BlogOutput = Blog & { id: string}

export type PagedBlogOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: BlogOutput[]
}
