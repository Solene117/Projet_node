import { Request, Response } from 'express';
import { StripeService } from '../services/stripe.service';
import Reservation, { PaymentStatus } from '../models/Reservation';
import Locker from '../models/Locker';
import { EmailService } from '../services/email.service';
import { User } from '../models/User';

const stripeService = new StripeService();
const emailService = new EmailService();

/**
 * Crée une session de paiement pour une réservation
 * @route POST /api/payments/create-session
 */
export const createPaymentSession = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;
    
    // Vérifier que la réservation existe
    const reservation = await Reservation.findById(reservationId).populate('locker');
    if (!reservation) {
      res.status(404).json({ message: 'Réservation non trouvée' });
      return;
    }

    // Vérifier que l'utilisateur est propriétaire de la réservation
    if (reservation.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Accès non autorisé à cette réservation' });
      return;
    }

    // Vérifier que la réservation n'est pas déjà payée
    if (reservation.paymentStatus === PaymentStatus.PAID) {
      res.status(400).json({ message: 'Cette réservation est déjà payée' });
      return;
    }

    const locker = reservation.locker as any; // Cast pour accéder aux propriétés
    
    // Calculer le prix total
    const totalAmount = locker.price * reservation.durationHours;
    
    // Créer une session de paiement Stripe
    const session = await stripeService.createPaymentSession(
      totalAmount * 100, // Convertir en centimes pour Stripe
      'eur',
      `Réservation du casier #${locker.number} pour ${reservation.durationHours}h`,
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancel?reservation_id=${reservationId}`
    );

    // Mettre à jour la réservation avec l'ID de session
    reservation.paymentSessionId = session.id;
    reservation.paymentAmount = totalAmount;
    await reservation.save();

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * Confirme un paiement après redirection Stripe
 * @route GET /api/payments/confirm
 */
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { session_id, reservation_id } = req.query;

    if (!session_id || !reservation_id) {
      res.status(400).json({ message: 'Paramètres manquants' });
      return;
    }

    // Vérifier le statut du paiement
    const paymentStatus = await stripeService.checkPaymentStatus(session_id as string);
    
    // Mettre à jour la réservation
    const reservation = await Reservation.findById(reservation_id);
    if (!reservation) {
      res.status(404).json({ message: 'Réservation non trouvée' });
      return;
    }

    if (paymentStatus === 'paid') {
      reservation.paymentStatus = PaymentStatus.PAID;
      reservation.paymentDate = new Date();
      await reservation.save();

      // Envoyer un email de confirmation de paiement
      const user = await User.findById(reservation.user);
      const locker = await Locker.findById(reservation.locker);
      
      if (user && locker) {
        await emailService.sendEmail({
          to: user.email,
          subject: 'Confirmation de votre réservation de casier',
          text: `Votre paiement de ${reservation.paymentAmount}€ pour la réservation du casier #${locker.number} a bien été reçu. Votre réservation est maintenant confirmée.`,
          html: `
            <h2>Réservation confirmée</h2>
            <p>Bonjour ${user.firstName},</p>
            <p>Votre paiement de <strong>${reservation.paymentAmount}€</strong> pour la réservation du casier #${locker.number} a bien été reçu.</p>
            <p><strong>Votre réservation est maintenant confirmée.</strong></p>
            <p>Durée: ${reservation.durationHours} heure(s)</p>
            <p>Date de début: ${reservation.startDate.toLocaleDateString()}</p>
            <p>Date d'expiration: ${reservation.expiresAt.toLocaleDateString()} à ${reservation.expiresAt.toLocaleTimeString()}</p>
            <p>Merci pour votre réservation!</p>
          `
        });
      }

      res.status(200).json({ success: true });
      return;
    } else {
      reservation.paymentStatus = PaymentStatus.FAILED;
      await reservation.save();
      
      // Libérer le casier si le paiement a échoué
      const locker = await Locker.findById(reservation.locker);
      if (locker) {
        locker.status = 'free';
        await locker.save();
      }
      
      // Supprimer la réservation échouée
      await Reservation.findByIdAndDelete(reservation._id);
      
      res.status(400).json({ message: 'Le paiement a échoué' });
      return;
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * Annule un paiement et libère la réservation
 * @route POST /api/payments/cancel
 */
export const cancelPayment = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      res.status(404).json({ message: 'Réservation non trouvée' });
      return;
    }

    // Vérifier que l'utilisateur est propriétaire de la réservation
    if (reservation.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Accès non autorisé à cette réservation' });
      return;
    }

    // Mettre à jour le statut de paiement
    reservation.paymentStatus = PaymentStatus.CANCELLED;
    await reservation.save();

    // Libérer le casier
    const locker = await Locker.findById(reservation.locker);
    if (locker) {
      locker.status = 'free';
      await locker.save();
    }

    // Supprimer la réservation
    await Reservation.findByIdAndDelete(reservationId);

    res.json({ message: 'Réservation et paiement annulés avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * Webhook Stripe pour mettre à jour les paiements
 * @route POST /api/payments/webhook
 */
export const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET est manquant dans les variables d\'environnement');
      res.status(500).json({ message: 'Erreur de configuration du webhook' });
      return;
    }

    const event = stripeService.constructWebhookEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Gérer les événements Stripe
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const reservation = await Reservation.findOne({ paymentSessionId: session.id });
        
        if (reservation) {
          reservation.paymentStatus = PaymentStatus.PAID;
          reservation.paymentDate = new Date();
          await reservation.save();
          
          // Envoyer un email de confirmation de paiement et de réservation
          const user = await User.findById(reservation.user);
          const locker = await Locker.findById(reservation.locker);
          
          if (user && locker) {
            await emailService.sendEmail({
              to: user.email,
              subject: 'Confirmation de votre réservation de casier',
              text: `Votre paiement de ${reservation.paymentAmount}€ pour la réservation du casier #${locker.number} a bien été reçu. Votre réservation est maintenant confirmée.`,
              html: `
                <h2>Réservation confirmée</h2>
                <p>Bonjour ${user.firstName},</p>
                <p>Votre paiement de <strong>${reservation.paymentAmount}€</strong> pour la réservation du casier #${locker.number} a bien été reçu.</p>
                <p><strong>Votre réservation est maintenant confirmée.</strong></p>
                <p>Durée: ${reservation.durationHours} heure(s)</p>
                <p>Date de début: ${reservation.startDate.toLocaleDateString()}</p>
                <p>Date d'expiration: ${reservation.expiresAt.toLocaleDateString()} à ${reservation.expiresAt.toLocaleTimeString()}</p>
                <p>Merci pour votre réservation!</p>
              `
            });
          }
          
          console.log(`🔔 Paiement confirmé pour la réservation: ${reservation._id}`);
        }
        break;
      
      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        const expiredReservation = await Reservation.findOne({ paymentSessionId: expiredSession.id });
        
        if (expiredReservation) {
          expiredReservation.paymentStatus = PaymentStatus.CANCELLED;
          await expiredReservation.save();
          
          // Libérer le casier
          const locker = await Locker.findById(expiredReservation.locker);
          if (locker) {
            locker.status = 'free';
            await locker.save();
          }
          
          console.log(`🔔 Session de paiement expirée pour la réservation: ${expiredReservation._id}`);
        }
        break;
        
      case 'payment_intent.payment_failed':
      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object;
        const failedReservation = await Reservation.findOne({ paymentSessionId: failedSession.id });
        
        if (failedReservation) {
          failedReservation.paymentStatus = PaymentStatus.FAILED;
          await failedReservation.save();
          
          // Libérer le casier
          const failedLocker = await Locker.findById(failedReservation.locker);
          if (failedLocker) {
            failedLocker.status = 'free';
            await failedLocker.save();
          }
          
          // Supprimer la réservation échouée
          await Reservation.findByIdAndDelete(failedReservation._id);
          
          console.log(`🔔 Paiement échoué pour la réservation: ${failedReservation._id}`);
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur dans le webhook Stripe:', error);
    res.status(400).json({ message: 'Erreur webhook' });
  }
}; 