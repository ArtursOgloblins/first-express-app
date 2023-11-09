import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";
import {usersQueryRepository} from "../../repositories/users/users-query-repo";

const loginValidation = body('login')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Username should be string')
    .isLength({max:10, min:3}).withMessage('Length must be between 3-10 chars')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid format')
    .custom(async (login) => {
        const user = await usersQueryRepository.getUserByLogin(login)
        if (user) throw new Error('Email already exists')
        return true
    })

const passwordValidation = body('password')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Password must be string')
    .isLength({max:20, min:6}).withMessage('Length must be between 6-20 chars')

const validateEmail = body('email')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Username should be string')
    .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,}$/).withMessage('Invalid email format')

const validateEmailExists = body('email')
    .custom(async (email) => {
        const user = await usersQueryRepository.getUserByEmail(email)
        if (user) throw new Error('Email already exists')
        return true
    })

export const createUserValidation = () => {
    const validation: any = [
        loginValidation,
        passwordValidation,
        validateEmail,
        validateEmailExists
    ]
    validation.push(InputValidationResult)
    return validation
}

export const emailValidation = () => {
    const validation: any = [
        validateEmail
    ]
    validation.push(InputValidationResult)
    return validation
}
