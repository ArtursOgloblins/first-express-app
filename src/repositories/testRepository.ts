import {db as videoDb, Video} from "../models/video";
import {db as blogDb, Blog} from "../models/Blogs";
import {db as postDb, Post} from "../models/posts";



export const testRepository = {
    deleteAllVideos(): Video[]  {
        videoDb.videos.length = 0
        return videoDb.videos
    },

    deleteAllBlogs(): Blog[] {
        blogDb.blogs.length = 0
        return blogDb.blogs
    },

    deleteAllPosts(): Post[] {
        postDb.posts.length = 0
        return postDb.posts
    }
}
