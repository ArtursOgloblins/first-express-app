import {Blog, BlogOutput, PagedBlogOutput} from "../../models/Blogs";
import {blogMapper} from "../../helpers/helper";
import {client} from "../db";
import {ObjectId} from "mongodb";
import {BlogQueryParams} from "../../types";

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const blogsCollection = db.collection<Blog>("blogs")

export const blogsQueryRepository = {

    async getBlogs(params: BlogQueryParams): Promise<PagedBlogOutput> {
        let filter = {}
        if (params.searchNameTerm) {
            filter = {
                name: new RegExp(params.searchNameTerm, "i")
            }
        }

        const sortDir = params.sortDirection === 'asc' ? 1 : -1
        const skipAmount = (params.pageNumber - 1) * params.pageSize
        const totalCount = await blogsCollection.countDocuments(filter)

        const blogs= await blogsCollection
            .find(filter)
            .sort({[params.sortBy]: sortDir})
            .skip(skipAmount)
            .limit(params.pageSize || 10)
            .toArray()

        const mappedBlogs: BlogOutput[] =  blogs.map((b) => blogMapper(b))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedBlogs
        }
    },

    async getBlogById(id: string): Promise<BlogOutput | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})

        if(!blog){
            return null;
        }

        return blogMapper(blog);
    },

    async removeBlogById(id: string): Promise<boolean>  {
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }
}