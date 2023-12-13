import {CommentsQueryRepository} from "../repositories/comments/comments-query-repo";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {UpdateCommentLikeParams} from "../types/types";
import {JwtService} from "../application/jwt-service";

export class CommentController {
    constructor(protected commentsQueryRepository: CommentsQueryRepository,
                protected commentsService: CommentsService,
                protected jwtService: JwtService) {
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

        const comment = await this.commentsQueryRepository.getCommentById(commentId, userId);
        if (!comment) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        }
        if (comment.commentatorInfo.userId !== userId) {
            return res.sendStatus(HTTP_STATUS.FORBIDDEN);
        }
        const updatedComment = await this.commentsService.updateComment({commentId, userId, ...req.body})
        if (updatedComment) {
            res.status(HTTP_STATUS.NO_CONTENT).send(updatedComment);
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
                res.sendStatus(HTTP_STATUS.NO_CONTENT)
            } else {
                res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
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

            const comment = await this.commentsQueryRepository.getCommentById(commentId,  userId)
            if (!comment) {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND);
            }

            const likeStatusData: UpdateCommentLikeParams = {
                commentId: commentId.toString(),
                userId: userId,
                likeStatus: req.body.likeStatus
            }

            const updatedLikeStatus = await this.commentsService.updateLikeStatus(likeStatusData)

            if (!updatedLikeStatus) {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            } else {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            }

        } catch (error) {
            console.error('Failed in addComment like status:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }
}

