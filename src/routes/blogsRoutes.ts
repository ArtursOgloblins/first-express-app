import express, {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs/BlogsRepository";
import {videosRepository} from "../repositories/videos/videosRepository";

const blogRouter = express.Router();

blogRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogs()
    res.send(blogs)
})

blogRouter.get('/:id', (req: Request, res: Response) => {
    const blog = videosRepository.deleteVideoById(+req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
})

export default blogRouter