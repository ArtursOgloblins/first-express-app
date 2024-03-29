import {PostsQueryRepository} from "../infrastructure/repositories/posts/posts-query-repo";
import {PostsService} from "../application/services/posts-service";
import {CommentsService} from "../application/services/comments-service";
import {CommentsQueryRepository} from "../infrastructure/repositories/comments/comments-query-repo";
import {Request, Response} from "express";
import {getQueryParams} from "../helpers/query-params";
import {PostQueryParams, UpdateLikeParams} from "../types/types";
import {HttpStatusCodes as HTTP_STATUS} from "../helpers/httpStatusCodes";
import {JwtService} from "../application/services/jwt-service";
import {inject, injectable} from "inversify";
import {LikesService} from "../application/services/likes-service";

@injectable()
export class PostController {
    constructor(@inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(PostsService) protected postsService: PostsService,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(LikesService) protected likesService: LikesService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
                @inject(JwtService) protected jwtService: JwtService) {
    }
    async getPosts(req: Request, res: Response) {
        const user = req.user
        let userId = null
        if (user) {
            userId = req.user!._id.toString()
        }
        const {sortBy, sortDirection, pageSize, pageNumber} = getQueryParams(req);

        const getPostsParams: PostQueryParams = {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber
        }

        const posts = await this.postsQueryRepository.getPosts(getPostsParams, userId)
        res.send(posts)
    }

    async getPostById(req: Request, res: Response) {
        const user = req.user
        let userId = null
        if (user) {
            userId = req.user!._id.toString()
        }
        const post = await this.postsQueryRepository.getPostById(req.params.id, userId)
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
        try {
            const postId = req.params.postId
            const userId = req.user!._id.toString()
            const post = await this.postsQueryRepository.getPostById(postId, userId)
            if (!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND)

            const newCommentParams = {
                content: req.body.content,
                userId: req.user!._id,
                userLogin: req.user!.accountData.login,
                postId: postId
            }

            const newComment = await this.commentsService.createComment(newCommentParams)

            if (!newComment) {
                return res.status(HTTP_STATUS.BAD_REQUEST)
            } else {
                return res.status(HTTP_STATUS.CREATED).send(newComment)
            }
        } catch (error) {
            console.error('Failed in creating comment:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }

    async getCommentsByPostId(req: Request, res: Response) {
        try {
            const postId = req.params.postId
            const userId = req.user!._id.toString()

            const post = await this.postsQueryRepository.getPostById(postId, userId)

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

    async addLikeStatus(req: Request, res: Response) {
        try {
            const {postId} = req.params
            const userId = req.user!._id.toString()
            const userLogin = req.user!.accountData.login

            const post  = await this.postsQueryRepository.getPostById(postId, userId)
            console.log('post', post)

            if (!post) {
                return res.sendStatus(HTTP_STATUS.NOT_FOUND);
            }

            const likeStatusData: UpdateLikeParams = {
                entityId: postId.toString(),
                userId: userId,
                login: userLogin,
                likeStatus: req.body.likeStatus,
                createdAt: new Date().toISOString()
            }

            await this.likesService.updateLikeStatus(likeStatusData)
            const newestLikesCountToDisplay = 3

            const updatePostLikesInfo = await this.postsService.updatePostLikes(postId, newestLikesCountToDisplay)

            if (!updatePostLikesInfo) {
                return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
            } else {
                return res.sendStatus(HTTP_STATUS.NO_CONTENT)
            }

        } catch (error) {
            console.error('Failed in add Post like status:', error)
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST)
        }
    }
}