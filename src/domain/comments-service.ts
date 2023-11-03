import {commentsRepository} from "../repositories/comments/comments-db-repo";
import {AddCommentAttr, UpdatedCommentAttr} from "../types/types";

export const commentsService = {
    async createComment (inputData: AddCommentAttr) {
        const createdAt = new Date().toISOString()
        const userId = inputData.userId.toString()
        const userLogin = inputData.userLogin

        const newComment = {
            content: inputData.content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin,
            },
            createdAt: createdAt,
            postId: inputData.postId
        }

        return await commentsRepository.addComment(newComment)
    },

    async updateComment (inputData: UpdatedCommentAttr) {
        return await commentsRepository.updateComment(inputData)
    }
}