import {body} from "express-validator";

export const postsInputValidation = [
    body('title')
        .exists().withMessage('Name field is required')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
        .isLength({max:30}).withMessage('Max length 30'),
    body('shortDescription')
        .exists().withMessage('Name field is required')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
        .isLength({max:100}).withMessage('Max length 100'),
    body('content')
        .exists().withMessage('Name field is required')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
        .isLength({max:1000}).withMessage('Max length 1000'),
    body('blogId')
        .exists().withMessage('Name field is required')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
]
