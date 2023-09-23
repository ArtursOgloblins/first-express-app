import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const InputValidationResult = (req:Request, res: Response, next: NextFunction) => {
    const errorsMessages = validationResult(req)
    if (errorsMessages.isEmpty()) {
        return  next()
    }
    res.status(400).send({errors: errorsMessages.array({onlyFirstError: true})})
}