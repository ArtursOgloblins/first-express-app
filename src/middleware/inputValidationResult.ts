import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const InputValidationResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // Map through the errors array and restructure each error object
    const errorsMessages = errors.array({ onlyFirstError: true }).map(error => {
        return {
            message: error.msg,
            field: (error as any).param,
        };
    });

    // Send the response with the restructured error objects
    res.status(400).send({ errorsMessages });
}