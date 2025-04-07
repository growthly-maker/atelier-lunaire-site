import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import VerificationToken from '../../../models/VerificationToken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token manquant' });
  }

  await dbConnect();

  try {
    // Trouver le token
    const verificationToken = await VerificationToken.findOne({ token });
    
    if (!verificationToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token invalide ou expiré' 
      });
    }

    // Mettre à jour l'utilisateur associé
    const user = await User.findByIdAndUpdate(
      verificationToken.userId,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Supprimer le token utilisé
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    res.status(200).json({ 
      success: true, 
      message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification de l\'email' 
    });
  }
}