import {LikesModel, Likes, LikeStatuses} from "../../../domain/Likes";
import {UpdateLikeParams} from "../../../types/types";
import {injectable} from "inversify";

@injectable()
export class LikesRepository {

    async getLikeStatus(entityId: string, userId: string) {
        const commentLikeStatus = await LikesModel.findOne({entityId: entityId, userId: userId})
        if (!commentLikeStatus) {
            return null
        } else {
            return commentLikeStatus
        }
    }
    async createLikeStatus(newLikeStatus: Likes) {
        return await LikesModel.create({...newLikeStatus})
    }

    async updateLikeStatus(inputData: UpdateLikeParams) {
        const {entityId, userId, likeStatus} = inputData

        const updatedLikeStatus = await LikesModel.findOneAndUpdate(
            {entityId: entityId, userId: userId},
            {$set: { likeStatus: likeStatus }},
            {returnDocument: 'after'}
        )
        return updatedLikeStatus
    }

    async getLikeCountByEntityId(id: string){
        return LikesModel.countDocuments({entityId: id, likeStatus: LikeStatuses.Like});
    }

    async getDislikeCountByEntityId(id: string){
        return LikesModel.countDocuments({ entityId: id, likeStatus: LikeStatuses.Dislike })
    }

    async getMyLikeStatus(entityId: string, userId: string | null) {
        const userLikeStatus = await LikesModel.findOne({ entityId: entityId, userId: userId })
        return userLikeStatus ? userLikeStatus.likeStatus : LikeStatuses.None
    }

    async getNewestLikes(id: string, count: number) {
        return LikesModel
            .find({entityId: id, likeStatus: LikeStatuses.Like})
            .sort({createdAt: -1})
            .limit(count).lean()
    }
}

