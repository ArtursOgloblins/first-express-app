import express, {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs/BlogsRepository";
import {blogsInputValidationResult, blogValidationPost} from "../middleware/blogs/inputValidations";
import {basicAuth} from "../middleware/authorization";

const blogRouter = express.Router();

blogRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogs()
    res.send(blogs)
})


blogRouter.post('/',basicAuth,  blogValidationPost, blogsInputValidationResult,
    (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlog = blogsRepository.addBlog({name, description, websiteUrl})
    res.status(201).send(newBlog)
})

blogRouter.get('/:id', (req: Request, res: Response) => {
    const blog = blogsRepository.getBlogById(+req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
})

export default blogRouter