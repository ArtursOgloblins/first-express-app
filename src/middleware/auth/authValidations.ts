import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";

const registrationCode = body('code')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Should be string')

export const registrationValidation = () => {
    const validation: any = [
        registrationCode
    ]
    validation.push(InputValidationResult)
    return validation
}