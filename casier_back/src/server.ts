import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import cron from "node-cron";
import Reservation from "./models/Reservation";
import Locker from "./models/Locker";
import { User } from "./models/User";
import { EmailService, EmailRequest } from "./services/email.service";
import { updateExpiredLockers } from "./controllers/reservationController";

const PORT = process.env.PORT || 3033;
const emailService = new EmailService();

// Vérification de MONGO_URI avant de continuer
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI non défini dans le fichier .env");
  process.exit(1);
}

// Vérification du FRONTEND_URL
if (!process.env.FRONTEND_URL) {
  console.warn("⚠️ FRONTEND_URL non défini dans le fichier .env. Utilisation de la valeur par défaut: http://localhost:5173");
  process.env.FRONTEND_URL = "http://localhost:5173";
}

// Connexion à la base de données
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
});


cron.schedule("*/30 * * * *", async () => {
  console.log(
    "[Cron] Vérification des expirations de casiers",
    new Date().toISOString()
  );
  await updateExpiredLockers();
});

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

  const reservations = await Reservation.find({
    expiresAt: {
      $gte: fiveMinutesLater,
      $lt: new Date(fiveMinutesLater.getTime() + 60000),
    },
  });

  for (const reservation of reservations) {
    const locker = await Locker.findById(reservation.locker);
    const user = await User.findById(reservation.user);
    if (locker && user && user.email) {
      const emailData: EmailRequest = {
        to: user.email,
        subject: "Votre réservation de casier expire bientôt",
        text: `Bonjour ${user.firstName},\n\nVotre réservation du casier #${locker.number} expire dans 5 minutes.\n\nMerci de votre confiance.`,
        html: `<p>Bonjour ${user.firstName},</p><p>Votre réservation du casier #${locker.number} expire dans 5 minutes.</p><p>Merci de votre confiance.</p>`,
      };

      await emailService.sendEmail(emailData);
    }
  }
});
