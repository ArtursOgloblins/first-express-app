import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";

const loginValidation = body('login')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Username should be string')
    .isLength({max:10, min:3}).withMessage('Length must be between 3-10 chars')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid format')

const passwordValidation = body('password')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Password must be string')
    .isLength({max:20, min:6}).withMessage('Length must be between 6-20 chars')

const emailValidation = body('email')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Username should be string')
    .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid email format')

export const createUserValidation = () => {
    const validation: any = [
        loginValidation,
        passwordValidation,
        emailValidation
    ]
    validation.push(InputValidationResult)
    return validation
}
