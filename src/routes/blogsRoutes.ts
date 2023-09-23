import express, {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs/BlogsRepository";

const blogRouter = express.Router();

blogRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogs()
    res.send(blogs)
})

export default blogRouter