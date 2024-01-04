import {Post, PostModel} from "../../domain/Posts";
import {Blog, BlogModelClass} from "../../domain/Blogs";
import {User, UserModel} from "../../domain/Users";
import {PostComment, CommentModel} from "../../domain/Comments";
import {RefreshToken, RefreshTokenModelClass} from "../../domain/refreshToken";
import {ApiRequest, ApiRequestModelClass} from "../../domain/Requests";
import {LikesModel, LikesInfo} from "../../domain/Likes";
import {injectable} from "inversify";


@injectable()
export class TestRepository {
    async deleteAllBlogs(): Promise<Blog[]> {
        await BlogModelClass.deleteMany({})
        return []
    }

    async deleteAllPosts(): Promise<Post[]> {
        await PostModel.deleteMany({})
        return []
    }

    async deleteAllUsers(): Promise<User[]> {
        await UserModel.deleteMany({})
        return []
    }

    async deleteAllComments(): Promise<PostComment[]> {
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
        await LikesModel.deleteMany({})
        return []
    }
}
