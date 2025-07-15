import { EmailRequest, EmailService } from "../services/email.service";
import { Request, Response } from 'express';

export const sendResetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const emailService = new EmailService();

  const emailRequest: EmailRequest = {
    to: email,
    subject: "Reset password code",
    text: "Your reset password code : [code]"
  }

  if (await emailService.sendEmail(emailRequest)) {
    res.json({ status: "Email sent!" });
  } else {
    res.json({ status: "Error while sending the email" });
  }
}