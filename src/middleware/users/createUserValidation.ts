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

const validatePassword = body('password')
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

const validateIsRegistrationConfirmed = body('email')
    .custom(async (email) => {
        const user = await usersQueryRepository.getUserByEmail(email)
        if (!user) throw new Error('Email not found')
        if (user.emailConfirmation.isConfirmed) throw new Error('Email already confirmed')
        //if  (user.emailConfirmation.expirationDate < new Date()) throw new Error('Registration expired')
        return true
    })

export const createUserValidation = () => {
    const validation: any = [
        loginValidation,
        validatePassword,
        validateEmail,
        validateEmailExists
    ]
    validation.push(InputValidationResult)
    return validation
}

export const resendingEmailValidation = () => {
    const validation: any = [
        validateEmail,
        validateIsRegistrationConfirmed
    ]
    validation.push(InputValidationResult)
    return validation
}

export const emailValidation  = () => {
    const  validation: any = [
        validateEmail
    ]
    validation.push(InputValidationResult)
    return validation
}

