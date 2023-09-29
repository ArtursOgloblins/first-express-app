import {db, Blog} from "../../models/Blogs";
import {AddBlogAttr, UpdateBlogAttr} from "../../types";
import {randomUUID} from "crypto";
import {client} from "../db";

const dbName = process.env.DB_NAME || "blogs_posts";

export const blogsRepository = {

    async getBlogs(): Promise<Blog[]> {
        return client.db(dbName).collection<Blog>("blogs").find().toArray()
    },

    async getBlogById(id: string): Promise<Blog> {
        return <Blog>db.blogs.find(b => b.id === id)
    },

    async addBlog(inputData: AddBlogAttr): Promise<Blog> {

        const newBlog = {
            id: randomUUID(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl,
            createdAt: "2023-09-29T14:30:31.695Z",
            isMembership: true
        }

        db.blogs = [...db.blogs, newBlog]

        return newBlog
    },

    async updateBlog(inputData: UpdateBlogAttr): Promise<Blog | null>  {
        const blogIndex=  db.blogs.findIndex(b => b.id === inputData.id)
        const {id, ...dataToUpdate} = inputData
        if (blogIndex === -1) return null

        const updatedBlog: Blog = {
            ...db.blogs[blogIndex],
            ...dataToUpdate
        }

        db.blogs[blogIndex] = updatedBlog

        return updatedBlog
    },

    async removeBlogById(id: string): Promise<boolean> {
        const index = db.blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            db.blogs = [...db.blogs.slice(0, index), ...db.blogs.slice(index + 1)];
            return true;
        }
        return false;
    }
}
