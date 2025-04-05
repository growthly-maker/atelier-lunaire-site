import Stripe from 'stripe';
import { buffer } from 'micro';

// Désactiver l'analyse du corps de la requête par Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Obtenez votre webhook secret depuis le dashboard Stripe
// https://dashboard.stripe.com/webhooks
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      // Vérifiez la signature du webhook
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`Erreur de signature webhook: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Gestion des événements
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Traitement après un paiement réussi
        console.log('Paiement réussi:', session);
        // Ici, vous pouvez mettre à jour votre base de données, envoyer un email, etc.
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent réussi:', paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        console.log('PaymentIntent échoué:', failedPaymentIntent);
        break;
        
      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Erreur de webhook: ${err.message}`);
    res.status(500).json({ error: `Webhook Error: ${err.message}` });
  }
}
