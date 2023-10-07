import {PostOutput} from "../models/Posts";
import {Blog} from "../models/Blogs";
import {AddPostAttr, UpdatePostAttr} from "../types";
import {blogsRepository} from "../repositories/blogs/blogs-db-repository";
import {postsRepository} from "../repositories/posts/posts-db-repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repo";

export const postService = {

    async addPost(inputData: AddPostAttr): Promise<PostOutput | null> {
        const { title, shortDescription, content, blogId } = inputData;
        const createdAt = new Date().toISOString();
        const blog: Blog | null = await blogsQueryRepository.getBlogById(inputData.blogId)

        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt
        };

       return  await postsRepository.addPost(newPost)

    },

    async updatePost(inputData: UpdatePostAttr){
        return await postsRepository.updatePost(inputData)
    }
}
