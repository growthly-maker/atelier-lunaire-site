import Stripe from 'stripe';
import { buffer } from 'micro';
import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';
import User from '../../../models/User';

// Désactiver le parseur de corps automatique de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Webhook secret pour valider l'événement
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Récupérer le corps brut de la requête
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    // Vérifier la signature de l'événement
    let event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`Erreur de signature webhook: ${err.message}`);
      return res.status(400).json(`Webhook Error: ${err.message}`);
    }

    // Gérer l'événement de paiement réussi
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        await connectToDatabase();

        // Récupérer les détails de la session Stripe
        const stripeSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price.product', 'customer', 'shipping_cost.shipping_rate'],
        });

        // Récupérer les métadonnées
        const { userId, userEmail } = session.metadata;

        // Récupérer l'utilisateur si un ID est disponible
        let user = null;
        if (userId) {
          user = await User.findById(userId);
        }

        // Créer des items de commande à partir des line_items de Stripe
        const orderItems = stripeSession.line_items.data.map(item => {
          const product = item.price.product;
          
          return {
            productId: product.id || product.metadata.productId || 'unknown',
            name: product.name,
            price: item.price.unit_amount / 100, // Convertir de centimes à euros
            quantity: item.quantity,
            image: product.images && product.images.length > 0 ? product.images[0] : null,
            selectedOptions: product.description ? 
              // Tentative de récupération des options à partir de la description
              product.description.split(', ').reduce((acc, opt) => {
                const [key, value] = opt.split(': ');
                if (key && value) acc[key] = value;
                return acc;
              }, {}) : 
              {},
          };
        });

        // Calcul des coûts
        const subtotal = stripeSession.amount_subtotal / 100;
        const shippingCost = stripeSession.shipping_cost ? stripeSession.shipping_cost.amount_total / 100 : 0;
        const total = stripeSession.amount_total / 100;
        const taxAmount = stripeSession.total_details.amount_tax / 100;

        // Déterminer le mode de livraison
        const shippingMethod = stripeSession.shipping_cost && 
          stripeSession.shipping_cost.shipping_rate.display_name.toLowerCase().includes('express') 
          ? 'express' 
          : 'standard';

        // Calculer la date de livraison estimée
        const now = new Date();
        const estimatedDays = shippingMethod === 'express' ? 2 : 5;
        const estimatedDelivery = new Date(now);
        estimatedDelivery.setDate(now.getDate() + estimatedDays);

        // Créer la commande
        const order = await Order.create({
          user: userId || null,
          items: orderItems,
          shippingAddress: {
            name: `${stripeSession.shipping_details.name}`,
            street: `${stripeSession.shipping_details.address.line1} ${stripeSession.shipping_details.address.line2 || ''}`,
            city: stripeSession.shipping_details.address.city,
            postalCode: stripeSession.shipping_details.address.postal_code,
            country: stripeSession.shipping_details.address.country,
            phone: stripeSession.customer_details.phone || '',
          },
          billingAddress: {
            name: `${stripeSession.customer_details.name}`,
            street: `${stripeSession.customer_details.address.line1} ${stripeSession.customer_details.address.line2 || ''}`,
            city: stripeSession.customer_details.address.city,
            postalCode: stripeSession.customer_details.address.postal_code,
            country: stripeSession.customer_details.address.country,
          },
          paymentInfo: {
            stripeSessionId: stripeSession.id,
            stripeCustomerId: stripeSession.customer,
            stripePaymentIntentId: stripeSession.payment_intent,
            paymentMethod: 'card',
            status: 'paid',
          },
          subtotal,
          shippingCost,
          total,
          taxAmount,
          orderStatus: 'confirmée',
          shippingMethod,
          estimatedDelivery,
          email: stripeSession.customer_details.email,
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          guestCheckout: !userId,
        });

        console.log(`✅ Commande créée avec succès: ${order._id}`);
        
        // Renvoyer une réponse de succès
        return res.status(200).json({ received: true, orderId: order._id });
      } catch (error) {
        console.error('Erreur lors du traitement de la commande:', error);
        return res.status(500).json({ error: 'Erreur lors du traitement de la commande' });
      }
    }

    // Pour tous les autres événements, renvoyer une réponse de succès
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
  }
}