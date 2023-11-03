import {client} from "../db";
import {Comment, CommentOutput, PagedCommentOutput} from "../../models/Comments";
import {PostQueryParams} from "../../types/types";
import {getPaginationDetails} from "../../helpers/query-params";
import {commentsMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";

const dbName = process.env.DB_NAME || "blogs_posts";
const db = client.db(dbName);
const commentsCollection = db.collection<Comment>("comments");

export const commentsQueryRepository = {
    async getCommentsByPost(postId: string, params: PostQueryParams): Promise<PagedCommentOutput> {

        const { skipAmount, sortDir } = getPaginationDetails(params);
        const totalCount = await commentsCollection.countDocuments({ postId: postId })

        const comments= await commentsCollection
            .find({ postId: postId })
            .sort({[params.sortBy]: sortDir} as any)
            .skip(skipAmount)
            .limit(params.pageSize)
            .toArray()

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

        const comment = await commentsCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }

        return commentsMapper(comment)
    },

    async removeCommentById(commentId: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({ _id: new ObjectId(commentId)})
        return result.deletedCount === 1
    }
}