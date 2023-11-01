import {Post, PostOutput} from "../../models/Posts";
import {UpdatePostAttr} from "../../types/types";
import {client} from "../db";
import {postMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const postCollection = db.collection<Post>("posts");

export const postsRepository = {

    async addPost(newPost: Post): Promise<PostOutput | null> {

        const res = await postCollection.insertOne(newPost)

        return postMapper({...newPost, _id: res.insertedId })
    },

    async updatePost(inputData: UpdatePostAttr): Promise<PostOutput | null> {
        const {id, ...dataToUpdate} = inputData

        const post = await postCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if(!post) {
            return null
        }

        return postMapper(post)
    }
}
