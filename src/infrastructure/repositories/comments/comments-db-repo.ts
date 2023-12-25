import {PostComment, CommentModel} from "../../../domain/Comments";
import {ObjectId} from "mongodb";
import {UpdatedCommentAttr} from "../../../types/types";
import {injectable} from "inversify";


@injectable()
export class CommentsRepository {
    async addComment(newComment: PostComment) {

        const res = await CommentModel.create({...newComment})
        const id = res._id.toString();
        const {postId, ...restOfNewComment} = newComment;

        return {id: id, ...restOfNewComment}
    }

    async save(model: any) {
        await model.save()
    }

    async updateComment(inputData: UpdatedCommentAttr): Promise<PostComment | null> {
        const {commentId, ...dataToUpdate} = inputData

        const updatedComment = await CommentModel.findOneAndUpdate(
            {_id: new ObjectId(commentId)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if (!updatedComment) {
            return null
        }
        return updatedComment
    }

    async updateCommentLikes(commentId: string, likesCount: number, dislikesCount: number): Promise<PostComment | null> {
        const dataToUpdate = {
            'likesInfo.likesCount': likesCount,
            'likesInfo.dislikesCount': dislikesCount
        };
        const updatedComment = await CommentModel.findOneAndUpdate(
            {_id: new ObjectId(commentId)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if (!updatedComment) {
            return null
        }
        return updatedComment
    }
}
