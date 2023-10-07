import {client} from "./db";
import {Post} from "../models/Posts";
import {Blog} from "../models/Blogs";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");
const blogsCollection = db.collection<Blog>("blogs");

export const testRepository = {

   async deleteAllBlogs(): Promise<Blog[]> {
        await blogsCollection.deleteMany({})
       return []
    },

    async deleteAllPosts(): Promise<Post[]> {
        await postCollection.deleteMany({})
        return []
    }
}
