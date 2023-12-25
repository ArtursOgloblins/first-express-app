import {WithId} from "mongodb";
import {Blog, BlogOutput} from "../domain/Blogs";
import {Post, PostOutput} from "../domain/Posts";
import {SanitizedUserOutput, User} from "../domain/Users";
import {PostComment, CommentOutput} from "../domain/Comments";
import {ActiveDevicesOutput, RefreshToken} from "../domain/refreshToken";
import {Likes} from "../domain/Likes";

export const blogMapper = (blog: WithId<Blog>): BlogOutput => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export const postMapper = (post: WithId<Post>): PostOutput => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: post.extendedLikesInfo.myStatus,
            newestLikes: post.extendedLikesInfo.newestLikes.map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login
            }))
        }
    }
}

export const commentsMapper = (comment: WithId<PostComment>, likeStatus: string): CommentOutput => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: likeStatus
        }
    }
}

export const userSanitizer = (user: WithId<User>): SanitizedUserOutput => {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt.toString()
    }
}

export const jwtDateMapper = (date: any) => {
    return new Date(date * 1000).toISOString()
}

export const activeDeviceMapper = (refreshToken: WithId<RefreshToken>): ActiveDevicesOutput =>  {
    return {
        ip: refreshToken.ip,
        title: refreshToken.deviceName,
        lastActiveDate: refreshToken.createdAt,
        deviceId: refreshToken.deviceId
    }
}

export const newestLikesMapper = (like: WithId<Likes>) => {
    return {
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.userLogin
    }
}

