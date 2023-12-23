import {Blog, BlogModelClass} from "../../../domain/Blogs";
import {UpdateBlogAttr} from "../../../types/types";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async addBlog(newBlog: Blog) {
        const res = await BlogModelClass.create(newBlog)
        return res._id.toString()
    }

    async updateBlog(inputData: UpdateBlogAttr) {
        const {id, ...dataToUpdate} = inputData

        return  BlogModelClass.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: dataToUpdate},
            {returnDocument: 'after'}
        )
    }
}

