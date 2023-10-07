import {blogsRepository} from "../repositories/blogs/blogs-db-repository";
import {AddBlogAttr, UpdateBlogAttr} from "../types";

export const blogsService = {

    async addBlog(inputData: AddBlogAttr) {
        const {name, description, websiteUrl} = inputData
        const createdAt = new Date().toISOString();

        const newBlog = {
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership: false
        }

        return await blogsRepository.addBlog(newBlog);
    },

    async updateBlog(inputData: UpdateBlogAttr){
        return await blogsRepository.updateBlog(inputData)
    }
}

