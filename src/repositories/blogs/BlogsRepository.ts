import {db, Blog} from "../../models/Blogs";

export const blogsRepository ={
    getBlogs(): Blog[] {
        return db.blogs
    },

    getBlogById (id: number): Blog {
        return <Blog>db.blogs.find(b => b.id === id)
    },

    deleteBlogById(id: number): boolean{
        for (let i = 0; i < db.blogs.length; i++){
            if (db.blogs[i].id == id) {
                db.blogs.splice(i, 1)
                return true
            }
        }
        return false

        // removeBlogById(id: number): Blog | null {
        //     const index = db.blogs.findIndex(blog => blog.id === id);
        //     if (index !== -1) {
        //         const removedBlog = db.blogs[index];
        //         db.blogs = [...db.blogs.slice(0, index), ...db.blogs.slice(index + 1)];
        //         return removedBlog;
        //     }
        //     return null;
        // }
    }
}