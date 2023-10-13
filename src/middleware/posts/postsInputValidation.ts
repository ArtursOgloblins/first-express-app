import {body, param} from "express-validator";
import {blogsQueryRepository} from "../../repositories/blogs/blogs-query-repo";


export const postsInputValidationInBlogs = [
    body('title')
        .trim()
        .exists().withMessage('Field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:30}).withMessage('Max length 30'),
    body('shortDescription')
        .trim()
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:100}).withMessage('Max length 100'),
    body('content')
        .trim()
        .exists().withMessage('Field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:1000}).withMessage('Max length 1000'),
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

export const  postsInputValidation = [
    body('title')
        .trim()
        .exists().withMessage('Field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:30}).withMessage('Max length 30'),
    body('shortDescription')
        .trim()
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:100}).withMessage('Max length 100'),
    body('content')
        .trim()
        .exists().withMessage('Field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:1000}).withMessage('Max length 1000'),

    body('blogId')
        .trim()
        .exists().withMessage('Field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .custom(async (val) => {
            const blog = await blogsQueryRepository.getBlogById(val)
            if (!blog) throw new Error('blog not found')
            return true
        })
]



