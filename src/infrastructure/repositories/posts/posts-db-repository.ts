import {Post, PostModel, PostOutput} from "../../../domain/Posts";
import {UpdatePostAttr, UpdatePostLikesParams} from "../../../types/types";
import {postMapper} from "../../../helpers/mappers";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";


@injectable()
export class PostsRepository {
    async addPost(newPost: Post): Promise<PostOutput | null> {

        const res = await PostModel.create(newPost)

        return postMapper({...newPost, _id: res._id})
    }

    async save(model: any) {
        await model.save()
    }

    async updatePost(inputData: UpdatePostAttr): Promise<PostOutput | null> {
        const {id, ...dataToUpdate} = inputData

        const post = await PostModel.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if(!post) {
            return null
        }

        return postMapper(post)
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
