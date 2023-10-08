import {Blog, BlogOutput, PagedBlogOutput} from "../../models/Blogs";
import {blogMapper, postMapper} from "../../helpers/mappers";
import {client} from "../db";
import {ObjectId} from "mongodb";
import {BlogQueryParams, PostQueryParams} from "../../types";
import {Post, PostOutput} from "../../models/Posts";
import {getPaginationDetails} from "../../helpers/query-params";

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const blogsCollection = db.collection<Blog>("blogs")
const postCollection = db.collection<Post>("posts")

export const blogsQueryRepository = {


    async getBlogs(params: BlogQueryParams): Promise<PagedBlogOutput> {
        let filter = {}
        if (params.searchNameTerm) {
            filter = {
                name: new RegExp(params.searchNameTerm, "i")
            }
        }

        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await blogsCollection.countDocuments(filter)

        const blogs= await blogsCollection
            .find(filter)
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)
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

    async getPostsByBlogId(id: string, params: PostQueryParams) {
        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await postCollection.countDocuments()

        const posts = await postCollection
            .find({blogId: id})
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)
            .toArray()

        const mappedPosts: PostOutput[] =  posts.map((p) => postMapper(p))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedPosts
        }
    },

    async removeBlogById(id: string): Promise<boolean>  {
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }
}