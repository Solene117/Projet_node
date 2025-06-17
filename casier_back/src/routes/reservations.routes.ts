import { Router, Request, Response } from 'express';
import Locker from '../models/Locker';        // adapte selon ton arborescence
import Reservation from '../models/Reservation';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { userId, lockerId, durationHours } = req.body;

  try {
    const locker = await Locker.findById(lockerId);
    if (!locker || locker.status === 'reserved') {
      return res.status(400).json({ message: 'Casier non disponible' });
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

    const reservation = await Reservation.create({
      user: '665123456789abcdeffedcba',
      locker: lockerId,
      startDate: now,
      endDate,
      durationHours,
      status: 'active',
    });

    locker.status = 'reserved';
    await locker.save();

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur réservation :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
