import {Post} from "../../models/posts";
import {Blog} from "../../models/Blogs";
import {AddPostAttr, UpdatePostAttr} from "../../types";
import {blogsRepository} from "../blogs/blogs-db-repository";
import {client} from "../db";
import {InsertOneResult, ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");
export const postsRepository = {

    async getPosts(): Promise<Post[]> {
        return postCollection.find().toArray()
    },

    async getPostById(id: string): Promise<Post | null> {
       return postCollection.findOne({_id: new ObjectId(id)})
    },

    async addPost(inputData: AddPostAttr): Promise<Post | null> {
        const { title, shortDescription, content, blogId } = inputData;
        const createdAt = new Date().toISOString();
        const blog: Blog | null = await blogsRepository.getBlogById(inputData.blogId)

        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt
        };

        const result: InsertOneResult<Post> = await postCollection.insertOne(newPost);
        return await postCollection.findOne({_id: result.insertedId});
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
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}