import express, { RequestHandler, Request, Response, NextFunction } from 'express';
import { createPaymentSession, confirmPayment, cancelPayment, stripeWebhook } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Middleware pour gérer le body brut pour les webhooks Stripe
const stripeWebhookMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.endsWith('/webhook')) {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.body = data;
      next();
    });
  } else {
    next();
  }
};

// Routes protégées par authentification
router.post('/create-session', protect, createPaymentSession as RequestHandler);
router.get('/confirm', confirmPayment as RequestHandler);
router.post('/cancel', protect, cancelPayment as RequestHandler);

// Route webhook (pas d'authentification requise)
router.post('/webhook', stripeWebhookMiddleware, stripeWebhook as RequestHandler);

export default router; 