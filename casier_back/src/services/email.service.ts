import sgMail from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/mail'

export class EmailService {
    async sendEmail(email: EmailRequest): Promise<boolean> {
        if (!process.env.SENDGRID_API_KEY) {
            console.error('SENDGRID_API_KEY is not defined in environment variables');
            return false;
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const fromEmail = process.env.FROM_EMAIL || 'abranco3@myges.fr';
        
        const msg: MailDataRequired = {
            to: email.to,
            from: fromEmail,
            subject: email.subject,
            text: email.text || '',
            html: email.html || '',
            mailSettings: {
                sandboxMode: {
                    enable: false
                }
            },
            trackingSettings: {
                clickTracking: {
                    enable: true,
                    enableText: true
                },
                openTracking: {
                    enable: true
                }
            }
        };

        try {
            const response = await sgMail.send(msg);
            console.log('Email sent successfully:', response[0].statusCode);
            return response[0].statusCode >= 200 && response[0].statusCode < 300;
        } catch (error: any) {
            console.error("Error while sending the email:", error?.response?.body || error);
            return false;
        }        
    }
}

export type EmailRequest = {
    to: string,
    subject: string,
    text?: string,
    html?: string
}
