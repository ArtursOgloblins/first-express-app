import express, {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs/blogs-db-repository";
import {blogValidationPost} from "../middleware/blogs/blogInputValidations";
import {InputValidationResult} from "../middleware/inputValidationResult"
import {basicAuth} from "../middleware/authorization";

const blogRouter = express.Router();

blogRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getBlogs()
    res.send(blogs)
})

blogRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsRepository.getBlogById(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.post('/', basicAuth, blogValidationPost, InputValidationResult,
    async (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlog = await blogsRepository.addBlog({name, description, websiteUrl})
    res.status(201).send(newBlog)
})

blogRouter.put('/:id', basicAuth, blogValidationPost, InputValidationResult, async (req:Request, res: Response) => {
    const id = req.params.id

    const {name, description, websiteUrl} = req.body
    const updatedBlog = await blogsRepository.updateBlog({id,name, description, websiteUrl})

    if (updatedBlog) {
        res.status(204).send(updatedBlog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.delete('/:id', basicAuth, async (req:Request, res:Response) => {
    const isDeleted =await  blogsRepository.removeBlogById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

export default blogRouter