import {Post, PostModelClass} from "../../domain/Posts";
import {Blog, BlogModelClass} from "../../domain/Blogs";
import {User, UserModel} from "../../domain/Users";
import {BlogComment, CommentModel} from "../../domain/Comments";
import {RefreshToken, RefreshTokenModelClass} from "../../domain/refreshToken";
import {ApiRequest, ApiRequestModelClass} from "../../domain/Requests";
import {CommentLikesModel, LikesInfo} from "../../domain/Likes";
import {injectable} from "inversify";


@injectable()
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
        await UserModel.deleteMany({})
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
