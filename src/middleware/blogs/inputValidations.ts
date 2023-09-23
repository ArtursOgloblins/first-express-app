import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";


export const blogValidationPost = [
    body('name').trim()
        .isLength({ max: 15 })
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
    const result = validationResult(req);
    if (result.isEmpty()) {
        next()
    }
    res.sendStatus(400).send({codeResult: 1, errors: result.array() });
}