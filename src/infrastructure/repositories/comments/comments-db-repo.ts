import {BlogComment, CommentModel} from "../../../domain/Comments";
import {ObjectId} from "mongodb";
import {UpdatedCommentAttr} from "../../../types/types";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository {
    async addComment(newComment: BlogComment)  {

        const res = await CommentModel.create({...newComment})
        const id = res._id.toString();
        const { postId, ...restOfNewComment  } = newComment;

        return {id: id, ...restOfNewComment}
    }

    async updateComment(inputData: UpdatedCommentAttr): Promise<BlogComment | null> {
        const {commentId, ...dataToUpdate} = inputData

        const updatedComment = await CommentModel.findOneAndUpdate(
            {_id: new ObjectId(commentId)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if(!updatedComment) {
            return null
        }
        return updatedComment
    }
}
