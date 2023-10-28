import {client} from "./db";
import {Post} from "../models/Posts";
import {Blog} from "../models/Blogs";
import {User} from "../models/Users";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");
const blogsCollection = db.collection<Blog>("blogs");
const usersCollection = db.collection<User>("users");


export const testRepository = {

   async deleteAllBlogs(): Promise<Blog[]> {
        await blogsCollection.deleteMany({})
       return []
    },

    async deleteAllPosts(): Promise<Post[]> {
        await postCollection.deleteMany({})
        return []
    },

    async deleteAllUsers(): Promise<User[]> {
        await usersCollection.deleteMany({})
        return []
    }
}
