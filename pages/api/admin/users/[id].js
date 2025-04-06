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
  
  const { id } = req.query;
  
  try {
    await connectToDatabase();
    
    // Gestion de la requête selon la méthode HTTP
    switch (req.method) {
      case 'GET':
        return await getUser(id, res);
      case 'PUT':
        return await updateUser(id, req.body, res);
      default:
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans l\'API de utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Récupérer un utilisateur par son ID
async function getUser(id, res) {
  try {
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
}

// Mettre à jour un utilisateur
async function updateUser(id, updateData, res) {
  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Empêcher la modification du dernier administrateur
    if (user.isAdmin && updateData.isAdmin === false) {
      // Vérifier s'il y a au moins un autre administrateur
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Impossible de rétrograder le dernier administrateur' });
      }
    }
    
    // Mise à jour de l'utilisateur
    const update = {};
    
    // Ne mettre à jour que les champs fournis
    if (updateData.isAdmin !== undefined) update.isAdmin = updateData.isAdmin;
    if (updateData.newsletterSubscribed !== undefined) update.newsletterSubscribed = updateData.newsletterSubscribed;
    if (updateData.name) update.name = updateData.name;
    if (updateData.email) update.email = updateData.email;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
}