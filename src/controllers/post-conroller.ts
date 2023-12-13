import {PostsQueryRepository} from "../repositories/posts/posts-query-repo";
import {PostsService} from "../domain/posts-service";
import {CommentsService} from "../domain/comments-service";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repo";
import {Request, Response} from "express";
import {getQueryParams} from "../helpers/query-params";
import {PostQueryParams} from "../types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {JwtService} from "../application/jwt-service";

export class PostController {
    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService,
                protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepository,
                protected jwtService: JwtService) {
    }
    async getPosts(req: Request, res: Response) {
        const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);

        const getPostsParams: PostQueryParams = {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber
        }

        const posts = await this.postsQueryRepository.getPosts(getPostsParams)
        res.send(posts)
    }

    async getPostById(req: Request, res: Response) {
        const post = await this.postsQueryRepository.getPostById(req.params.id)
        if (post) {
            res.send(post)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }

    async createPost(req: Request, res: Response) {
        const newPost = await this.postsService.createPost(req.body)
        if (!newPost) {
            res.status(HTTP_STATUS.BAD_REQUEST)
        } else {
            res.status(HTTP_STATUS.CREATED).send(newPost)
        }
    }

    async updatePost(req: Request, res: Response) {
        const id = req.params.id

        const updatedPost = await this.postsService.updatePost({id, ...req.body})

        if (updatedPost) {
            res.status(HTTP_STATUS.NO_CONTENT).send(updatedPost)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }

    async deletePost(req: Request, res: Response) {
        const isDeleted = await this.postsQueryRepository.deletePostById(req.params.id)
        if (isDeleted) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    }

    async createComment(req: Request, res: Response) {

        const postId = req.params.postId
        const post = await this.postsQueryRepository.getPostById(postId)
        if (!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND)

        const newComment = await this.commentsService.createComment(
            {content: req.body.content, userId: req.user!._id, userLogin: req.user!.accountData.login, postId: postId})

        if (!newComment) {
            res.status(HTTP_STATUS.BAD_REQUEST)
        } else {
            res.status(HTTP_STATUS.CREATED).send(newComment)
        }
    }

    async getCommentsByPostId(req: Request, res: Response) {
        try {
            const postId = req.params.postId
            // const refreshToken = req.cookies.refreshToken
            // const refreshTokenDetails = await this.jwtService.getRefreshTokenDetails(refreshToken)
            //
            // const {userId} = refreshTokenDetails
            const user = req.user
            let  userId = null
            if (user) {
                userId = req.user!._id.toString()
            }
            const post = await this.postsQueryRepository.getPostById(postId)
            if (!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND)

            const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);

            const getCommentsParams: PostQueryParams = {
                sortBy,
                sortDirection,
                pageSize,
                pageNumber
            }

            const comments = await this.commentsQueryRepository.getCommentsByPost(postId, getCommentsParams, userId)
            if (comments) {
                return res.status(HTTP_STATUS.OK).send(comments)
            } else {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND);
            }
        } catch (error) {
            console.error('Failed in getting comments:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }

    }
}