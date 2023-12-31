import {ObjectId} from "mongodb";
import {NewestLike} from "../domain/Posts";

export type Paginated<T> = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

export type AddBlogAttr = {
    name: string
    description: string
    websiteUrl: string
}

export type UpdateBlogAttr = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export type AddPostAttr = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type AddPostByBlogIdtAttr = {
    title: string,
    shortDescription: string,
    content: string,
}

export type UpdatePostAttr = {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type UpdatePostLikesParams = {
    likesCount: number
    dislikesCount: number
    mappedNewestLikes: NewestLike[] | null
}


export type BlogQueryParams = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageSize: number;
    pageNumber: number;
}

export type PostQueryParams = {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageSize: number;
    pageNumber: number;
}

export type AddUserParams = {
    login: string,
    password:string
    email: string,
}

export type UsersQueryParams = {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageSize: number;
    pageNumber: number;
}

export type UserFilter = {
    login?: RegExp;
    email?: RegExp;
    $or?: UserFilter[];
};

export type AddCommentAttr = {
    content: string
    userId: ObjectId
    userLogin: string
    postId: string
}

export type UpdatedCommentAttr = {
    commentId: string
    content: string
}

export type UpdateLikeParams = {
    entityId: string,
    userId: string,
    login: string
    likeStatus: string,
    createdAt: string
}

export type RefreshTokenParams = {
    userId: ObjectId
    newRefreshToken: string
    deviceId: string
    ip: string
    deviceName: string
}

export type ValidateRefreshTokenArgs = {
    createdAt: string
    userId: ObjectId
    deviceId: string
}

export type RefreshTokenArgs = {
    createdAt: string
    expiresAt: string
    deviceId: string
    userId: ObjectId
}


