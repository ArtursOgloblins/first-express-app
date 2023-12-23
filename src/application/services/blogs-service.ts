import {BlogsRepository} from "../../infrastructure/repositories/blogs/blogs-db-repository";
import {AddBlogAttr, UpdateBlogAttr} from "../../types/types";
import {Blog} from "../../domain/Blogs";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }

    async addBlog(inputData: AddBlogAttr) {
        const {name, description, websiteUrl} = inputData
        const createdAt = new Date().toISOString();

        const newBlog: Blog = new Blog(name, description, websiteUrl, createdAt, false)

        return await this.blogsRepository.addBlog(newBlog)
    }

    async updateBlog(inputData: UpdateBlogAttr){
        return await this.blogsRepository.updateBlog(inputData)
    }
}

