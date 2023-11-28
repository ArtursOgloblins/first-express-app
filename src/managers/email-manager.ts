import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendUserRegistrationMail(code: string, email: string) {
        const subject = `Registration`
        const message = `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
            <a href='http://localhost:3000/auth/registration-confirmation?code=${code}'>complete registration</a>
            </p>`

        await emailAdapter.sendMail(email, subject, message)
    },

    async sendPasswordRecoveryCode(code: string, email: string) {
        const subject = `Password recovery`
        const message  = `
            <h1>Password recovery</h1>
            <p>To finish password recovery please follow the link below:
              <a href='http://localhost:3000/auth/password-recovery?recoveryCode=${code}'>recovery password</a>
            </p>`

        await emailAdapter.sendMail(email, subject, message)
    }
}