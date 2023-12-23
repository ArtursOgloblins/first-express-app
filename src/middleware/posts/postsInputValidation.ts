import {body} from "express-validator";
import {BlogsQueryRepository} from "../../infrastructure/repositories/blogs/blogs-query-repo";
import {InputValidationResult} from "../inputValidationResult";

class PostsInputValidation {
    blogsQueryRepository: BlogsQueryRepository
    constructor() {
        this.blogsQueryRepository = new BlogsQueryRepository()
    }

    titleValidation() {
        return body('title')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Title should be string')
            .isLength({max:30}).withMessage('Max length 30')
    }

   shortDescriptionValidation() {
        return body('shortDescription')
            .trim()
            .exists().withMessage('Name field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Title should be string')
            .isLength({max:100}).withMessage('Max length 100')
   }

    contentValidation() {
        return body('content')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Title should be string')
            .isLength({max:1000}).withMessage('Max length 1000')
    }

    blogIdValidation() {
        return body('blogId')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Title should be string')
            .custom(async (val) => {
                const blog = await this.blogsQueryRepository.getBlogById(val)
                if (!blog) throw new Error('blog not found')
                return true
            })
    }
}

const postsInputValidation = new PostsInputValidation()

export const CreatePostValidation = (withBlogId: boolean) => {
    const validation: any = [
        postsInputValidation.titleValidation(),
        postsInputValidation.shortDescriptionValidation(),
        postsInputValidation.contentValidation()
    ]
    if (withBlogId) {
        validation.push(postsInputValidation.blogIdValidation())
    }
    validation.push(InputValidationResult)
    return validation
}

export const UpdatePostValidation = () => {
    const validation: any = [
        postsInputValidation.titleValidation(),
        postsInputValidation.shortDescriptionValidation(),
        postsInputValidation.contentValidation(),
        postsInputValidation.blogIdValidation()
    ]
    validation.push(InputValidationResult)
    return validation
}



