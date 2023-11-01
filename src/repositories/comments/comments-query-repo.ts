import {client} from "../db";
import {Comment, CommentOutput, PagedCommentOutput} from "../../models/Comments";
import {PostQueryParams} from "../../types/types";
import {getPaginationDetails} from "../../helpers/query-params";
import {commentsMapper} from "../../helpers/mappers";

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
    }
}