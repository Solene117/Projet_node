// src/routes/email.routes.ts

import { Router, Request, Response, RequestHandler } from 'express';
import { EmailRequest, EmailService } from '../services/email.service';
import { boxExpiration, confirmReservation, sendResetPassword } from '../controllers/emailController';


const router = Router();

router.post('/resetPassword', sendResetPassword as RequestHandler);

router.post('/confirmReservation', confirmReservation as RequestHandler);

router.post('/boxExpiration', boxExpiration as RequestHandler);

export default router;