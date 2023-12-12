import {Post, PostOutput} from "../models/Posts";
import {AddPostAttr, UpdatePostAttr} from "../types/types";
import {PostsRepository} from "../repositories/posts/posts-db-repository";
import {BlogsQueryRepository} from "../repositories/blogs/blogs-query-repo";

export class PostsService {
    constructor(protected postsRepository: PostsRepository,
                protected blogsQueryRepository: BlogsQueryRepository) {
    }
    async createPost(inputData: AddPostAttr): Promise<PostOutput | null> {
        const {title, shortDescription, content, blogId} = inputData
        const blog = await this.blogsQueryRepository.getBlogById(inputData.blogId)
        if (!blog) {
            return null
        }
        const createdAt = new Date().toISOString()

        const newPost = new Post(title, shortDescription, content, blogId, blog.name, createdAt)

        return this.postsRepository.addPost(newPost)
    }
    async updatePost(inputData: UpdatePostAttr){
        return await this.postsRepository.updatePost(inputData)
    }
}
