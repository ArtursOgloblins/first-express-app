import {Blog} from "../../models/Blogs";
import {AddBlogAttr, UpdateBlogAttr} from "../../types";
import {client} from "../db";
import {randomUUID} from "crypto";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const blogsCollection = db.collection<Blog>("blogs");

export const blogsRepository = {

    async getBlogs(): Promise<Blog[]> {
        return blogsCollection.find({}, {projection: { _id: 0 }}).toArray()
    },

    async getBlogById(id: string): Promise<Blog | null> {
        return blogsCollection.findOne({id: id}, { projection: { _id: 0 }})
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

        return await this.getBlogById(newBlog.id);
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
