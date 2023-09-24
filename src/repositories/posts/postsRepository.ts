import {db, Post} from "../../models/posts";
import {AddPostAttr, UpdatePostAttr} from "../../types";
import {blogsRepository} from "../blogs/BlogsRepository";
import {randomUUID} from "crypto";

export const postsRepository = {

    getPosts(): Post[] {
        return db.posts
    },

    getPostById(id: string): Post {
        return <Post>db.posts.find(p => p.id === id)
    },

    addPost(inputData: AddPostAttr): Post {
        const blog = blogsRepository.getBlogById(inputData.blogId)

        const newPost = {
            id: randomUUID(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: blog!.name
        }

        db.posts.push(newPost)

        return newPost
    },

    updatePost(inputData: UpdatePostAttr): Post | null {
        const postIndex = db.posts.findIndex(p => p.id === inputData.id)
        const {id, ...dataToUpdate} = inputData
        if (postIndex === -1) return null

        const updatedPost: Post = {
            ...db.posts[postIndex],
                ...dataToUpdate
        }
        db.posts[postIndex] = updatedPost

        return updatedPost
    },

    deletePostById(id: string): boolean {
        const postIndex = db.posts.findIndex(p => p.id === id)
        if (postIndex !== -1) {
            db.posts = [...db.posts.slice(0, postIndex), ...db.posts.slice(postIndex + 1)]
            return true
        }
        return false
    }
}