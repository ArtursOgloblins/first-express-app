import { NextFunction, Request, Response } from "express";
import { validationResult, ValidationError  } from "express-validator";


export const InputValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
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