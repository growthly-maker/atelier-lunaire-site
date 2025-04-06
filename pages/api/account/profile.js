import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Connexion à la base de données
  await connectToDatabase();
  
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ success: false, message: 'Non authentifié' });
  }

  // GET - Récupérer le profil de l'utilisateur
  if (req.method === 'GET') {
    try {
      const user = await User.findById(session.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération du profil',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  // PUT - Mettre à jour le profil de l'utilisateur
  if (req.method === 'PUT') {
    try {
      // Valider les données reçues
      const { name, email, phone, address, currentPassword, newPassword } = req.body;
      
      // Récupérer l'utilisateur actuel avec le mot de passe
      const user = await User.findById(session.user.id).select('+password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      
      // Préparer les données à mettre à jour
      const updateData = {};
      
      if (name) updateData.name = name;
      if (email && email !== user.email) {
        // Vérifier si l'email est déjà utilisé
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== session.user.id) {
          return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
        }
        updateData.email = email;
      }
      if (phone) updateData.phone = phone;
      if (address) updateData.address = address;
      
      // Mettre à jour le mot de passe si nécessaire
      if (currentPassword && newPassword) {
        // Vérifier que l'ancien mot de passe est correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect' });
        }
        
        // Vérifier que le nouveau mot de passe est assez long
        if (newPassword.length < 8) {
          return res.status(400).json({ 
            success: false, 
            message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' 
          });
        }
        
        // Hacher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(newPassword, salt);
      }
      
      // Mettre à jour l'utilisateur
      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Profil mis à jour avec succès',
        data: updatedUser 
      });
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la mise à jour du profil',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  // Méthode non autorisée
  return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
}