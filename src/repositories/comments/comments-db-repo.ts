import {BlogComment, CommentModel} from "../../models/Comments";
import {ObjectId} from "mongodb";
import {UpdateCommentLikeParams, UpdatedCommentAttr} from "../../types/types";
import {CommentLikes, CommentLikesModel} from "../../models/CommentsLikesDislikes";


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

    async createCommentLikeStatus(newCommentLikeStatus: CommentLikes) {
        return await CommentLikesModel.create({...newCommentLikeStatus})
    }

    async updateCommentLikeStatus(inputData: UpdateCommentLikeParams) {
        const {commentId, userId, likeStatus} = inputData

        const commentLikeStatus = await CommentLikesModel.findOneAndUpdate(
            {commentId: commentId, userId: userId},
            {$set: { likeStatus: likeStatus }},
            {returnDocument: 'after'}
        )
        return commentLikeStatus

    }

    async removeCommentLikeStatus(commentId: string, userId: string) {
        const result = await CommentLikesModel.deleteOne({commentId: commentId, userId: userId})
        return result.deletedCount === 1
    }
}
