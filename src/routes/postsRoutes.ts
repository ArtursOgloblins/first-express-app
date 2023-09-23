import express, {Request, Response} from "express";
import {basicAuth} from "../middleware/authorization";
import {postsRepository} from "../repositories/posts/postsRepository";
import {postsInputValidation} from "../middleware/posts/postsInputValidation";
import {InputValidationResult} from "../middleware/inputValidationResult";


const postRouter = express.Router()

postRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getPosts()
    const postsWithIdString = posts.map(p => ({...p, id: p.id.toString()}))
    res.send(postsWithIdString)
})

postRouter.get('/:id', (req:Request, res:Response) => {
    const post = postsRepository.getPostById(req.params.id)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})

postRouter.post('/', basicAuth, postsInputValidation, InputValidationResult,
    (req:Request, res: Response) => {
    const newPost = postsRepository.addPost(req.body)
    res.status(201).send(newPost)
})

postRouter.put('/:id', basicAuth, postsInputValidation, InputValidationResult,
    (req:Request, res: Response) => {
        const id = +req.params.id
        const updatedPost = postsRepository.updatePost({id, ...req.body})

        if (updatedPost){
            res.status(204).send(updatedPost)
        } else {
            res.sendStatus(404)
        }
    })

postRouter.delete('/:id', basicAuth, (req:Request, res: Response) => {
    const isDeleted = postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

export  default postRouter