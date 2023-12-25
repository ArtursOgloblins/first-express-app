import {PagedPostOutput, PostModel, PostOutput} from "../../../domain/Posts";
import {postMapper} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import {PostQueryParams} from "../../../types/types";
import {injectable} from "inversify";


@injectable()
export class PostsQueryRepository {
    async getPosts(params: PostQueryParams): Promise<PagedPostOutput> {

        const sortDir = params.sortDirection === 'asc' ? 1 : -1
        const skipAmount = (params.pageNumber - 1) * params.pageSize
        const totalCount = await PostModel.countDocuments()

        const posts = await PostModel
            .find({})
            .sort({[params.sortBy]: sortDir})
            .skip(skipAmount)
            .limit(params.pageSize)

        const mappedPosts: PostOutput[] =  posts.map((p) => postMapper(p))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedPosts
        }
    }

    async getPostById(id: string): Promise<PostOutput | null> {
        const post = await PostModel.findOne({_id: new ObjectId(id)})

        if (!post) {
            return null
        }

        return postMapper(post)
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}