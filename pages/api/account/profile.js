import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

// Schéma de validation pour les mises à jour du profil
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional().nullable(),
  address: z.object({
    street: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
  }).optional(),
  newsletterSubscribed: z.boolean().optional(),
});

export default async function handler(req, res) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Connexion à la base de données
    await connectToDatabase();

    // GET - Récupérer le profil utilisateur
    if (req.method === 'GET') {
      const user = await User.findById(session.user.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      return res.status(200).json(user);
    }
    
    // PUT - Mettre à jour le profil utilisateur
    if (req.method === 'PUT') {
      // Valider les données
      const validationResult = updateProfileSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || 'Données de profil invalides';
        return res.status(400).json({ message: errorMessage });
      }
      
      const { name, phone, address, newsletterSubscribed } = validationResult.data;
      
      // Trouver et mettre à jour l'utilisateur
      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        {
          name,
          phone,
          address,
          newsletterSubscribed,
          updatedAt: new Date(),
        },
        { new: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      return res.status(200).json({
        message: 'Profil mis à jour avec succès',
        user: updatedUser,
      });
    }
    
    // Méthode non supportée
    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur de profil:', error);
    return res.status(500).json({ message: 'Une erreur s\'est produite lors du traitement de la demande' });
  }
}