// src/routes/email.routes.ts

import { Router, Request, Response } from 'express';
import { EmailRequest, EmailService } from '../services/email.service';


const router = Router();

router.post('/resetPassword', async (req: Request, res: Response) => {
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
});

router.post('/confirmReservation', async (req: Request, res: Response) => {
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
});


router.post('/boxExpiration', async (req: Request, res: Response) => {
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
});

export default router;