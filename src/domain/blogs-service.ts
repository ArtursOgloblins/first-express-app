import {BlogsRepository} from "../repositories/blogs/blogs-db-repository";
import {AddBlogAttr, UpdateBlogAttr} from "../types/types";
import {Blog} from "../models/Blogs";


export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {
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

