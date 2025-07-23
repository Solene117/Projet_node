import { Request, Response } from "express";
import Locker from "../models/Locker";
import Reservation from "../models/Reservation";
import { EmailService } from "../services/email.service";
import { PaymentStatus } from "../models/Reservation";

export const createReservation = async (req: Request, res: Response) => {
  const { lockerId, durationHours } = req.body;
  const userId = req.user._id;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

  if (!userId || !lockerId || !durationHours) {
    res.status(400).json({ message: "Paramètres manquants" });
    return;
  }

  try {
    const locker = await Locker.findById(lockerId);
    if (!locker) {
      res.status(400).json({ message: "Casier non trouvé" });
      return;
    }

    const existingReservation = await Reservation.findOne({
      locker: lockerId,
    }).sort({ expiresAt: -1 });

    if (existingReservation && existingReservation.expiresAt < now) {
      locker.status = "free";
      await locker.save();
    }

    if (locker.status === "reserved") {
      res.status(400).json({ message: "Casier déjà réservé" });
      return;
    }

    // Calculer le prix total
    const totalAmount = locker.price * durationHours;

    // Créer la réservation avec statut de paiement en attente
    const reservation = await Reservation.create({
      user: userId,
      locker: lockerId,
      startDate: now,
      durationHours,
      expiresAt,
      paymentStatus: PaymentStatus.PENDING,
      paymentAmount: totalAmount,
    });

    locker.status = "reserved";
    await locker.save();

    res.status(201).json({
      reservation,
      nextStep: {
        action: "payment",
        message: "Veuillez procéder au paiement pour confirmer votre réservation",
        reservationId: reservation._id
      }
    });
  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une fonction pour récupérer une réservation par ID
export const getReservationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      res.status(404).json({ message: "Réservation non trouvée" });
      return;
    }

    // Vérifier que l'utilisateur est autorisé à voir cette réservation
    if (reservation.user.toString() !== userId.toString()) {
      res.status(403).json({ message: "Accès non autorisé à cette réservation" });
      return;
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateExpiredLockers = async () => {
  const now = new Date();
  const expired = await Reservation.find({ expiresAt: { $lt: now } });
  const expiredIds = expired.map(r => r._id);

  await Promise.all(expired.map(async r => {
    const locker = await Locker.findById(r.locker);
    if (locker?.status === 'reserved') {
      locker.status = 'free';
      await locker.save();
    }
  }));

  await Reservation.deleteMany({ _id: { $in: expiredIds } });

  console.log(`🔁 Libérés et supprimées ${expiredIds.length} réservations expirées.`);
};

export const getReservationsForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // grâce à protect, req.user est disponible

    const reservations = await Reservation.find({ user: userId })
      .populate('locker') // pour avoir les infos du casier
      .sort({ startDate: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

