import express from "express";
import {commentValidation} from "../middleware/comments/commentInputValidation";
import {authWithToken, commentController} from "../composition-root";


const commentsRouter =  express.Router()


commentsRouter.get('/:id',authWithToken, commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', authWithToken, commentValidation(), commentController.updateComment.bind(commentController))
commentsRouter.delete('/:commentId', authWithToken, commentController.deleteComment.bind(commentController))
commentsRouter.put('/:commentId/like-status', authWithToken, commentController.addLikeStatus.bind(commentController))

export default commentsRouter