import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  // Vérifier la méthode HTTP
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  // Récupérer l'ID de session Stripe
  const { session_id } = req.query;
  
  if (!session_id) {
    return res.status(400).json({ message: 'ID de session Stripe requis' });
  }

  try {
    // Connexion à la base de données
    await connectToDatabase();

    // Trouver la commande par ID de session Stripe
    const order = await Order.findOne({
      'paymentInfo.stripeSessionId': session_id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier si l'utilisateur est connecté
    const session = await getServerSession(req, res, authOptions);
    
    // Si l'utilisateur est connecté et que la commande n'est pas associée à un utilisateur,
    // on peut l'associer maintenant (par exemple si l'utilisateur s'est connecté pendant le processus de paiement)
    if (session && !order.user) {
      order.user = session.user.id;
      await order.save();
    }

    // Renvoyer les détails de la commande
    return res.status(200).json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de la commande' });
  }
}