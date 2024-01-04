import {Post, PostModel, PostOutput} from "../../../domain/Posts";
import {UpdatePostAttr, UpdatePostLikesParams} from "../../../types/types";
import {postMapper} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {LikeStatuses} from "../../../domain/Likes";


@injectable()
export class PostsRepository {
    async addPost(newPost: Post): Promise<PostOutput | null> {

        const res = await PostModel.create(newPost)

        return postMapper({...newPost, _id: res._id}, LikeStatuses.None)
    }

    async save(model: any): Promise<any> {
        return await model.save()
    }

    async updatePost(inputData: UpdatePostAttr) {
        const {id, ...dataToUpdate} = inputData

        const res = await PostModel.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        return res
    }

    async updatePostLikes(postId: string, inputData: UpdatePostLikesParams) {
        const {likesCount, dislikesCount, mappedNewestLikes} = inputData

        const dataToUpdate = {
            'extendedLikesInfo.likesCount': likesCount,
            'extendedLikesInfo.dislikesCount': dislikesCount,
            'extendedLikesInfo.newestLikes': mappedNewestLikes
        }

        const updatedPost = await PostModel.findOneAndUpdate(
            {_id: new ObjectId(postId)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if (!updatedPost) {
            return null
        }
        return updatedPost
    }
}
