import express from "express";
import {blogValidationPost} from "../middleware/blogs/blogInputValidations";
import {basicAuth} from "../middleware/auth/basicAuth";
import {CreatePostValidation,} from "../middleware/posts/postsInputValidation";
import {blogController} from "../composition-root";

const blogRouter = express.Router();

blogRouter.get('/', blogController.getBlogs.bind(blogController))
blogRouter.get('/:id', blogController.getBlogById.bind(blogController))
blogRouter.get('/:id/posts',blogController.getPostsByBlogId.bind(blogController))
blogRouter.post('/', basicAuth, blogValidationPost(), blogController.createBlog.bind(blogController))
blogRouter.post('/:id/posts', basicAuth, CreatePostValidation(false), blogController.createPost.bind(blogController))
blogRouter.put('/:id', basicAuth, blogValidationPost(), blogController.updateBlog.bind(blogController))
blogRouter.delete('/:id', basicAuth, blogController.deleteBlogById.bind(blogController))

export default blogRouter