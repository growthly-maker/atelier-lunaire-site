import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'ID de session requis' });
  }

  try {
    // Récupérez la session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer', 'shipping_details', 'payment_intent'],
    });

    // Vérifiez que la session est complète
    if (session.status !== 'complete') {
      return res.status(400).json({ error: 'Le paiement n\'est pas terminé' });
    }

    // Récupérez les détails des articles commandés
    const lineItems = session.line_items.data;
    
    // Récupérez les détails d'expédition
    const shippingDetails = session.shipping_details;

    // Informations de paiement
    const paymentInfo = {
      amount: session.amount_total / 100, // Convertir centimes en euros
      shipping: session.shipping_cost?.amount_total / 100 || 0,
      currency: session.currency,
      paymentMethod: session.payment_method_types[0],
      created: new Date(session.created * 1000).toISOString()
    };

    // Renvoyez les détails de la commande
    res.status(200).json({
      success: true,
      orderId: session.payment_intent?.id || session_id,
      customer: {
        email: session.customer_details?.email,
        name: session.customer_details?.name
      },
      shipping: shippingDetails,
      payment: paymentInfo,
      items: lineItems
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification de la commande', details: error.message });
  }
}
