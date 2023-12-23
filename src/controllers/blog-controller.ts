import {BlogsQueryRepository} from "../infrastructure/repositories/blogs/blogs-query-repo";
import {BlogsService} from "../application/services/blogs-service";
import {PostsService} from "../application/services/posts-service";
import {Request, Response} from "express";
import {getQueryParams} from "../helpers/query-params";
import {BlogQueryParams, PostQueryParams} from "../types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {inject, injectable} from "inversify";
import {AuthRepository} from "../infrastructure/repositories/auth/auth-db-repo";

@injectable()
export class BlogController {
    constructor(@inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(BlogsService) protected blogsService: BlogsService,
                @inject(PostsService) protected postsService: PostsService) {
    }

    async getBlogs(req: Request, res: Response) {
        try {
            const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req)
            const searchNameTerm = req.query.searchNameTerm?.toString() || null

            const getBlogParams: BlogQueryParams = {
                searchNameTerm,
                sortBy,
                sortDirection,
                pageSize,
                pageNumber
            }

            const blogs = await this.blogsQueryRepository.getBlogs(getBlogParams)
            return res.send(blogs)

        } catch (error) {
            console.error('Failed in getting blogs:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async getBlogById(req: Request, res: Response) {
        try {
            const blog = await this.blogsQueryRepository.getBlogById(req.params.id)
            if (blog) {
                return res.send(blog)
            } else {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND)
            }
        } catch (error) {
            console.error('Failed in getting blog by id:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async getPostsByBlogId(req: Request, res: Response) {
        try {
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
        } catch (error) {
            console.error('Failed in getting post by blog id:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async createBlog(req: Request, res: Response) {
        try {
            const {name, description, websiteUrl} = req.body
            console.log('newBlogIdStarted')
            const newBlogId = await this.blogsService.addBlog({name, description, websiteUrl})
            console.log('newBlogId', newBlogId)
            const newBlog = await this.blogsQueryRepository.getBlogById(newBlogId)

            return res.status(HTTP_STATUS.CREATED).send(newBlog)
        } catch (error) {
            console.error('Failed in creating blog:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async createPost(req: Request, res: Response) {
        try {
            const blogId = req.params.id
            const newPost = await this.postsService.createPost({blogId, ...req.body})
            if (!newPost) {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND)
            } else {
                return res.status(HTTP_STATUS.CREATED).send(newPost)
            }
        } catch (error) {
            console.error('Failed in creating post:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async updateBlog(req: Request, res: Response) {
        try {
            const id = req.params.id

            const {name, description, websiteUrl} = req.body
            const updatedBlog = await this.blogsService.updateBlog({id, name, description, websiteUrl})

            if (updatedBlog) {
                res.status(HTTP_STATUS.NO_CONTENT).send()
            } else {
                res.sendStatus(HTTP_STATUS.NOT_FOUND)
            }
        } catch (error) {
            console.error('Failed in updating blog:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async deleteBlogById(req: Request, res: Response) {
        try {
            const isDeleted = await this.blogsQueryRepository.removeBlogById(req.params.id)
            if (isDeleted) {
                res.sendStatus(HTTP_STATUS.NO_CONTENT)
            } else {
                res.sendStatus(HTTP_STATUS.NOT_FOUND)
            }
        } catch (error) {
            console.error('Failed in deleting blog by id:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }
}