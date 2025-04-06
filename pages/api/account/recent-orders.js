import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  // Vérifier la méthode HTTP
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Trouver les commandes récentes de l'utilisateur
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Compter le nombre total de commandes
    const total = await Order.countDocuments({ user: session.user.id });

    // Renvoyer les commandes
    return res.status(200).json({
      orders,
      total,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes récentes:', error);
    return res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des commandes récentes' });
  }
}