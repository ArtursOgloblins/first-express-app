import express from "express";
import {
    createUserValidation,
    emailValidation,
    resendingEmailValidation
} from "../middleware/users/createUserValidation";
import {registrationValidation} from "../middleware/auth/authValidations";
import {newPasswordValidation} from "../middleware/auth/passwordRecoveryValidations";
import {container, rateLimiter, tokenAuthenticator} from "../composition-root";
import {AuthController} from "../controllers/auth-controller";

const authController = container.resolve(AuthController)

const authRouter = express.Router()


authRouter.post('/registration',rateLimiter, createUserValidation(), authController.userRegistration.bind(authController))
authRouter.post('/registration-confirmation', rateLimiter, registrationValidation(), authController.userRegistrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending',rateLimiter, resendingEmailValidation(), authController.registrationEmailResending.bind(authController))
authRouter.post('/login',rateLimiter, authController.userLogin.bind(authController))
authRouter.post('/refresh-token', authController.createRefreshToken.bind(authController))
authRouter.post('/logout', authController.userLogout.bind(authController))
authRouter.get('/me', tokenAuthenticator, authController.getCurrentUserInfo.bind(authController))
authRouter.post('/password-recovery',rateLimiter, emailValidation(), authController.recoverPassword.bind(authController))
authRouter.post('/new-password',rateLimiter, newPasswordValidation(), authController.updatePassword.bind(authController))

export default authRouter