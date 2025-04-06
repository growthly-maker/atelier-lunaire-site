import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../models/User';

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
    return await getUsers(req, res);
  } catch (error) {
    console.error('Erreur dans l\'API de utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Récupérer la liste des utilisateurs avec filtrage et pagination
async function getUsers(req, res) {
  const { page = 1, limit = 10, role = 'all', search = '' } = req.query;
  
  // Convertir les paramètres en nombres
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  // Construire la requête de filtrage
  let query = {};
  
  // Filtrer par rôle
  if (role === 'admin') {
    query.isAdmin = true;
  } else if (role === 'customer') {
    query.isAdmin = false;
  } else if (role === 'newsletter') {
    query.newsletterSubscribed = true;
  }
  
  // Recherche textuelle (nom ou email)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Exécuter la requête avec pagination
  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('name email isAdmin newsletterSubscribed createdAt'),
    User.countDocuments(query)
  ]);
  
  return res.status(200).json({
    users,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
}