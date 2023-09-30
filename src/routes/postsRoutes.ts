import express, {Request, Response} from "express";
import {basicAuth} from "../middleware/authorization";
import {postsRepository} from "../repositories/posts/posts-db-repository";
import {postsInputValidation} from "../middleware/posts/postsInputValidation";
import {InputValidationResult} from "../middleware/inputValidationResult";


const postRouter = express.Router()

postRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepository.getPosts()
    res.send(posts)
})

postRouter.get('/:id', async (req:Request, res:Response) => {
    const post = await postsRepository.getPostById(req.params.id)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})

postRouter.post('/', basicAuth, postsInputValidation, InputValidationResult,
    async (req:Request, res: Response) => {
    const newPost = await postsRepository.addPost(req.body)
    res.status(201).send(newPost)
})

postRouter.put('/:id', basicAuth, postsInputValidation, InputValidationResult,
    async (req:Request, res: Response) => {
        const id = req.params.id

        if (Object.keys(req.body).length === 0) {
            return res.status(401).send('Request body is required.');
        }

        const updatedPost = await postsRepository.updatePost({id, ...req.body})

        if (updatedPost){
            res.status(204).send(updatedPost)
        } else {
            res.sendStatus(404)
        }
    })

postRouter.delete('/:id', basicAuth, async (req:Request, res: Response) => {
    const isDeleted = await postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

export  default postRouter