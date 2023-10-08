import {Post, PostOutput} from "../models/Posts";
import {Blog} from "../models/Blogs";
import {AddPostAttr, AddPostByBlogIdtAttr, UpdatePostAttr} from "../types";
import {postsRepository} from "../repositories/posts/posts-db-repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repo";

export const postService = {

    async createPostData(title: string, shortDescription: string, content: string, blogId: string): Promise<Post> {
        const createdAt = new Date().toISOString();
        const blog: Blog | null = await blogsQueryRepository.getBlogById(blogId);

        return {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt
        };
    },


    async addPost(inputData: AddPostAttr): Promise<PostOutput | null> {
        const newPost = await this.createPostData(inputData.title, inputData.shortDescription, inputData.content, inputData.blogId)
        return  await postsRepository.addPost(newPost)

    },

    async addPostByBlogId(blogId: string, inputData: AddPostByBlogIdtAttr): Promise<PostOutput | null> {
        const newPost = await this.createPostData(inputData.title, inputData.shortDescription, inputData.content, blogId);
        return await postsRepository.addPost(newPost);
    },

    async updatePost(inputData: UpdatePostAttr){
        return await postsRepository.updatePost(inputData)
    }
}
