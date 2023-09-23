import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";


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

export const blogsInputValidationResult = (req:Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
       return  next()
    }
    res.status(400).send({errors: errors.array({onlyFirstError: true})})
}