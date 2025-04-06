import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'ID de session requis' });
  }

  try {
    // Récupérez la session avec seulement les éléments essentiels
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer', 'payment_intent'],
    });

    // Vérifiez que la session est complète
    if (session.status !== 'complete') {
      return res.status(400).json({ error: 'Le paiement n\'est pas terminé' });
    }

    // Récupérez les détails des articles commandés
    const lineItems = session.line_items.data;
    
    // Informations de paiement
    const paymentInfo = {
      amount: session.amount_total / 100, // Convertir centimes en euros
      shipping: session.shipping_cost?.amount_total / 100 || 0,
      currency: session.currency,
      paymentMethod: session.payment_method_types[0],
      created: new Date(session.created * 1000).toISOString()
    };

    // Informations d'expédition simplifiées
    const shippingInfo = session.shipping_details ? {
      address: {
        city: session.shipping_details.address?.city || '',
        country: session.shipping_details.address?.country || '',
        line1: session.shipping_details.address?.line1 || '',
        line2: session.shipping_details.address?.line2 || '',
        postal_code: session.shipping_details.address?.postal_code || '',
        state: session.shipping_details.address?.state || ''
      },
      name: session.shipping_details.name || ''
    } : null;

    // Renvoyez les détails de la commande
    res.status(200).json({
      success: true,
      orderId: session.payment_intent?.id || session_id,
      customer: {
        email: session.customer_details?.email || '',
        name: session.customer_details?.name || ''
      },
      shipping: shippingInfo,
      payment: paymentInfo,
      items: lineItems
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la vérification de la commande', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
