import {body, param} from "express-validator";
import {blogsQueryRepository} from "../../repositories/blogs/blogs-query-repo";

export const blogValidationPost = [
    body('name')
        .trim()
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Name field must not be empty')
        .isLength({ max: 10 }).withMessage('Max length 10'),
    body('description')
        .trim()
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Name field must not be empty')
        .isLength({max: 500}).withMessage('Max length 500'),
    body('websiteUrl')
        .trim()
        .exists().withMessage('Name field is required')
        .isLength({max: 100}).withMessage('Max length 100')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('Invalid URL format')
]

// TODO: `Check on support blog id validation approach`
export const  checkForExistingBlog  = [
    param('id')
        .custom(async (val) => {
            try {
                const blog = await blogsQueryRepository.getBlogById(val);
                if (!blog) throw new Error('incorrect blog id');
                return true;
            } catch (error) {
                // @ts-ignore
                if (error.message.includes('24 character hex string')) {
                    throw new Error('incorrect blog id format');
                }
                throw error;
            }
        })
]
