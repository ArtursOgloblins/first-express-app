import {db, Blog} from "../../models/Blogs";
import {AddBlogAttr, UpdateBlogAttr} from "../../types";

export const blogsRepository ={

    getBlogs(): Blog[] {
        return db.blogs
    },

    getBlogById(id: string): Blog {
        return <Blog>db.blogs.find(b => b.id === id)
    },

    addBlog(inputData: AddBlogAttr): Blog {

        const newBlog = {
            id: (new Date()).toString(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl
        }

        db.blogs = [...db.blogs, newBlog]

        return newBlog
    },

    updateBlog(inputData: UpdateBlogAttr): Blog | null  {
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

    removeBlogById(id: string): boolean {
        const index = db.blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            db.blogs = [...db.blogs.slice(0, index), ...db.blogs.slice(index + 1)];
            return true;
        }
        return false;
    }
}
