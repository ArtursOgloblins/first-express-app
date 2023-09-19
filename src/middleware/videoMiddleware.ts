import {NextFunction, Request, Response} from "express";
import {validateInputPost, validateInputPut} from "../helpers/videoValidations";

export const createVideoValidation = (req: Request, res: Response, next: NextFunction) => {
    const validationResult = validateInputPost(req.body)
    if (!validationResult.isValid) {
        return res.status(400).send({
            errorsMessages: validationResult.errors
        })
    }
    return next()
}

export const updateVideoValidation = (req: Request, res: Response, next: NextFunction) => {
    const validationResult = validateInputPut(req.body)
    if (!validationResult.isValid) {
        return res.status(400).send({
            errorsMessages: validationResult.errors
        });
    }
    return next()
}
