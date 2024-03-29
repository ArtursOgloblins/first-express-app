import {CommentsQueryRepository} from "../infrastructure/repositories/comments/comments-query-repo";
import {CommentsService} from "../application/services/comments-service";
import {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {UpdateLikeParams} from "../types/types";
import {JwtService} from "../application/services/jwt-service";
import {inject, injectable} from "inversify";
import {LikesService} from "../application/services/likes-service";
import {UsersQueryRepository} from "../infrastructure/repositories/users/users-query-repo";


@injectable()
export class CommentController {
    constructor(@inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject (LikesService) protected likesService: LikesService,
                @inject(JwtService) protected jwtService: JwtService) {
    }

    async getCommentById(req: Request, res: Response) {

        const user = req.user
        let  userId = null
        if (user) {
            userId = req.user!._id.toString()
        }

        const comment = await this.commentsQueryRepository.getCommentById(req.params.id, userId)
        if (comment) {
            res.send(comment)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }

    async updateComment(req: Request, res: Response) {
        const {commentId} = req.params
        const userId = req.user!._id.toString()
        const {content} = req.body

        const comment = await this.commentsQueryRepository.getCommentById(commentId, userId);
        if (!comment) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        }
        if (comment.commentatorInfo.userId !== userId) {
            return res.sendStatus(HTTP_STATUS.FORBIDDEN);
        }

        const updatedComment = await this.commentsService.updateComment({commentId, content})
        if (updatedComment) {
            res.status(HTTP_STATUS.NO_CONTENT).send(updatedComment)
        } else {
            res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteComment(req: Request, res: Response) {
        try {
            const {commentId} = req.params
            const userId = req.user!._id.toString()

            const comment = await this.commentsQueryRepository.getCommentById(commentId, userId);
            if (!comment) {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND);
            }
            if (comment.commentatorInfo.userId !== userId) {
                return res.sendStatus(HTTP_STATUS.FORBIDDEN);
            }
            const isDeleted = await this.commentsQueryRepository.removeCommentById(commentId)
            if (isDeleted) {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            } else {
                return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            console.error('Failed in deleting comment:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async addLikeStatus(req: Request, res: Response) {
        try {
            const {commentId} = req.params
            const userId = req.user!._id.toString()
            const userLogin = req.user!.accountData.login

            const comment = await this.commentsQueryRepository.getCommentById(commentId,  userId)
            if (!comment) {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND);
            }

            const likeStatusData: UpdateLikeParams = {
                entityId: commentId.toString(),
                userId: userId,
                login: userLogin,
                likeStatus: req.body.likeStatus,
                createdAt: new Date().toISOString()
            }

            await this.likesService.updateLikeStatus(likeStatusData)
            const updateCommentLikesInfo = await this.commentsService.updateCommentLikes(commentId)

            if (!updateCommentLikesInfo) {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            } else {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            }

        } catch (error) {
            console.error('Failed in add Comment like status:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }
}

