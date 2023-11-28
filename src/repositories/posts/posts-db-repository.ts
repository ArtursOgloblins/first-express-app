import {Post, PostModelClass, PostOutput} from "../../models/Posts";
import {UpdatePostAttr} from "../../types/types";
import {postMapper} from "../../helpers/mappers";
import {ObjectId} from "mongodb";

export const postsRepository = {

    async addPost(newPost: Post): Promise<PostOutput | null> {

        const res = await PostModelClass.create(newPost)

        return postMapper({...newPost, _id: res._id})
    },

    async updatePost(inputData: UpdatePostAttr): Promise<PostOutput | null> {
        const {id, ...dataToUpdate} = inputData

        const post = await PostModelClass.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
        if(!post) {
            return null
        }

        return postMapper(post)
    }
}
