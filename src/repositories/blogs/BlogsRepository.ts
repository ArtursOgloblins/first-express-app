import {db, Blog} from "../../models/Blogs";

export const blogsRepository ={
    getBlogs(): Blog[] {
        return db.blogs
    }
}