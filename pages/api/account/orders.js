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

    // Pour le développement et les tests, nous allons simuler des commandes s'il n'y en a pas encore
    // Dans un environnement de production, supprimez cette logique de simulation
    const ordersCount = await Order.countDocuments({ user: session.user.id });
    
    if (ordersCount === 0) {
      // Retourner des commandes factices pour le développement
      return res.status(200).json({ 
        success: true, 
        count: 2,
        data: [
          {
            _id: 'mock_order_001',
            user: session.user.id,
            orderStatus: 'confirmée',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            total: 59.90,
            subtotal: 49.90,
            shippingCost: 10.00,
            items: [
              {
                name: 'Collier Croissant de Lune',
                price: 49.90,
                quantity: 1,
              }
            ],
          },
          {
            _id: 'mock_order_002',
            user: session.user.id,
            orderStatus: 'expédiée',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            total: 89.90,
            subtotal: 79.90,
            shippingCost: 10.00,
            items: [
              {
                name: 'Boucles d\'oreilles Étoiles',
                price: 39.95,
                quantity: 2,
              }
            ],
          }
        ] 
      });
    }

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