import {body} from "express-validator";

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
