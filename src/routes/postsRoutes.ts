import express from "express";
import {basicAuth} from "../middleware/auth/basicAuth";
import {CreatePostValidation, UpdatePostValidation} from "../middleware/posts/postsInputValidation";
import {commentValidation} from "../middleware/comments/commentInputValidation";
import {authWithToken, postController} from "../composition-root";
import {RefreshTokenValidation} from "../middleware/auth/refreshTokenValitation";


const postRouter = express.Router()

const refreshTokenValidation = new RefreshTokenValidation()

postRouter.get('/', postController.getPosts.bind(postController))
postRouter.get('/:id', postController.getPostById.bind(postController))
postRouter.post('/', basicAuth, CreatePostValidation(true), postController.createPost.bind(postController))
postRouter.put('/:id', basicAuth, UpdatePostValidation(), postController.updatePost.bind(postController))
postRouter.delete('/:id', basicAuth, postController.deletePost.bind(postController))
postRouter.post('/:postId/comments',authWithToken, commentValidation(), postController.createComment.bind(postController))
postRouter.get('/:postId/comments', refreshTokenValidation.checkRefreshToken, postController.getCommentsByPostId.bind(postController))

export  default postRouter