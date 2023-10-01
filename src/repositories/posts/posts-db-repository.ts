import {Post} from "../../models/posts";
import {Blog} from "../../models/Blogs";
import {AddPostAttr, UpdatePostAttr} from "../../types";
import {blogsRepository} from "../blogs/blogs-db-repository";
import {client} from "../db";
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");
export const postsRepository = {

    async getPosts(): Promise<Post[]> {
        return postCollection.find({}, {projection: { _id: 0 }}).toArray()
    },

    async getPostById(id: string): Promise<Post | null> {
       return postCollection.findOne({id: id}, { projection: { _id: 0 }})
    },

    async addPost(inputData: AddPostAttr): Promise<Post | null> {
        const { title, shortDescription, content, blogId } = inputData;
        const createdAt = new Date().toISOString();
        const blog: Blog | null = await blogsRepository.getBlogById(inputData.blogId)

        const newPost = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt
        };

        await postCollection.insertOne(newPost)
        return await this.getPostById(newPost.id)
    },

    async updatePost(inputData: UpdatePostAttr): Promise<Post | null> {
        const {id, ...dataToUpdate} = inputData

        return await postCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
    },

    async deletePostById(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
