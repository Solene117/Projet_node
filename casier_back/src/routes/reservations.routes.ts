import { Router, RequestHandler } from 'express';
import { createReservation, getReservationById } from '../controllers/reservationController';
import { protect } from '../../src/middleware/auth';

const router = Router();

router.use(protect);

router.post('/', createReservation as RequestHandler);
router.get('/:id', getReservationById as RequestHandler);

export default router;
