import {body} from "express-validator";


export const blogValidationPost = [
    body('name').trim()
        .isLength({ max: 10 })
        .withMessage('Max length 10 '),
    body('description')
        .trim()
        .isLength({max: 500}).withMessage('Max length 500'),
    body('websiteUrl')
        .trim()
        .isLength({max: 100})
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid URL format')
]
