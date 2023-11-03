import {client} from "../db";
import {Comment, CommentOutput} from "../../models/Comments";
import {ObjectId} from "mongodb";
import {commentsMapper} from "../../helpers/mappers";
import {UpdatedCommentAttr} from "../../types/types";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const commentsCollection = db.collection<Comment>("comments");

export const commentsRepository = {
    async addComment(newComment: Comment)  {

        const res = await commentsCollection.insertOne({...newComment})
        const id = res.insertedId.toString();
        const { postId, ...restOfNewComment  } = newComment;

        return {id: id, ...restOfNewComment}
    },

    async updateComment(inputData: UpdatedCommentAttr): Promise<CommentOutput | null> {
        const {commentId, ...dataToUpdate} = inputData

        const comment = await commentsCollection.findOneAndUpdate(
            {_id: new ObjectId(commentId)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if(!comment) {
            return null
        }
        return commentsMapper(comment)
    }
}

