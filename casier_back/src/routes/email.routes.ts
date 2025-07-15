// src/routes/email.routes.ts

import { Router, RequestHandler } from 'express';
import { sendResetPassword } from '../controllers/emailController';


const router = Router();

router.post('/resetPassword', sendResetPassword as RequestHandler);

export default router;