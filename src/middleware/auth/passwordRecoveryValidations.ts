import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";
import {AuthRepository} from "../../repositories/auth/auth-db-repo";

class PasswordRecoveryValidations {
    authRepository: AuthRepository
    constructor() {
        this.authRepository = new AuthRepository()
    }
    validateUpdatedPassword() {
        return body('newPassword')
            .trim()
            .exists().withMessage('Field is required')
            .notEmpty().withMessage('Field must not be empty')
            .isString().withMessage('Password must be string')
            .isLength({max:20, min:6}).withMessage('Length must be between 6-20 chars')
    }

    validateRecoveryCode() {
        return body('recoveryCode')
            .custom(async (recoveryCode) => {
                const recoveryDetails = await this.authRepository.getRecoveryDetails(recoveryCode)
                if (!recoveryDetails) throw new Error('Recovery code is incorrect')
                return true
            })
    }
}

const passwordRecoveryValidations = new PasswordRecoveryValidations();

export const newPasswordValidation = () => {
    const validation: any = [
        passwordRecoveryValidations.validateRecoveryCode(),
        passwordRecoveryValidations.validateUpdatedPassword()
    ]
    validation.push(InputValidationResult)
    return validation
}