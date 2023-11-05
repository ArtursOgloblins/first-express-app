import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendMail(email: string, subject: string, message: string) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'a29021343@gmail.com',
                pass: 'zbuncfnvvtuawjcq'
            }
        });

        const info = await transport.sendMail({
            from: 'springJack',
            to: email,
            subject: subject,
            html:message,
        });
        return info
    }
}