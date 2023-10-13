import { NextFunction, Request, Response } from "express";
import { validationResult, ValidationError  } from "express-validator";


export const InputValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const incorrectBlogIdError = errors.array().some(err => ['incorrect blog id', 'incorrect blog id format'].includes(err.msg))
    if (incorrectBlogIdError) {
        return res.sendStatus(404)
    }

    const errorsMessages = errors.array({ onlyFirstError: true })
        .map((error: ValidationError & { path?: string }) => {
        return {
            message: error.msg,
            field: error.path,
        };
    });

    res.status(400).send({ errorsMessages });
}
