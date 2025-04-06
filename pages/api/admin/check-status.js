import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Tenter de se connecter à la base de données
    const mongoConnection = await connectToDatabase();
    
    // Vérification de la session
    const session = await getServerSession(req, res, authOptions);
    
    // Stats de diagnostic
    const diagnostics = {
      mongodbConnected: !!mongoConnection,
      session: session ? {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          isAdmin: session.user.isAdmin || false,
        },
        expires: session.expires
      } : null,
      adminUsers: [],
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Défini' : 'Non défini',
        MONGODB_URI: process.env.MONGODB_URI ? 'Défini' : 'Non défini',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'Défini' : 'Non défini',
      }
    };
    
    // Vérifier les utilisateurs admin dans la base de données
    try {
      const adminUsers = await User.find({ isAdmin: true }).select('name email');
      diagnostics.adminUsers = adminUsers.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }));
      diagnostics.adminCount = adminUsers.length;
    } catch (error) {
      diagnostics.userError = error.message;
    }
    
    // Renvoyer toutes les informations de diagnostic
    return res.status(200).json(diagnostics);
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    return res.status(500).json({ 
      message: 'Erreur lors de la vérification',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}