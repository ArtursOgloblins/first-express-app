import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";
import {usersQueryRepository} from "../../repositories/users/users-query-repo";

const registrationCode = body('code')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Should be string')
    .custom(async (code) => {
        const user = await usersQueryRepository.getUserByRegistrationCode(code)
        if (!user) throw new Error('User not found')
        if (user.emailConfirmation.isConfirmed) throw new Error('Email already confirmed')
        if  (user.emailConfirmation.expirationDate < new Date()) throw new Error('Registration expired')
        return true
    })

export const registrationValidation = () => {
    const validation: any = [
        registrationCode
    ]
    validation.push(InputValidationResult)
    return validation
}