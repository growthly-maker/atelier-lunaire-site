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
  
  const { id } = req.query;
  
  try {
    await connectToDatabase();
    
    // Gestion de la requête selon la méthode HTTP
    switch (req.method) {
      case 'GET':
        return await getOrder(id, res);
      case 'PUT':
        return await updateOrder(id, req.body, res);
      default:
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans l\'API de commandes:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Récupérer une commande par son ID
async function getOrder(id, res) {
  try {
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de la commande' });
  }
}

// Mettre à jour une commande
async function updateOrder(id, updateData, res) {
  try {
    // Vérifier si la commande existe
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    // Mise à jour de la commande
    const update = {};
    
    // Ne mettre à jour que les champs fournis
    if (updateData.status !== undefined) update.status = updateData.status;
    if (updateData.trackingNumber !== undefined) update.trackingNumber = updateData.trackingNumber;
    if (updateData.notes !== undefined) update.notes = updateData.notes;
    
    // Si le statut change pour "delivered", définir deliveredAt
    if (updateData.status === 'delivered' && order.status !== 'delivered') {
      update.deliveredAt = Date.now();
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande' });
  }
}