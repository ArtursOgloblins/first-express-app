import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";
import {UsersQueryRepository} from "../../repositories/users/users-query-repo";

class CreateUserValidation {
    usersQueryRepository: UsersQueryRepository
    constructor() {
        this.usersQueryRepository = new UsersQueryRepository()
    }
    loginValidation() {
        return body('login')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Username should be string')
            .isLength({max:10, min:3}).withMessage('Length must be between 3-10 chars')
            .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid format')
            .custom(async (login) => {
                const user = await this.usersQueryRepository.getUserByLogin(login)
                if (user) throw new Error('Email already exists')
                return true
            })
    }

    validatePassword() {
        return body('password')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Password must be string')
            .isLength({max:20, min:6}).withMessage('Length must be between 6-20 chars');
    }

    validateEmail() {
        return body('email')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Username should be string')
            .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,}$/).withMessage('Invalid email format');
    }

    validateEmailExists() {
        return body('email')
            .custom(async (email) => {
                const user = await this.usersQueryRepository.getUserByEmail(email)
                if (user) throw new Error('Email already exists')
                return true
            })
    }

    validateIsRegistrationConfirmed() {
        return body('email')
            .custom(async (email) => {
                const user = await this.usersQueryRepository.getUserByEmail(email)
                if (!user) throw new Error('Email not found')
                if (user.emailConfirmation.isConfirmed) throw new Error('Email already confirmed')
                //if  (user.emailConfirmation.expirationDate < new Date()) throw new Error('Registration expired')
                return true
            })
    }
}

const userValidation = new CreateUserValidation()

export const createUserValidation = () => {
    const validation: any = [
        userValidation.loginValidation(),
        userValidation.validatePassword(),
        userValidation.validateEmail(),
        userValidation.validateEmailExists()
    ]
    validation.push(InputValidationResult)
    return validation
}

export const resendingEmailValidation = () => {
    const validation: any = [
        userValidation.validateEmail(),
        userValidation.validateIsRegistrationConfirmed()
    ]
    validation.push(InputValidationResult)
    return validation
}

export const emailValidation  = () => {
    const  validation: any = [
        userValidation.validateEmail()
    ]
    validation.push(InputValidationResult)
    return validation
}

