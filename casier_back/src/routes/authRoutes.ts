import express, { RequestHandler } from 'express';
import { register, login, forgotPassword, resetPassword, infosUser } from '../controllers/authController';
import { protect } from "../../src/middleware/auth";

const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/forgot-password', forgotPassword as RequestHandler);
router.get('/reset-password', resetPassword as RequestHandler);
router.get('/me', protect, infosUser)

export default router;