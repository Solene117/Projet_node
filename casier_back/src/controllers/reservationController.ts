import { Request, Response } from "express";
import Locker from "../models/Locker";
import Reservation from "../models/Reservation";
import { User, UserRole } from "../models/User";
import { EmailService, EmailRequest } from "../services/email.service";

const emailService = new EmailService();

export const createReservation = async (req: Request, res: Response) => {
  const { lockerId, durationHours } = req.body;
  const userId = req.user._id;

  if (!userId || !lockerId || !durationHours) {
    return res.status(400).json({ message: "Paramètres manquants" });
  }

  try {
    const locker = await Locker.findById(lockerId);
    if (!locker || locker.status === "reserved") {
      return res.status(400).json({ message: "Casier non disponible" });
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

    const reservation = await Reservation.create({
      user: userId,
      locker: lockerId,
      startDate: now,
      endDate,
      durationHours,
      status: "active",
    });

    locker.status = "reserved";
    await locker.save();

    try {
      const user = await User.findOne({ _id: userId });
      console.log(user)
      if (user && user.email) {
        const emailData: EmailRequest = {
          to: user.email,
          subject: "Confirmation de votre réservation de casier",
          text: `Bonjour ${user.firstName},

         Votre réservation du casier #${locker.number} pour une durée de ${durationHours} heure(s) a été confirmée.

          Merci de votre confiance.`,
          html: `<p>Bonjour ${user.firstName},</p>
               <p>Votre réservation du casier #${locker.number} pour une durée de ${durationHours} heure(s) a été confirmée.</p>
               <p>Merci de votre confiance.</p>`,
        };
        await emailService.sendEmail(emailData);
      }
    } catch (emailError) {
      console.error("Erreur envoi email :", emailError);
    }

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Erreur réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
