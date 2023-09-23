import express, {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs/BlogsRepository";
import {blogValidationPost} from "../middleware/blogs/blogInputValidations";
import {InputValidationResult} from "../middleware/inputValidationResult"
import {basicAuth} from "../middleware/authorization";

const blogRouter = express.Router();

blogRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogs()
    const blogsWithIdString = blogs.map(b => ({...b, id: b.id.toString()}))
    res.send(blogsWithIdString)
})

blogRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogsRepository.getBlogById(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.post('/', basicAuth, blogValidationPost, InputValidationResult,
    (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlog = blogsRepository.addBlog({name, description, websiteUrl})
    res.status(201).send(newBlog)
})

blogRouter.put('/:id', basicAuth, blogValidationPost, InputValidationResult, (req:Request, res: Response) => {
    const id = req.params.id
    const {name, description, websiteUrl} = req.body
    const updatedBlog = blogsRepository.updateBlog({id,name, description, websiteUrl})

    if (updatedBlog) {
        res.status(204).send(updatedBlog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.delete('/:id', basicAuth, (req:Request, res:Response) => {
    const isDeleted = blogsRepository.removeBlogById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

export default blogRouter