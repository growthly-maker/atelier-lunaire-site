// API sécurisée pour vérifier les utilisateurs sans UI
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  // Vérifier la méthode
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  // Vérifier la clé API pour sécuriser cet endpoint
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    // Connexion à la base de données
    await connectToDatabase();
    
    const { email, allUsers } = req.body;
    
    if (allUsers) {
      // Marquer tous les utilisateurs comme vérifiés
      const result = await User.updateMany(
        { isVerified: false },
        { $set: { isVerified: true } }
      );
      
      return res.status(200).json({ 
        success: true, 
        message: `${result.modifiedCount} utilisateurs ont été marqués comme vérifiés.` 
      });
    } else if (email) {
      // Marquer un utilisateur spécifique comme vérifié
      const user = await User.findOneAndUpdate(
        { email },
        { $set: { isVerified: true } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: `L'utilisateur ${email} a été marqué comme vérifié avec succès.` 
      });
    } else {
      return res.status(400).json({ success: false, message: 'Paramètres invalides' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification manuelle:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Une erreur est survenue lors de la mise à jour des utilisateurs.' 
    });
  }
}