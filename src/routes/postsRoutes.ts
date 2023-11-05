import express, {Request, Response} from "express";
import {basicAuth} from "../middleware/auth/basicAuth";
import {CreatePostValidation, UpdatePostValidation} from "../middleware/posts/postsInputValidation";
import {postService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts/posts-query-repo";
import {PostQueryParams} from "../types/types";
import { HttpStatusCodes as HTTP_STATUS }  from "../helpers/httpStatusCodes";
import {commentsService} from "../domain/comments-service";
import {commentValidation} from "../middleware/comments/commentInputValidation";
import {authWithToken} from "../middleware/auth/authWithToken";
import {getQueryParams} from "../helpers/query-params";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repo";


const postRouter = express.Router()

postRouter.get('/', async (req: Request, res: Response) => {
    const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);

    const getPostsParams: PostQueryParams = {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    }

    const posts = await postsQueryRepository.getPosts(getPostsParams)
    res.send(posts)
})

postRouter.get('/:id', async (req:Request, res:Response) => {
    const post = await postsQueryRepository.getPostById(req.params.id)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }
})

postRouter.post('/', basicAuth, CreatePostValidation(true),
    async (req:Request, res: Response) => {
    const newPost = await postService.createPost(req.body)
        if (!newPost) {
            res.status(HTTP_STATUS.BAD_REQUEST)
        } else {
            res.status(HTTP_STATUS.CREATED).send(newPost)
        }
})

postRouter.put('/:id', basicAuth, UpdatePostValidation(),
    async (req:Request, res: Response) => {
        const id = req.params.id

        const updatedPost = await postService.updatePost({id, ...req.body})

        if (updatedPost){
            res.status(HTTP_STATUS.NO_CONTENT).send(updatedPost)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    })

postRouter.delete('/:id', basicAuth, async (req:Request, res: Response) => {
    const isDeleted = await postsQueryRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }
})

postRouter.post('/:postId/comments',authWithToken, commentValidation(),
    async (req:Request, res: Response) => {

    const postId = req.params.postId
    const post = await postsQueryRepository.getPostById(postId)
    if(!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND)

    const newComment  = await commentsService.createComment(
        { content: req.body.content, userId: req.user!._id, userLogin: req.user!.accountData.login, postId: postId})

    if (!newComment) {
        res.status(HTTP_STATUS.BAD_REQUEST)
    } else {
        res.status(HTTP_STATUS.CREATED).send(newComment)
    }
})

postRouter.get('/:postId/comments',async (req: Request, res:Response)=> {
    const postId = req.params.postId
    const post = await postsQueryRepository.getPostById(postId)
    if(!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND)

    const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);

    const getCommentsParams: PostQueryParams = {
        sortBy,
        sortDirection,
        pageSize,
        pageNumber
    }

    const comments = await commentsQueryRepository.getCommentsByPost(postId, getCommentsParams)
    res.send(comments)
})

export  default postRouter