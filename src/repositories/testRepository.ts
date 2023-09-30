import {client} from "./db";
import {Post} from "../models/posts";
import {Blog} from "../models/Blogs";
import {blogsRepository} from "./blogs/blogs-db-repository";
import {postsRepository} from "./posts/posts-db-repository";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");
const blogsCollection = db.collection<Blog>("blogs");

export const testRepository = {

   async deleteAllBlogs(): Promise<Blog[]> {
        await blogsCollection.deleteMany({})
        return await blogsRepository.getBlogs()
    },

    async deleteAllPosts(): Promise<Post[]> {
        await postCollection.deleteMany({})
        return await postsRepository.getPosts()
    }
}
