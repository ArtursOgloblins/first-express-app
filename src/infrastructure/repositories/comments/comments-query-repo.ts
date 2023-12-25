import {CommentModel, CommentOutput} from "../../../domain/Comments";
import {Paginated, PostQueryParams} from "../../../types/types";
import {getPaginationDetails} from "../../../helpers/query-params";
import {commentsMapper} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {LikesRepository} from "../likes/likes-db-reposiry";


@injectable()
export class CommentsQueryRepository {
    constructor( @inject(LikesRepository) protected likesRepository: LikesRepository) {
    }

    async getCommentsByPost(postId: string, params: PostQueryParams, userId: string | null): Promise<Paginated<CommentOutput>> {

        const MAX_COUNT = 100;

        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await CommentModel.countDocuments({ postId: postId })

        const comments= await CommentModel
            .find({ postId: postId })
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)

        const mappedComments: CommentOutput[] = await Promise.all(comments.map(async (comment) => {
            const likeStatus = await this.likesRepository.getMyLikeStatus(comment._id.toString(), userId)
            return commentsMapper(comment, likeStatus)
        }))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedComments
        }
    }

    async getCommentById(commentId: string, userId: string | null): Promise<CommentOutput | null> {
        if (!ObjectId.isValid(commentId)) {
            return null
        }

        const comment = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if (!comment) {
            return null
        }

        const likeStatus = await this.likesRepository.getMyLikeStatus(commentId, userId)
        return commentsMapper(comment, likeStatus)
    }

    async removeCommentById(commentId: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ _id: new ObjectId(commentId)})
        return result.deletedCount === 1
    }
}