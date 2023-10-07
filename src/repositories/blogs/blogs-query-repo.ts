import {Blog, BlogOutput} from "../../models/Blogs";
import {blogMapper} from "../../helpers/helper";
import {client} from "../db";
import {ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts"
const db = client.db(dbName)
const blogsCollection = db.collection<Blog>("blogs")

export const blogsQueryRepository = {

    async getBlogs(): Promise<BlogOutput[]> {
        const blogs= await blogsCollection.find({}).toArray()

        return blogs.map((b) => blogMapper(b))
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