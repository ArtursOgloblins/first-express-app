import {db, Blog} from "../../models/Blogs";
import {AddBlogAttr} from "../../types";

export const blogsRepository ={
    getBlogs(): Blog[] {
        return db.blogs
    },

    getBlogById(id: number): Blog {
        return <Blog>db.blogs.find(b => b.id === id)
    },

    addBlog(inputData: AddBlogAttr): Blog {

        const newBlog = {
            id: +(new Date()),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl
        }

        db.blogs = [...db.blogs, newBlog]

        return newBlog
    },

    removeBlogById(id: number): boolean {
        const index = db.blogs.findIndex(blog => blog.id === id);
        if (index !== -1) {
            const removedBlog = db.blogs[index];
            db.blogs = [...db.blogs.slice(0, index), ...db.blogs.slice(index + 1)];
            return true;
        }
        return false;
    }
}
