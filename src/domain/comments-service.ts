import {CommentsRepository} from "../repositories/comments/comments-db-repo";
import {AddCommentAttr, UpdateCommentLikeParams, UpdatedCommentAttr} from "../types/types";
import {BlogComment, CommentatorInfo, LikesInfo} from "../models/Comments";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repo";

export class CommentsService {
    constructor( protected commentsRepository: CommentsRepository,
                 protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async createComment (inputData: AddCommentAttr) {
        const {content, postId} = inputData
        const createdAt = new Date().toISOString()
        const userId = inputData.userId.toString()
        const userLogin = inputData.userLogin

        const commentatorInfo = new CommentatorInfo(userId, userLogin)

        const likesInfo: LikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None"
        }

        const newComment = new BlogComment(content, commentatorInfo, createdAt, postId, likesInfo)

        return await this.commentsRepository.addComment(newComment)
    }

    async updateComment (inputData: UpdatedCommentAttr) {
        return await this.commentsRepository.updateComment(inputData)
    }

    async updateLikeStatus (inputData: UpdateCommentLikeParams) {
        const {commentId, userId, likeStatus} = inputData
        const commentLike = await this.commentsQueryRepository.getCommentLikeStatus(commentId, userId)
        console.log('commentLike', commentLike)
            if (!commentLike) {
                console.log('CreateLikeDislike')
                return await this.commentsRepository.createCommentLikeStatus(inputData)
            }
            if (likeStatus != 'None') {
                console.log('AddLikeDislike')
                return await this.commentsRepository.updateCommentLikeStatus(inputData)
            } else {
                return await this.commentsRepository.removeCommentLikeStatus(commentId, userId)
            }
    }
}