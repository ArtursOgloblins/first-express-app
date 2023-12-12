import express from "express";
import {commentLikeValidation, commentValidation} from "../middleware/comments/commentInputValidation";
import {authWithToken, commentController} from "../composition-root";
import {RefreshTokenValidation} from "../middleware/auth/refreshTokenValitation";


const commentsRouter =  express.Router()
const refreshTokenValidation = new RefreshTokenValidation()

commentsRouter.get('/:id', refreshTokenValidation.checkRefreshToken, commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', authWithToken, commentValidation(), commentController.updateComment.bind(commentController))
commentsRouter.delete('/:commentId', authWithToken, commentController.deleteComment.bind(commentController))
commentsRouter.put('/:commentId/like-status', authWithToken, commentLikeValidation(), commentController.addLikeStatus.bind(commentController))

export default commentsRouter