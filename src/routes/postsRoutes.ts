import express from "express";
import {basicAuth} from "../middleware/auth/basicAuth";
import {CreatePostValidation, UpdatePostValidation} from "../middleware/posts/postsInputValidation";
import {commentValidation} from "../middleware/comments/commentInputValidation";
import {accessTokenChecker, container, tokenAuthenticator} from "../composition-root";
import {PostController} from "../controllers/post-conroller";
import {likeStatusValidation} from "../middleware/likes-validation";

const postController = container.resolve(PostController)

const postRouter = express.Router()

postRouter.get('/',accessTokenChecker, postController.getPosts.bind(postController))
postRouter.get('/:id', accessTokenChecker, postController.getPostById.bind(postController))
postRouter.post('/', basicAuth, CreatePostValidation(true), postController.createPost.bind(postController))
postRouter.put('/:id', basicAuth, UpdatePostValidation(), postController.updatePost.bind(postController))
postRouter.delete('/:id', basicAuth, postController.deletePost.bind(postController))
postRouter.post('/:postId/comments',tokenAuthenticator, commentValidation(), postController.createComment.bind(postController))
postRouter.get('/:postId/comments', accessTokenChecker, postController.getCommentsByPostId.bind(postController))
postRouter.put('/:postId/like-status', tokenAuthenticator, likeStatusValidation(), postController.addLikeStatus.bind(postController))

export  default postRouter