import {body} from "express-validator";

export const postsInputValidation = [
    body('title')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
        .isLength({max:30}).withMessage('Max length 30'),
    body('shortDescription')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
        .isLength({max:100}).withMessage('Max length 100'),
    body('content')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
        .isLength({max:1000}).withMessage('Max length 1000'),
    body('blogId')
        .isString().withMessage('Title should be string')
        .trim().withMessage('Incorrect input')
]
