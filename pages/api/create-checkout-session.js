import Stripe from 'stripe';

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Utilisez la version la plus récente
  maxNetworkRetries: 3, // Augmente la fiabilité pour les problèmes de réseau
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { items } = req.body;

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

    // Crée une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
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
      locale: 'fr', // Page de paiement en français
      allow_promotion_codes: true,
      metadata: {
        origin: 'atelier-lunaire-ecommerce'
      },
      // Pour avoir plus d'informations sur le client
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      customer_email: req.body.email || undefined, // Pré-remplir l'email si disponible
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la création de la session de paiement',
      details: error.message,
      code: error.code || 'unknown_error'
    });
  }
}
