import { Request, Response } from 'express';
import Locker from '../models/Locker';

export const getAllLockers = async (_req: Request, res: Response) => {
  try {
    const lockers = await Locker.find();
    res.json(lockers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const addLocker = async (req: Request, res: Response) => {
  try {
    const { number, size, price } = req.body;
    const locker = new Locker({ number, size, price });
    await locker.save();
    res.status(201).json(locker);
  } catch (error) {
    res.status(400).json({ message: 'Données invalides' });
  }
};

export const updateLocker = async (req: Request, res: Response) => {
  try {
    const locker = await Locker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!locker) {
      return res.status(404).json({ message: 'Casier non trouvé' });
    }
    res.json(locker);
  } catch (error) {
    res.status(400).json({ message: 'Données invalides' });
  }
};

export const deleteLocker = async (req: Request, res: Response) => {
  try {
    const locker = await Locker.findByIdAndDelete(req.params.id);
    if (!locker) {
      return res.status(404).json({ message: 'Casier non trouvé' });
    }
    res.json({ message: 'Casier supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
