import {Blog} from "../../models/Blogs";
import {AddBlogAttr, UpdateBlogAttr} from "../../types";
import {client} from "../db";
import {randomUUID} from "crypto";
import {WithId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const blogsCollection = db.collection<Blog>("blogs");

export const blogsRepository = {

    async getBlogs(): Promise<Blog[]> {
        return blogsCollection.find().toArray()
    },

    async getBlogById(id: string): Promise<Blog | null> {
        return blogsCollection.findOne({id: id})
    },

    async addBlog(inputData: AddBlogAttr): Promise<Blog | null> {
        const {name, description, websiteUrl} = inputData
        const createdAt = new Date().toISOString();

        const newBlog = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership: false
        }

        await blogsCollection.insertOne(newBlog);

        const newBlogRes: WithId<Blog> | null = await blogsCollection.findOne({id: newBlog.id})

        if (newBlogRes) {
            const {_id, ...blogWithout_Id} = newBlogRes;
            return blogWithout_Id;
        } else {
            return null;
        }
    },

    async updateBlog(inputData: UpdateBlogAttr): Promise<Blog | null>  {
        const {id, ...dataToUpdate} = inputData

        return await blogsCollection.findOneAndUpdate(
            {id: id},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
    },

    async removeBlogById(id: string): Promise<boolean>  {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
