import {PagedPostOutput, PostModel, PostOutput} from "../../../domain/Posts";
import {postMapper} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import {PostQueryParams} from "../../../types/types";
import {inject, injectable} from "inversify";
import {LikesRepository} from "../likes/likes-db-reposiry";


@injectable()
export class PostsQueryRepository {

    constructor( @inject(LikesRepository) protected likesRepository: LikesRepository) {
    }
    async getPosts(params: PostQueryParams, userId: string | null): Promise<PagedPostOutput> {

        const sortDir = params.sortDirection === 'asc' ? 1 : -1
        const skipAmount = (params.pageNumber - 1) * params.pageSize
        const totalCount = await PostModel.countDocuments()

        const posts = await PostModel
            .find({})
            .sort({[params.sortBy]: sortDir})
            .skip(skipAmount)
            .limit(params.pageSize)

        const mappedPosts: PostOutput[] = await Promise.all(posts.map(async (post) => {
            const likeStatus = await this.likesRepository.getMyLikeStatus(post._id.toString(), userId)
            return postMapper(post, likeStatus)
        }))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedPosts
        }
    }

    async getPostById(id: string, userId: string | null): Promise<PostOutput | null> {
        const post = await PostModel.findOne({_id: new ObjectId(id)})
        console.log('post', post)
        if (!post) {
            return null
        }
        const likeStatus = await this.likesRepository.getMyLikeStatus(id, userId)

        return postMapper(post, likeStatus)
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}