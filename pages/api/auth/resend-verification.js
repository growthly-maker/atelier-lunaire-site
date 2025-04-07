import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import VerificationToken from '../../../models/VerificationToken';
import { sendVerificationEmail } from '../../../lib/emailService';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email requis' });
  }

  await dbConnect();

  try {
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    
    // Ne pas indiquer si l'utilisateur existe pour des raisons de sécurité
    if (!user || user.isVerified) {
      return res.status(200).json({ 
        success: true, 
        message: 'Si votre adresse email existe et n\'est pas vérifiée, un nouvel email a été envoyé' 
      });
    }

    // Supprimer les anciens tokens pour cet utilisateur
    await VerificationToken.deleteMany({ userId: user._id });

    // Générer un nouveau token
    const token = crypto.randomBytes(32).toString('hex');

    // Sauvegarder le nouveau token
    await VerificationToken.create({
      userId: user._id,
      token,
    });

    // Construire l'URL de vérification
    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.host}`;
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    // Envoyer l'email de vérification
    await sendVerificationEmail(user.email, verificationUrl);

    res.status(200).json({ 
      success: true, 
      message: 'Email de vérification envoyé avec succès' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi de l\'email de vérification' 
    });
  }
}