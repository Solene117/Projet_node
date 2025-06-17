import { EmailRequest, EmailService } from "../services/email.service";
import { Request, Response } from 'express';

export const confirmReservation = async (req: Request, res: Response) => {
  const { email } = req.body;
  const emailService = new EmailService();

  const emailRequest: EmailRequest = {
    to: email,
    subject: "The box is yours !",
    text: "Frérot, c'est la boite ! Tié trop un bon ! Bienvenue fraté !"
  }

  if (await emailService.sendEmail(emailRequest)) {
    res.json({ status: "Email sent!" });
  } else {
    res.json({ status: "Error while sending the email" });
  }
}

export const boxExpiration = async (req: Request, res: Response) => {
  const { email } = req.body;
  const emailService = new EmailService();

  const emailRequest: EmailRequest = {
    to: email,
    subject: 'Your box is about to expire !',
    text: "Frérot, c'est la boite ! Je vais pas te mentir, c'est la hess ! Alors viens me renouveler !",
  }

  if (await emailService.sendEmail(emailRequest)) {
    res.json({ status: "Email sent!" });
  } else {
    res.json({ status: "Error while sending the email" });
  }
}

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