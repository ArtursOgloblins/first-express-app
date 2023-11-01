import {client} from "../db";
import {Comment} from "../../models/Comments";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const commentsCollection = db.collection<Comment>("comments");

export const commentsRepository = {
    async addComment(newComment: Comment)  {

        const res = await commentsCollection.insertOne({...newComment})
        const id = res.insertedId.toString();
        const { postId, ...restOfNewComment  } = newComment;

        return {id: id, ...restOfNewComment}
    }
}