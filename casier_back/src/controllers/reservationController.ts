import { Request, Response } from 'express';
import Locker from '../models/Locker';
import Reservation from '../models/Reservation';

export const createReservation = async (req: Request, res: Response) => {
  const {lockerId, durationHours } = req.body;
  const userId = req.user._id;

  if (!userId || !lockerId || !durationHours) {
    return res.status(400).json({ message: 'Paramètres manquants' });
  }

  try {
    const locker = await Locker.findById(lockerId);
    if (!locker || locker.status === 'reserved') {
      return res.status(400).json({ message: 'Casier non disponible' });
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

    const reservation = await Reservation.create({
      user: userId,
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
};
