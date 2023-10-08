import {PagedPostOutput, Post, PostOutput} from "../../models/Posts";
import {postMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";
import {client} from "../db";
import {PostQueryParams} from "../../types";

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const postCollection = db.collection<Post>("posts")

export const postsQueryRepository = {

    async getPosts(params: PostQueryParams): Promise<PagedPostOutput> {

        const sortDir = params.sortDirection === 'asc' ? 1 : -1
        const skipAmount = (params.pageNumber - 1) * params.pageSize
        const totalCount = await postCollection.countDocuments()

        const posts = await postCollection
            .find({})
            .sort({[params.sortBy]: sortDir})
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

    async getPostById(id: string): Promise<PostOutput | null> {
        const post = await postCollection.findOne({_id: new ObjectId(id)})

        if (!post) {
            return null
        }

        return postMapper(post)
    },

    async deletePostById(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

}