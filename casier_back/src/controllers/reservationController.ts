import { Request, Response } from "express";
import Locker from "../models/Locker";
import Reservation from "../models/Reservation";
import { User } from "../models/User";
import { EmailService, EmailRequest } from "../services/email.service";

const emailService = new EmailService();

export const createReservation = async (req: Request, res: Response) => {
  const { lockerId, durationHours } = req.body;
  const userId = req.user._id;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

  if (!userId || !lockerId || !durationHours) {
    return res.status(400).json({ message: "Paramètres manquants" });
  }

  try {
    const locker = await Locker.findById(lockerId);
    if (!locker) {
      return res.status(400).json({ message: "Casier non trouvé" });
    }

    const existingReservation = await Reservation.findOne({
      locker: lockerId,
    }).sort({ expiresAt: -1 });

    if (existingReservation && existingReservation.expiresAt < now) {
      locker.status = "free";
      await locker.save();
    }

    if (locker.status === "reserved") {
      return res.status(400).json({ message: "Casier déjà réservé" });
    }

    const reservation = await Reservation.create({
      user: userId,
      locker: lockerId,
      startDate: now,
      durationHours,
      expiresAt,
    });

    locker.status = "reserved";
    await locker.save();

    const user = await User.findById(userId);
    if (user && user.email) {
      const emailData: EmailRequest = {
        to: user.email,
        subject: "Confirmation de votre réservation de casier",
        text: `Bonjour ${user.firstName},\n\nVotre réservation du casier #${locker.number} pour une durée de ${durationHours} heure(s) a été confirmée.\n\nMerci de votre confiance.`,
        html: `<p>Bonjour ${user.firstName},</p><p>Votre réservation du casier #${locker.number} pour une durée de ${durationHours} heure(s) a été confirmée.</p><p>Merci de votre confiance.</p>`,
      };
      await emailService.sendEmail(emailData);
    }

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
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

