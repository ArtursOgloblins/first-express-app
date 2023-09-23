import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const InputValidationResult = (req:Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return  next()
    }
    res.status(400).send({errors: errors.array({onlyFirstError: true})})

}