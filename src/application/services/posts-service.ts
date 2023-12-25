import {ExtendedLikesInfo, NewestLike, Post, PostModel} from "../../domain/Posts";
import {AddPostAttr, UpdatePostAttr} from "../../types/types";
import {PostsRepository} from "../../infrastructure/repositories/posts/posts-db-repository";
import {BlogsQueryRepository} from "../../infrastructure/repositories/blogs/blogs-query-repo";
import {inject, injectable} from "inversify";
import {newestLikesMapper} from "../../helpers/mappers";
import {LikesService} from "./likes-service";


@injectable()
export class PostsService {
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
                @inject(LikesService) protected likesService: LikesService) {
    }
    async createPost(inputData: AddPostAttr) {
        try {
            const {title, shortDescription, content, blogId} = inputData
            const blog = await this.blogsQueryRepository.getBlogById(inputData.blogId)
            if (!blog) {
                return null
            }
            const createdAt = new Date().toISOString()
            const {name} = blog
            const extendedLikesInfo = new ExtendedLikesInfo(0,0, 'None', [])
            const newPostInstance = new Post(title, shortDescription, content, blogId, name, createdAt, extendedLikesInfo)

            const newPost = PostModel.createPost(newPostInstance)

            await this.postsRepository.save(newPost)
            return newPost
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async updatePost(inputData: UpdatePostAttr){
        return await this.postsRepository.updatePost(inputData)
    }

    async updatePostLikes(postId: string, newestLikesCount: number) {
        const likesCount = await this.likesService.getLikeCountByEntityId(postId)
        const dislikesCount = await this.likesService.getDislikeCountByEntityId(postId)
        const newestLikes = await this.likesService.getLastLikesByNumber(postId, newestLikesCount)

        if (newestLikes) {
            const mappedNewestLikes: NewestLike[] = newestLikes.map((like) => newestLikesMapper(like))
            const updatePostLikesParams = {
                likesCount,
                dislikesCount,
                mappedNewestLikes
            }
            return await this.postsRepository.updatePostLikes(postId, updatePostLikesParams)
        }
    }
}
