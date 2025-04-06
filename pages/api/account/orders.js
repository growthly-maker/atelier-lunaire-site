import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/mongodb';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  // Vérifier la méthode de la requête
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Récupérer les commandes de l'utilisateur
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 }) // Tri par date décroissante
      .select('-__v') // Exclure le champ de versioning
      .lean(); // Convertir en objet JavaScript

    // Retourner les commandes
    return res.status(200).json({ 
      success: true, 
      count: orders.length,
      data: orders 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des commandes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}