import {Post, PostOutput} from "../../models/Posts";
import {postMapper} from "../../helpers/helper";
import {ObjectId} from "mongodb";
import {client} from "../db";

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const postCollection = db.collection<Post>("posts")

export const postsQueryRepository = {

    async getPosts(): Promise<PostOutput[]> {
        const posts = await postCollection.find({}).toArray()

        return posts.map((p) => postMapper(p))
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