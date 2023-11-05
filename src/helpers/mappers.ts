import {WithId} from "mongodb";
import {Blog, BlogOutput} from "../models/Blogs";
import {Post, PostOutput} from "../models/Posts";
import {SanitizedUserOutput, User} from "../models/Users";
import {Comment, CommentOutput} from "../models/Comments";

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
        createdAt: post.createdAt

    }
}

export const commentsMapper = (comment: WithId<Comment>): CommentOutput => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}

//export const userMapper
export const userSanitizer = (user: WithId<User>): SanitizedUserOutput => {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt.toString()
    }
}