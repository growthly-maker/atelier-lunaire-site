import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // Vérifier la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  try {
    // Connexion à la base de données
    await connectToDatabase();
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requis' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Mettre à jour l'utilisateur pour le marquer comme vérifié
    user.isVerified = true;
    await user.save();
    
    return res.status(200).json({ 
      success: true, 
      message: `L'utilisateur ${email} a été marqué comme vérifié avec succès.` 
    });
    
  } catch (error) {
    console.error('Erreur lors de la vérification manuelle de l\'utilisateur:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' 
    });
  }
}