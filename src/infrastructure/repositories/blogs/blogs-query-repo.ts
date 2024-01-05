import {BlogModelClass, BlogOutput, PagedBlogOutput} from "../../../domain/Blogs";
import {blogMapper, postMapper} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import {BlogQueryParams, PostQueryParams} from "../../../types/types";
import {PostModel, PostOutput} from "../../../domain/Posts";
import {getPaginationDetails} from "../../../helpers/query-params";
import {inject, injectable} from "inversify";
import "reflect-metadata"
import {LikesRepository} from "../likes/likes-db-reposiry";

@injectable()
export class BlogsQueryRepository {

    constructor( @inject(LikesRepository) protected likesRepository: LikesRepository) {
    }
    async getBlogs(params: BlogQueryParams): Promise<PagedBlogOutput> {
        let filter = {}
        if (params.searchNameTerm) {
            filter = {
                name: new RegExp(params.searchNameTerm, "i")
            }
        }

        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await BlogModelClass.countDocuments(filter)

        const blogs= await BlogModelClass
            .find(filter)
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)

        const mappedBlogs: BlogOutput[] =  blogs.map((b) => blogMapper(b))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedBlogs
        }
    }

    async getBlogById(id: string): Promise<BlogOutput | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const blog = await BlogModelClass.findOne({_id: new ObjectId(id)})

        if(!blog){
            return null;
        }

        return blogMapper(blog);
    }

    async getPostsByBlogId(id: string, params: PostQueryParams, userId: string | null) {
        const { skipAmount, sortDir } = getPaginationDetails(params);
        const filter = {blogId: id}
        const totalCount = await PostModel.countDocuments(filter)

        const posts = await PostModel
            .find(filter)
            .sort({[params.sortBy]: sortDir} as any)
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

    async removeBlogById(id: string): Promise<boolean>  {
        const result = await BlogModelClass.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }
}