import sgMail from '@sendgrid/mail'

export class EmailService {
    async sendEmail(email: EmailRequest): Promise<boolean> {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

        const msg = {
            to: email.to,
            from: 'abranco3@myges.fr',
            subject: email.subject,
            text: email.text,
            html: email.html
        }
        try {
            await sgMail.send(msg)

            console.log('Email sent')
            return true;
        } catch (error) {
            console.error("Error while sending the email")
            return false;
        }        
    }
}

export type EmailRequest = {
    to: string,
    subject: string,
    text: string,
    html?: string
}
