import {Blog} from "../../models/Blogs";
import {UpdateBlogAttr} from "../../types";
import {client} from "../db";
import {ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const blogsCollection = db.collection<Blog>("blogs");

export const blogsRepository = {

    async addBlog(newBlog: Blog) {

        const res = await blogsCollection.insertOne(newBlog)
        return res.insertedId.toString()
    },

    async updateBlog(inputData: UpdateBlogAttr) {
        const {id, ...dataToUpdate} = inputData

        return await blogsCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
    }
}
