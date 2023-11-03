import express, {Request, Response} from "express";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repo";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {authWithToken} from "../middleware/auth/authWithToken";
import {commentValidation} from "../middleware/comments/commentInputValidation";
import {commentsService} from "../domain/comments-service";


const commentsRouter =  express.Router();

commentsRouter.get('/:id', async (req: Request, res: Response ) => {
    const comment = await commentsQueryRepository.getCommentById(req.params.id)
    if (comment) {
        res.send(comment)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }
})

commentsRouter.put('/:commentId', authWithToken, commentValidation(),
    async (req:Request, res: Response) => {
        const commentId = req.params.commentId
        const userId = req.user!._id.toString()

        const comment = await commentsQueryRepository.getCommentById(commentId);
        if (!comment) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        }
        if (comment.commentatorInfo.userId !== userId) {
            return res.sendStatus(HTTP_STATUS.FORBIDDEN);
        }
        const updatedComment = await commentsService.updateComment({commentId, userId, ...req.body})
        if (updatedComment) {
            res.status(HTTP_STATUS.NO_CONTENT).send(updatedComment);
        } else {
            res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    })

commentsRouter.delete('/:commentId', authWithToken, async (req: Request, res: Response) => {
    const commentId = req.params.commentId
    const userId = req.user!._id.toString()

    const comment = await commentsQueryRepository.getCommentById(commentId);
    if (!comment) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
    if (comment.commentatorInfo.userId !== userId) {
        return res.sendStatus(HTTP_STATUS.FORBIDDEN);
    }
    const isDeleted = await commentsQueryRepository.removeCommentById(commentId)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
})

export default commentsRouter