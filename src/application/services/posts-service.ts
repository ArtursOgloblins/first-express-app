import {Post, PostOutput} from "../../domain/Posts";
import {AddPostAttr, UpdatePostAttr} from "../../types/types";
import {PostsRepository} from "../../infrastructure/repositories/posts/posts-db-repository";
import {BlogsQueryRepository} from "../../infrastructure/repositories/blogs/blogs-query-repo";
import {inject, injectable} from "inversify";


@injectable()
export class PostsService {
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository) {
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
