import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('⚠️ STRIPE_SECRET_KEY est manquant dans les variables d\'environnement');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export class StripeService {
  /**
   * Crée une session de paiement Stripe
   * @param amount - Montant en centimes (ex: 1000 pour 10€)
   * @param currency - Devise (ex: 'eur')
   * @param name - Nom du produit
   * @param successUrl - URL de redirection en cas de succès
   * @param cancelUrl - URL de redirection en cas d'annulation
   */
  async createPaymentSession(
    amount: number,
    currency: string,
    name: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return session;
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      throw new Error('Erreur lors de la création de la session de paiement');
    }
  }

  /**
   * Vérifie le statut d'un paiement
   * @param sessionId - ID de la session Stripe
   */
  async checkPaymentStatus(sessionId: string): Promise<string> {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return session.payment_status;
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  /**
   * Génère une clé publique éphémère
   */
  async createEphemeralKey(customerId: string): Promise<Stripe.EphemeralKey> {
    try {
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customerId },
        { apiVersion: '2023-10-16' }
      );
      return ephemeralKey;
    } catch (error) {
      console.error('Erreur lors de la création de la clé éphémère:', error);
      throw new Error('Erreur lors de la création de la clé éphémère');
    }
  }

  /**
   * Crée un client Stripe
   */
  async createCustomer(email: string, name?: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      return customer.id;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw new Error('Erreur lors de la création du client');
    }
  }

  /**
   * Récupère un webhook Stripe
   */
  constructWebhookEvent(payload: string, signature: string, webhookSecret: string) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error('Erreur lors de la vérification du webhook:', error);
      throw new Error('Erreur lors de la vérification du webhook');
    }
  }
} 