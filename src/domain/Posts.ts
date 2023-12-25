import {WithId} from "mongodb";
import mongoose, {Schema, model} from 'mongoose';
import {LikeStatuses} from "./Likes";
import {CommentModel} from "./Comments";

export class NewestLike {
    constructor(public addedAt: string,
                public userId: string,
                public login: string) {
    }
}

export class ExtendedLikesInfo {
    constructor(public likesCount: number,
                public dislikesCount: number,
                public myStatus: string,
                public newestLikes: NewestLike[]) {
    }
}

export class Post {
    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public extendedLikesInfo: ExtendedLikesInfo) {
    }
}

export type PostDb = WithId<Post>

export type PostOutput = Post & {id: string}

export type PagedPostOutput = {
    pagesCount: number;
    page: number
    pageSize: number
    totalCount: number
    items: PostOutput[]
}

interface PostMethods {

}

interface PostStaticMethods {
    createPost: (comment: Post) => Post
}

interface PostDocument extends Document, Post, PostMethods {}
interface PostModelType extends mongoose.Model<PostDocument>, PostStaticMethods {}

export const PostSchema = new Schema<Post>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: {
        likesCount: {type: Number, required: true, default: 0},
        dislikesCount: {type: Number, required: true, default: 0},
        myStatus:{type: String, enum: Object.values(LikeStatuses), default: LikeStatuses.None},
        newestLikes: [{
            addedAt: {type: String, required: true},
            userId: {type: String, required: true},
            login: {type: String, required: true}
        }]
    }
})

PostSchema.static('createPost', function createPost(Post) {
    return new CommentModel({Post})
})

export const PostModel = model<Post, PostModelType>('posts', PostSchema)