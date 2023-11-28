import {Comment, CommentModelClass, CommentOutput} from "../../models/Comments";
import {ObjectId} from "mongodb";
import {commentsMapper} from "../../helpers/mappers";
import {UpdatedCommentAttr} from "../../types/types";

export const commentsRepository = {
    async addComment(newComment: Comment)  {

        const res = await CommentModelClass.create({...newComment})
        const id = res._id.toString();
        const { postId, ...restOfNewComment  } = newComment;

        return {id: id, ...restOfNewComment}
    },

    async updateComment(inputData: UpdatedCommentAttr): Promise<CommentOutput | null> {
        const {commentId, ...dataToUpdate} = inputData

        const comment = await CommentModelClass.findOneAndUpdate(
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

