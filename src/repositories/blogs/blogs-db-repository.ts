import {Blog} from "../../models/Blogs";
import {AddBlogAttr, UpdateBlogAttr} from "../../types";
import {client} from "../db";
import {InsertOneResult, ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const blogsCollection = db.collection<Blog>("blogs");

export const blogsRepository = {

    async getBlogs(): Promise<Blog[]> {
        return blogsCollection.find().toArray()
    },

    async getBlogById(id: string): Promise<Blog | null> {
        return blogsCollection.findOne({_id: new ObjectId(id)})
    },

    async addBlog(inputData: AddBlogAttr): Promise<Blog | null> {
        const {name, description, websiteUrl} = inputData
        const createdAt = new Date().toISOString();

        const newBlog = {
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership: false
        }

        const result: InsertOneResult<Blog> = await blogsCollection.insertOne(newBlog);
        const insertedId = result.insertedId;

        return await blogsCollection.findOne({_id: insertedId});
    },

    async updateBlog(inputData: UpdateBlogAttr): Promise<Blog | null>  {
        const {id, ...dataToUpdate} = inputData

        return await blogsCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
    },

    async removeBlogById(id: string): Promise<boolean>  {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}
