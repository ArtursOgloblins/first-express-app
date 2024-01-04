import {UpdateLikeParams} from "../../types/types";
import {inject, injectable} from "inversify";
import {LikesRepository} from "../../infrastructure/repositories/likes/likes-db-reposiry";

@injectable()
export class LikesService {
    constructor(@inject(LikesRepository) protected likesRepository: LikesRepository) {
    }

    async updateLikeStatus(inputData: UpdateLikeParams) {
        try {
            const {entityId, userId} = inputData
            const like = await this.likesRepository.getLikeStatus(entityId, userId)
            if (!like) {
                return await this.likesRepository.createLikeStatus(inputData)
            } else {
                return await this.likesRepository.updateLikeStatus(inputData)
            }
        } catch (error) {
            console.error('Failed in updateLikeStatus likes-service:', error)
        }
    }
    async getLikeCountByEntityId(id: string) {
        try {
            let count = await this.likesRepository.getLikeCountByEntityId(id)
            if (!count) {
                count = 0
            }
            return count
        } catch (error) {
            console.error('Failed in getLikeCountByEntityId likes-service:', error)
            return 0
        }
    }

    async getDislikeCountByEntityId(id: string) {
        try {
            let count = await this.likesRepository.getDislikeCountByEntityId(id)
            if (!count) {
                count = 0
            }
            return count
        } catch (error) {
            console.error('Failed in getDislikeCountByEntityId likes-service:', error)
            return 0
        }
    }

    async getLastLikesByNumber(id: string, count: number) {
        try {
            return await this.likesRepository.getNewestLikes(id, count)
        } catch (error) {
            console.error('Failed in getLikeCountByEntityId likes-service:', error)
        }
    }
}