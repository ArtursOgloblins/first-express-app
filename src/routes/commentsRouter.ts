import express from "express";
import {commentValidation} from "../middleware/comments/commentInputValidation";
import {accessTokenChecker, container, tokenAuthenticator} from "../composition-root";
import {CommentController} from "../controllers/comment-controller";
import {likeStatusValidation} from "../middleware/likes-validation";

const commentController = container.resolve(CommentController)

const commentsRouter =  express.Router()

commentsRouter.get('/:id', accessTokenChecker, commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', tokenAuthenticator, commentValidation(), commentController.updateComment.bind(commentController))
commentsRouter.delete('/:commentId', tokenAuthenticator, commentController.deleteComment.bind(commentController))
commentsRouter.put('/:commentId/like-status', tokenAuthenticator, likeStatusValidation(), commentController.addLikeStatus.bind(commentController))

export default commentsRouter