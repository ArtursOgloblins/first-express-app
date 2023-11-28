import {WithId} from "mongodb";
import {Schema, model} from 'mongoose';

export type Blog = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
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

export const BlogSchema = new Schema<Blog>({
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})

export const BlogModelClass = model('blogs', BlogSchema)
