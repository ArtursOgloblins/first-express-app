import express, {Request, Response} from "express";
import {basicAuth} from "../middleware/authorization";
import {postsInputValidation} from "../middleware/posts/postsInputValidation";
import {InputValidationResult} from "../middleware/inputValidationResult";
import {postService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts/posts-query-repo";
import {PostQueryParams} from "../types";
import { HttpStatusCodes as HTTP_STATUS }  from "../helpers/httpStatusCodes";


const postRouter = express.Router()

postRouter.get('/', async (req: Request, res: Response) => {
    const pageNumber: number = req.query.pageNumber ? Number(req.query.pageNumber) : 1
    const pageSize: number = req.query.pageSize ? Number(req.query.pageSize) : 10
    const sortBy: string = req.query.sortBy?.toString() || 'createdAt'
    const sortDirection: 'asc' | 'desc' = req.query.sortDirection?.toString().toLowerCase() === 'asc' ? 'asc' : 'desc'

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

postRouter.post('/', basicAuth, postsInputValidation, InputValidationResult,
    async (req:Request, res: Response) => {
    const newPost = await postService.addPost(req.body)
    res.status(HTTP_STATUS.CREATED).send(newPost)
})

postRouter.put('/:id', basicAuth, postsInputValidation, InputValidationResult,
    async (req:Request, res: Response) => {
        const id = req.params.id

        if (Object.keys(req.body).length === 0) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).send('Request body is required.');
        }

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

export  default postRouter