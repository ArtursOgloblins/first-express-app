import {UpdateLikeParams} from "../../types/types";
import {inject} from "inversify";
import {LikesRepository} from "../../infrastructure/repositories/likes/likes-db-reposiry";

export class LikesService {
    constructor(@inject(LikesRepository) protected likesRepository: LikesRepository) {
    }

    async updateLikeStatus (inputData: UpdateLikeParams) {
        const {entityId, userId, likeStatus} = inputData
        const like = await this.likesRepository.getLikeStatus(entityId, userId)
        console.log('like', like)
        if (!like) {
            console.log('CreateLikeDislike')
            return await this.likesRepository.createLikeStatus(inputData)
        } else {
            console.log('AddLikeDislike')
            return await this.likesRepository.updateLikeStatus(inputData)
        }
    }
}