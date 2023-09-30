// import {db, Post} from "../../models/posts";
// import {AddPostAttr, UpdatePostAttr} from "../../types";
// import {blogsRepository} from "../blogs/blogs-db-repository";
// import {randomUUID} from "crypto";
//
// export const postsRepository = {
//
//     async getPosts(): Promise<Post[]> {
//         return db.posts
//     },
//
//     async getPostById(id: string): Promise<Post> {
//         return <Post>db.posts.find(p => p.id === id)
//     },
//
//    async addPost(inputData: AddPostAttr): Promise<Post> {
//         const blog = blogsRepository.getBlogById(inputData.blogId)
//
//         const newPost = {
//             id: randomUUID(),
//             title: inputData.title,
//             shortDescription: inputData.shortDescription,
//             content: inputData.content,
//             blogId: inputData.blogId,
//             blogName: (await blog!).name
//         }
//
//         db.posts.push(newPost)
//
//         return newPost
//     },
//
//     async updatePost(inputData: UpdatePostAttr): Promise<Post | null> {
//         const postIndex = db.posts.findIndex(p => p.id === inputData.id)
//         const {id, ...dataToUpdate} = inputData
//         if (postIndex === -1) return null
//
//         const updatedPost: Post = {
//             ...db.posts[postIndex],
//                 ...dataToUpdate
//         }
//         db.posts[postIndex] = updatedPost
//
//         return updatedPost
//     },
//
//     async deletePostById(id: string): Promise<boolean> {
//         const postIndex = db.posts.findIndex(p => p.id === id)
//         if (postIndex !== -1) {
//             db.posts = [...db.posts.slice(0, postIndex), ...db.posts.slice(postIndex + 1)]
//             return true
//         }
//         return false
//     }
// }