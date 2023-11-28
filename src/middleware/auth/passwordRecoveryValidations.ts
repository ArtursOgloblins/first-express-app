import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";
import {authRepository} from "../../repositories/auth/auth-db-repo";


const validateUpdatedPassword = body('newPassword')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Password must be string')
    .isLength({max:20, min:6}).withMessage('Length must be between 6-20 chars')

const validateRecoveryCode = body('recoveryCode')
    .custom(async (recoveryCode) => {
        const recoveryDetails = await authRepository.getRecoveryDetails(recoveryCode)
        if (!recoveryDetails) throw new Error('Recovery code is incorrect')
        return true
    })

export const newPasswordValidation = () => {
    const validation: any = [
        validateRecoveryCode,
        validateUpdatedPassword
    ]
    validation.push(InputValidationResult)
    return validation
}