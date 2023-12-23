import {CommentsRepository} from "../../infrastructure/repositories/comments/comments-db-repo";
import {AddCommentAttr, UpdateLikeParams, UpdatedCommentAttr} from "../../types/types";
import {BlogComment, CommentatorInfo} from "../../domain/Comments";
import {CommentsQueryRepository} from "../../infrastructure/repositories/comments/comments-query-repo";
import {inject, injectable} from "inversify";
import {LikesInfo} from "../../domain/Likes";


@injectable()
export class CommentsService {
    constructor( @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                 @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async createComment (inputData: AddCommentAttr) {
        const {content, postId} = inputData
        const createdAt = new Date().toISOString()
        const userId = inputData.userId.toString()
        const userLogin = inputData.userLogin

        const commentatorInfo = new CommentatorInfo(userId, userLogin)

        const likesInfo: LikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: "None"
        }

        const newComment = new BlogComment(content, commentatorInfo, createdAt, postId, likesInfo)

        return await this.commentsRepository.addComment(newComment)
    }

    async updateComment (inputData: UpdatedCommentAttr) {
        return await this.commentsRepository.updateComment(inputData)
    }

}