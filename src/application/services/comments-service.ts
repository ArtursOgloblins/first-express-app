import {CommentsRepository} from "../../infrastructure/repositories/comments/comments-db-repo";
import {AddCommentAttr, UpdatedCommentAttr} from "../../types/types";
import {PostComment, CommentatorInfo, CommentModel} from "../../domain/Comments";
import {CommentsQueryRepository} from "../../infrastructure/repositories/comments/comments-query-repo";
import {inject, injectable} from "inversify";
import {LikesInfo} from "../../domain/Likes";
import {LikesService} from "./likes-service";


@injectable()
export class CommentsService {
    constructor( @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                 @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                 @inject(LikesService) protected likesService: LikesService) {
    }

    async createComment (inputData: AddCommentAttr) {
        try {
            const {content, postId} = inputData
            const createdAt = new Date().toISOString()
            const userId = inputData.userId.toString()
            const userLogin = inputData.userLogin

            const commentatorInfo = new CommentatorInfo(userId, userLogin)
            const likesInfo = new LikesInfo(0,0, 'None')

            const newCommentInstance = new PostComment(content, commentatorInfo, createdAt, postId, likesInfo)

            const newComment = CommentModel.createComment(newCommentInstance)

            await this.commentsRepository.save(newComment)
            return newComment
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateComment (inputData: UpdatedCommentAttr) {
        return await this.commentsRepository.updateComment(inputData)
    }

    async updateCommentLikes(commentId: string) {
        const likesCount = await this.likesService.getLikeCountByEntityId(commentId)
        const dislikesCount = await this.likesService.getDislikeCountByEntityId(commentId)
        return await this.commentsRepository.updateCommentLikes(commentId, likesCount, dislikesCount)
    }
}