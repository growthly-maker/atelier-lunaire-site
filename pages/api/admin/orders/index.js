import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export default async function handler(req, res) {
  // Vérifier l'authentification et les droits d'administrateur
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  
  // S'assurer que la méthode est GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
  
  try {
    await connectToDatabase();
    return await getOrders(req, res);
  } catch (error) {
    console.error('Erreur dans l\'API de commandes:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Récupérer la liste des commandes avec filtrage et pagination
async function getOrders(req, res) {
  const { page = 1, limit = 10, status = 'all', search = '' } = req.query;
  
  // Convertir les paramètres en nombres
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  // Construire la requête de filtrage
  let query = {};
  
  // Filtrer par statut
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Recherche textuelle (numéro de commande ou nom client)
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.name': { $regex: search, $options: 'i' } }
    ];
  }
  
  // Exécuter la requête avec pagination
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email'),
    Order.countDocuments(query)
  ]);
  
  return res.status(200).json({
    orders,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
}