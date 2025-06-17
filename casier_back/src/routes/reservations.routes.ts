import { Router } from 'express';
import { createReservation } from '../controllers/reservationController';
import { protect } from '../../src/middleware/auth';

const router = Router();

router.use(protect);

router.post('/', createReservation);

export default router;
