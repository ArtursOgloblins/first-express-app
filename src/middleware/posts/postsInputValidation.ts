import {body} from "express-validator";
import {blogsQueryRepository} from "../../repositories/blogs/blogs-query-repo";
import {InputValidationResult} from "../inputValidationResult";


const titleValidation = body('title')
        .trim()
        .exists().withMessage('Field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:30}).withMessage('Max length 30')


const shortDescriptionValidation = body('shortDescription')
        .trim()
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Field must not be empty')
        .isString().withMessage('Title should be string')
        .isLength({max:100}).withMessage('Max length 100')

const contentValidation =  body('content')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Title should be string')
    .isLength({max:1000}).withMessage('Max length 1000')

const blogIdValidation = body('blogId')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Title should be string')
    .custom(async (val) => {
        const blog = await blogsQueryRepository.getBlogById(val)
        if (!blog) throw new Error('blog not found')
        return true
    })


export const CreatePostValidation = (withBlogId: boolean) => {
   const validation: any = [titleValidation, shortDescriptionValidation, contentValidation]
    if(withBlogId) {
        validation.push(blogIdValidation)
    }
    validation.push(InputValidationResult)
    return validation
}

export const UpdatePostValidation = () => {
    const validation: any = [
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        blogIdValidation
    ]
    validation.push(InputValidationResult)
    return validation
}



