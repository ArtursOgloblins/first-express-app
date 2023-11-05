import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendUserRegistrationMail(user: any) {

        await emailAdapter.sendMail(user.email, "Registration", "Message")
    }
}