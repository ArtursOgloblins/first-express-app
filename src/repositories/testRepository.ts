import {client} from "./db";
import {Post} from "../models/Posts";
import {Blog} from "../models/Blogs";
import {User} from "../models/Users";
import {Comment} from "../models/Comments";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");
const blogsCollection = db.collection<Blog>("blogs");
const usersCollection = db.collection<User>("users");
const commentsCollection = db.collection<Comment>("comments");


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
    },

    async deleteAllComments(): Promise<Comment[]> {
        await commentsCollection.deleteMany({})
        return []
    }
}
