import {CommentModel, CommentOutput, PagedCommentOutput} from "../../models/Comments";
import {PostQueryParams} from "../../types/types";
import {getPaginationDetails} from "../../helpers/query-params";
import {commentsMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";
import {CommentLikesModel} from "../../models/CommentsLikesDislikes";


export class CommentsQueryRepository {

    async fetchLikesInfo(commentId: string, userId: string | null) {
        const likesCount = await CommentLikesModel.countDocuments({ commentId: commentId, likeStatus: 'like' })
        const dislikesCount = await CommentLikesModel.countDocuments({ commentId: commentId, likeStatus: 'disLike' })
        const userLikeStatus = await CommentLikesModel.findOne({ commentId: commentId, userId: userId })
        return {
            likesCount,
            dislikesCount,
            myStatus: userLikeStatus ? userLikeStatus.likeStatus : 'None'
        }
    }

    async getCommentsByPost(postId: string, params: PostQueryParams, userId: string): Promise<PagedCommentOutput> {

        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await CommentModel.countDocuments({ postId: postId })

        const comments= await CommentModel
            .find({ postId: postId })
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)

        const mappedComments: CommentOutput[] = await Promise.all(comments.map(async (comment) => {
            const likesInfo = await this.fetchLikesInfo(comment._id.toString(), userId)
            return commentsMapper(comment, likesInfo)
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

        const likesInfo = await this.fetchLikesInfo(commentId, userId)
        return commentsMapper(comment, likesInfo)
    }

    async removeCommentById(commentId: string): Promise<boolean> {
        const result = await CommentModel.deleteOne({ _id: new ObjectId(commentId)})
        return result.deletedCount === 1
    }

    async getCommentLikeStatus(commentId: string, userId: string) {
        const commentLikeStatus = await CommentLikesModel.findOne({commentId: commentId, userId: userId})
        if (!commentLikeStatus) {
        } else {
            return commentLikeStatus
        }
    }
}