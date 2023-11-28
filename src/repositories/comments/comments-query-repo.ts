import {CommentModelClass, CommentOutput, PagedCommentOutput} from "../../models/Comments";
import {PostQueryParams} from "../../types/types";
import {getPaginationDetails} from "../../helpers/query-params";
import {commentsMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";

export const commentsQueryRepository = {
    async getCommentsByPost(postId: string, params: PostQueryParams): Promise<PagedCommentOutput> {

        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await CommentModelClass.countDocuments({ postId: postId })

        const comments= await CommentModelClass
            .find({ postId: postId })
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)

        const mappedComments: CommentOutput[] = comments.map((c) => commentsMapper(c))

        return {
            pagesCount: Math.ceil(totalCount / params.pageSize),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount: totalCount,
            items: mappedComments
        }
    },

    async getCommentById(id: string): Promise<CommentOutput | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }

        const comment = await CommentModelClass.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }

        return commentsMapper(comment)
    },

    async removeCommentById(commentId: string): Promise<boolean> {
        const result = await CommentModelClass.deleteOne({ _id: new ObjectId(commentId)})
        return result.deletedCount === 1
    }
}