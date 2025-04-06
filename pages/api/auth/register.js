import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import { z } from 'zod';

// Schéma de validation avec Zod
const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  newsletterSubscribed: z.boolean().optional(),
});

export default async function handler(req, res) {
  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Valider les données entrantes
    const validationResult = registerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Données d\'inscription invalides';
      return res.status(400).json({ message: errorMessage });
    }
    
    const { name, email, password, newsletterSubscribed } = validationResult.data;

    // Connexion à la base de données
    await connectToDatabase();

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password, // Le modèle User hash automatiquement le mot de passe
      newsletterSubscribed: !!newsletterSubscribed,
    });

    // Renvoyer l'utilisateur sans le mot de passe
    return res.status(201).json({
      message: 'Compte créé avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'inscription' });
  }
}
