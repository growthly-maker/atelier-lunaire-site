import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import VerificationToken from '../../../models/VerificationToken';
import { sendVerificationEmail } from '../../../lib/emailService';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }

  await dbConnect();

  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Un compte avec cette adresse email existe déjà' 
      });
    }

    // Créer le nouvel utilisateur (non vérifié)
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
    });

    // Générer un token aléatoire
    const token = crypto.randomBytes(32).toString('hex');

    // Sauvegarder le token dans la base de données
    await VerificationToken.create({
      userId: user._id,
      token,
    });

    // Construire l'URL de vérification
    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.host}`;
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    // Envoyer l'email de vérification
    await sendVerificationEmail(user.email, verificationUrl);

    res.status(201).json({ 
      success: true, 
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription' });
  }
}