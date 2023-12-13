import express from "express";
import {commentLikeValidation, commentValidation} from "../middleware/comments/commentInputValidation";
import {authWithToken, checkAccessToken, commentController} from "../composition-root";


const commentsRouter =  express.Router()

commentsRouter.get('/:id', checkAccessToken, commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', authWithToken, commentValidation(), commentController.updateComment.bind(commentController))
commentsRouter.delete('/:commentId', authWithToken, commentController.deleteComment.bind(commentController))
commentsRouter.put('/:commentId/like-status', authWithToken, commentLikeValidation(), commentController.addLikeStatus.bind(commentController))

export default commentsRouter