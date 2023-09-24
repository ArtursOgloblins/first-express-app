import {body} from "express-validator";


export const blogValidationPost = [
    body('name')
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Name field must not be empty')
        .trim().withMessage('Wrong format')
        .isLength({ max: 10 })
        .withMessage('Max length 10 '),
    body('description')
        .exists().withMessage('Name field is required')
        .notEmpty().withMessage('Name field must not be empty')
        .trim().withMessage('Wrong format')
        .isLength({max: 500}).withMessage('Max length 500'),
    body('websiteUrl')
        .exists().withMessage('Name field is required')
        .trim()
        .isLength({max: 100})
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid URL format')
]
