import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendUserRegistrationMail(user: any) {

        const message = `
            <h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
            </p>`

        const subject = `Registration`

        await emailAdapter.sendMail(user.accountData.email, subject, message)
    }
}