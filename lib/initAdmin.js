import { connectToDatabase } from './mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';

/**
 * Fonction pour créer un administrateur par défaut au démarrage
 * Cette fonction s'exécute une seule fois pour créer un compte admin
 */
export async function initAdminUser() {
  try {
    await connectToDatabase();
    
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ isAdmin: true });
    
    // Si un admin existe déjà, ne rien faire
    if (adminExists) {
      console.log('Un administrateur existe déjà.');
      return;
    }
    
    // Récupérer les informations d'admin depuis les variables d'environnement
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Vérifier que les informations sont disponibles
    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans les variables d\'environnement.');
      return;
    }
    
    // Vérifier si un utilisateur avec cet email existe déjà
    const userExists = await User.findOne({ email: adminEmail });
    
    if (userExists) {
      // Si l'utilisateur existe mais n'est pas admin, le promouvoir admin
      if (!userExists.isAdmin) {
        await User.updateOne({ email: adminEmail }, { $set: { isAdmin: true } });
        console.log(`L'utilisateur ${adminEmail} a été promu administrateur.`);
      }
      return;
    }
    
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Créer l'utilisateur admin
    const newAdmin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true
    });
    
    await newAdmin.save();
    
    console.log(`Administrateur créé avec succès: ${adminEmail}`);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  }
}