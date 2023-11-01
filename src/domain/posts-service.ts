import {PostOutput} from "../models/Posts";
import {AddPostAttr, UpdatePostAttr} from "../types/types";
import {postsRepository} from "../repositories/posts/posts-db-repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repo";

export const postService = {

    async createPost(inputData: AddPostAttr): Promise<PostOutput | null> {
        const blog = await blogsQueryRepository.getBlogById(inputData.blogId)
        if (!blog) {
            return null
        }
        const createdAt = new Date().toISOString()

        const newPost = {
            title : inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: blog.name,
            createdAt: createdAt
        };

        return postsRepository.addPost(newPost)
    },

    async updatePost(inputData: UpdatePostAttr){
        return await postsRepository.updatePost(inputData)
    }
}
