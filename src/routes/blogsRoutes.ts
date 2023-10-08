import express, {Request, Response} from "express";
import {blogsService} from "../domain/blogs-service"
import {blogValidationPost} from "../middleware/blogs/blogInputValidations";
import {InputValidationResult} from "../middleware/inputValidationResult"
import {basicAuth} from "../middleware/authorization";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repo";
import {BlogQueryParams} from "../types";

const blogRouter = express.Router();

blogRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm: string | null = req.query.searchNameTerm?.toString() || null
    const sortBy: string = req.query.sortBy?.toString() || 'createdAt'
    const sortDirection: 'asc' | 'desc' = req.query.sortDirection?.toString().toLowerCase() === 'asc' ? 'asc' : 'desc';
    const pageSize: number = req.query.pageSize ? Number(req.query.pageSize) : 10
    const pageNumber:number = req.query.pageNumber ? Number(req.query.pageNumber) : 1

    const getBlogParams: BlogQueryParams = {
        searchNameTerm,
        sortBy,
        sortDirection,
        pageSize,
        pageNumber}

    const blogs = await blogsQueryRepository.getBlogs(getBlogParams)
    res.send(blogs)
})

blogRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsQueryRepository.getBlogById(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
})

blogRouter.post('/', basicAuth, blogValidationPost, InputValidationResult,
    async (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlogId  = await blogsService.addBlog({name, description, websiteUrl})
    const newBlog = await blogsQueryRepository.getBlogById(newBlogId)
    res.status(201).send(newBlog)
})

blogRouter.put('/:id', basicAuth, blogValidationPost, InputValidationResult, async (req:Request, res: Response) => {
    const id = req.params.id

    const {name, description, websiteUrl} = req.body
    const updatedBlog = await blogsService.updateBlog({id,name, description, websiteUrl})

    if (updatedBlog) {
        res.status(204).send()
    } else {
        res.sendStatus(404)
    }
})

blogRouter.delete('/:id', basicAuth, async (req:Request, res:Response) => {
    const isDeleted = await blogsQueryRepository.removeBlogById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

export default blogRouter