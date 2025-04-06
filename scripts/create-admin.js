// Script pour créer un utilisateur administrateur directement dans MongoDB
// Usage: node scripts/create-admin.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du modèle User (simplifié pour le script)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Fonction principale
async function createAdmin() {
  // Informations admin par défaut ou depuis les variables d'environnement
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  
  // Vérifier les informations admin
  if (!adminEmail || !adminPassword) {
    console.error('❌ Erreur: Email ou mot de passe admin manquant');
    console.log('👉 Définissez ADMIN_EMAIL et ADMIN_PASSWORD dans .env.local');
    process.exit(1);
  }
  
  try {
    // Connexion à MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ Erreur: MONGODB_URI non défini dans .env.local');
      process.exit(1);
    }
    
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Créer le modèle User
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log(`👤 L'utilisateur ${adminEmail} existe déjà`);
      
      if (existingUser.isAdmin) {
        console.log('✅ Cet utilisateur a déjà les droits d\'administrateur');
      } else {
        // Attribuer les droits d'admin
        console.log('🔄 Attribution des droits d\'administrateur...');
        await User.updateOne({ email: adminEmail }, { $set: { isAdmin: true } });
        console.log('✅ Droits d\'administrateur attribués avec succès!');
      }
    } else {
      // Créer un nouvel utilisateur admin
      console.log('🔄 Création d\'un nouvel utilisateur administrateur...');
      
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Créer l'utilisateur
      const newAdmin = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      
      await newAdmin.save();
      console.log('✅ Administrateur créé avec succès!');
    }
    
    console.log('\n📌 Informations de connexion admin:');
    console.log(`👤 Email: ${adminEmail}`);
    console.log(`🔑 Mot de passe: ${'*'.repeat(adminPassword.length)}`);
    console.log('\n🔸 Vous pouvez maintenant vous connecter au panel administrateur à l\'adresse:');
    console.log('  http://localhost:3000/admin-override');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    // Fermer la connexion MongoDB
    mongoose.connection.close();
    console.log('👋 Connexion MongoDB fermée');
  }
}

// Exécuter la fonction
createAdmin();