import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";
import {UsersQueryRepository} from "../../infrastructure/repositories/users/users-query-repo";

class AuthValidations {
    usersQueryRepository: UsersQueryRepository
    constructor() {
        this.usersQueryRepository = new UsersQueryRepository()
    }

    registrationCode() {
        return body('code')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Should be string')
            .custom(async (code) => {
                const user = await this.usersQueryRepository.getUserByRegistrationCode(code)
                if (!user) throw new Error('User not found')
                if (user.emailConfirmation.isConfirmed) throw new Error('Email already confirmed')
                if (user.emailConfirmation.expirationDate < new Date()) throw new Error('Registration expired')
                return true
            })
    }
}

const authValidations  = new AuthValidations()

export const registrationValidation = () => {
    const validation: any = [
        authValidations.registrationCode()
    ]
    validation.push(InputValidationResult)
    return validation
}