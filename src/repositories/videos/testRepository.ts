import {db as videoDb, Video} from "../../models/video";
import {db as blogDb, Blog} from "../../models/Blogs";


export const testRepository = {
    deleteAllVideos(): Video[]  {
        videoDb.videos.length = 0
        return videoDb.videos
    },

    deleteAllBlogs(): Blog[] {
        blogDb.blogs.length = 0
        return blogDb.blogs
    }
}
