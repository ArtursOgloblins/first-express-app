import express from "express";
import {
    createUserValidation,
    emailValidation,
    resendingEmailValidation
} from "../middleware/users/createUserValidation";
import {registrationValidation} from "../middleware/auth/authValidations";
import {newPasswordValidation} from "../middleware/auth/passwordRecoveryValidations";
import {authController, authWithToken, rateLimitValidation} from "../composition-root";

const authRouter = express.Router()


authRouter.post('/registration',rateLimitValidation, createUserValidation(), authController.userRegistration.bind(authController))
authRouter.post('/registration-confirmation', rateLimitValidation, registrationValidation(), authController.userRegistrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending',rateLimitValidation, resendingEmailValidation(), authController.registrationEmailResending.bind(authController))
authRouter.post('/login',rateLimitValidation, authController.userLogin.bind(authController))
authRouter.post('/refresh-token', authController.createRefreshToken.bind(authController))
authRouter.post('/logout', authController.userLogout.bind(authController))
authRouter.get('/me', authWithToken, authController.getCurrentUserInfo.bind(authController))
authRouter.post('/password-recovery',rateLimitValidation, emailValidation(), authController.recoverPassword.bind(authController))
authRouter.post('/new-password',rateLimitValidation, newPasswordValidation(), authController.updatePassword.bind(authController))

export default authRouter