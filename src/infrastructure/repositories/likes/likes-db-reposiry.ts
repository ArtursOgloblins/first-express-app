import {CommentLikesModel, Likes} from "../../../domain/Likes";
import {UpdateLikeParams} from "../../../types/types";
import {injectable} from "inversify";

@injectable()
export class LikesRepository {

    async getLikeStatus(commentId: string, userId: string) {
        const commentLikeStatus = await CommentLikesModel.findOne({commentId: commentId, userId: userId})
        if (!commentLikeStatus) {
            return null
        } else {
            return commentLikeStatus
        }
    }
    async createLikeStatus(newLikeStatus: Likes) {
        return await CommentLikesModel.create({...newLikeStatus})
    }

    async updateLikeStatus(inputData: UpdateLikeParams) {
        const {entityId, userId, likeStatus} = inputData

        const updatedLikeStatus = await CommentLikesModel.findOneAndUpdate(
            {entityId: entityId, userId: userId},
            {$set: { likeStatus: likeStatus }},
            {returnDocument: 'after'}
        )
        return updatedLikeStatus
    }
}

