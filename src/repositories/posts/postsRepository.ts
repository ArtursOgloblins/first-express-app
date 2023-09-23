import {db, Post} from "../../models/posts";
import {AddPostAttr, UpdatePostAttr} from "../../types";

export const postsRepository = {

    getPosts(): Post[] {
        return db.posts
    },

    getPostById(id: number): Post {
        return <Post>db.posts.find(p => p.id === id)
    },

    addPost(inputData: AddPostAttr): Post {

        const newPost = {
            id: +(new Date()),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: "New Post"
        }

        db.posts = [...db.posts, newPost]

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

    deletePostById(id: number): boolean {
        const postIndex = db.posts.findIndex(p => p.id === id)
        if (postIndex !== -1) {
            db.posts = [...db.posts.slice(0, postIndex), ...db.posts.slice(postIndex + 1)]
            return true
        }
        return false
    }
}