import express, { RequestHandler } from 'express';
import { register, login, forgotPassword, resetPassword, logout,infosUser } from '../controllers/authController';
import { protect } from "../../src/middleware/auth";

const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/forgot-password', forgotPassword as RequestHandler);
router.post('/reset-password', resetPassword as RequestHandler);
router.post('/logout', logout as RequestHandler);
router.get('/me', protect, infosUser as RequestHandler);

export default router;