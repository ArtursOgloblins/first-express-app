import {Post, PostModelClass} from "../models/Posts";
import {Blog, BlogModelClass} from "../models/Blogs";
import {User, UserModelClass} from "../models/Users";
import {BlogComment, CommentModel} from "../models/Comments";
import {RefreshToken, RefreshTokenModelClass} from "../models/refreshToken";
import {ApiRequest, ApiRequestModelClass} from "../models/Requests";
import {CommentLikesModel, LikesInfo} from "../models/CommentsLikesDislikes";


export class TestRepository {
    async deleteAllBlogs(): Promise<Blog[]> {
        await BlogModelClass.deleteMany({})
        return []
    }

    async deleteAllPosts(): Promise<Post[]> {
        await PostModelClass.deleteMany({})
        return []
    }

    async deleteAllUsers(): Promise<User[]> {
        await UserModelClass.deleteMany({})
        return []
    }

    async deleteAllComments(): Promise<BlogComment[]> {
        await CommentModel.deleteMany({})
        return []
    }

    async deleteAllTokens(): Promise<RefreshToken[]> {
        await RefreshTokenModelClass.deleteMany({})
        return []
    }

    async deleteAllDevices(): Promise<ApiRequest[]> {
        await ApiRequestModelClass.deleteMany({})
        return []

    }

    async deleteAllCommentLikeStatuses(): Promise<LikesInfo[]>{
        await CommentLikesModel.deleteMany({})
        return []
    }
}
