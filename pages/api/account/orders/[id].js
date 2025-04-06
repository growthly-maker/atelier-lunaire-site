import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import mongoose from 'mongoose';

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

    const { id } = req.query;

    // Valider l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de commande invalide' });
    }

    // Connexion à la base de données
    await connectToDatabase();

    // Récupérer la commande spécifique de l'utilisateur
    const order = await Order.findOne({
      _id: id,
      user: session.user.id
    }).lean();

    // Vérifier si la commande existe
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commande non trouvée ou vous n\'avez pas accès à cette commande'
      });
    }

    // Retourner la commande
    return res.status(200).json({ 
      success: true, 
      data: order
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération de la commande',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}