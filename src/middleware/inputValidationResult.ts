import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const InputValidationResult = (req:Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length === 0) {
        return  next()
    }

    const errorsMessages = errors.map((error: any) => ({
        message: error.msg,
        field: error.param
    }))
    res.status(400).send({errorsMessages})

}