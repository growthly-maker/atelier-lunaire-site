import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { items, shippingDetails, email } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // Vérifiez que les items ont le format correct
    const validItems = items.every(item => {
      return (
        item.price_data &&
        item.price_data.currency &&
        item.price_data.product_data &&
        typeof item.price_data.unit_amount === 'number' &&
        typeof item.quantity === 'number'
      );
    });

    if (!validItems) {
      return res.status(400).json({ error: 'Format d\'item invalide' });
    }

    // Vérifier si l'utilisateur est connecté
    const session = await getServerSession(req, res, authOptions);
    
    // Si l'utilisateur est connecté, récupérer ses informations
    let userData = null;
    
    if (session) {
      await connectToDatabase();
      userData = await User.findById(session.user.id);
    }

    // Créer des metadata pour Stripe qui permettront de retrouver la commande
    const metadata = {
      origin: 'atelier-lunaire-ecommerce',
      items: JSON.stringify(items.map(item => ({
        id: item.price_data.product_data.id,
        name: item.price_data.product_data.name,
        quantity: item.quantity,
      }))),
      userEmail: session ? session.user.email : email,
      userId: session ? session.user.id : null,
    };

    // Pré-remplir l'email du client si disponible
    const customer_email = session ? session.user.email : email;

    // Crée une session de paiement Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/commande/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/panier`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'eur',
            },
            display_name: 'Livraison standard',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1000, // 10€ en centimes
              currency: 'eur',
            },
            display_name: 'Livraison express',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 2,
              },
            },
          },
        },
      ],
      locale: 'fr',
      allow_promotion_codes: true,
      metadata,
      // Pour avoir plus d'informations sur le client
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      customer_email: customer_email || undefined,
    });

    res.status(200).json({ id: stripeSession.id });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la création de la session de paiement',
      details: error.message,
      code: error.code || 'unknown_error'
    });
  }
}