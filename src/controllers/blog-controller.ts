import {BlogsQueryRepository} from "../repositories/blogs/blogs-query-repo";
import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {getQueryParams} from "../helpers/query-params";
import {BlogQueryParams, PostQueryParams} from "../types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";

export class BlogController {
    constructor(protected blogsQueryRepository: BlogsQueryRepository,
                protected blogsService: BlogsService,
                protected postsService: PostsService) {
    }
    async getBlogs(req: Request, res: Response) {
        const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);
        const searchNameTerm = req.query.searchNameTerm?.toString() || null;

        const getBlogParams: BlogQueryParams = {
            searchNameTerm,
            sortBy,
            sortDirection,
            pageSize,
            pageNumber
        }

        const blogs = await this.blogsQueryRepository.getBlogs(getBlogParams)
        return res.send(blogs)
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogsQueryRepository.getBlogById(req.params.id)
        if (blog) {
            return res.send(blog)
        } else {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }

    async getPostsByBlogId(req: Request, res: Response) {
        const blogId = req.params.id
        const blog = await this.blogsQueryRepository.getBlogById(blogId)
        if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND)

        const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);

        const getPostsParams: PostQueryParams = {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber
        }

        const posts = await this.blogsQueryRepository.getPostsByBlogId(blogId, getPostsParams)
        return res.send(posts)
    }

    async createBlog(req: Request, res: Response) {
        const {name, description, websiteUrl} = req.body
        console.log('newBlogIdStarted')
        const newBlogId = await this.blogsService.addBlog({name, description, websiteUrl})
        console.log('newBlogId', newBlogId)
        const newBlog = await this.blogsQueryRepository.getBlogById(newBlogId)

        return res.status(HTTP_STATUS.CREATED).send(newBlog)
    }

    async createPost(req: Request, res: Response) {
        const blogId = req.params.id
        const newPost = await this.postsService.createPost({blogId, ...req.body})
        if (!newPost) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND)
        } else {
            return res.status(HTTP_STATUS.CREATED).send(newPost)
        }
    }

    async updateBlog(req: Request, res: Response) {
        const id = req.params.id

        const {name, description, websiteUrl} = req.body
        const updatedBlog = await this.blogsService.updateBlog({id, name, description, websiteUrl})

        if (updatedBlog) {
            res.status(HTTP_STATUS.NO_CONTENT).send()
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }

    async deleteBlogById(req: Request, res: Response) {
        const isDeleted = await this.blogsQueryRepository.removeBlogById(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }
}