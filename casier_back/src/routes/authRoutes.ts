import express, { RequestHandler } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/forgot-password', forgotPassword as RequestHandler);
router.get('/reset-password', resetPassword as RequestHandler);

export default router;