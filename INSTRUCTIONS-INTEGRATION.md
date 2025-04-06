# Instructions d'intégration du système de compte utilisateur

Ce document fournit des instructions détaillées pour implémenter le système complet de compte utilisateur avec base de données MongoDB pour le site Atelier Lunaire.

## Structure des dossiers à créer

```
lib/
├── mongodb.js
models/
├── User.js
├── Order.js
├── Product.js
pages/
├── api/
│   ├── auth/
│   │   ├── [...nextauth].js
│   │   ├── register.js
│   │   ├── forgot-password.js
│   │   ├── reset-password.js
│   │   ├── verify-reset-token.js
│   ├── account/
│   │   ├── profile.js
│   │   ├── change-password.js
│   │   ├── orders.js
│   │   ├── orders/[id].js
│   │   ├── recent-orders.js
│   ├── create-checkout-session.js
│   ├── orders/
│   │   ├── session.js
│   ├── webhooks/
│   │   ├── stripe.js
├── auth/
│   ├── connexion.js
│   ├── inscription.js
│   ├── mot-de-passe-oublie.js
│   ├── reinitialiser-mot-de-passe.js
├── compte/
│   ├── index.js
│   ├── commandes/
│   │   ├── index.js
│   │   ├── [id].js
│   ├── parametres.js
components/
├── AuthProvider.js
├── account/
│   ├── AccountLayout.js
```

## 1. Configuration requise

### Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant, en remplaçant les valeurs par vos propres clés :

```
# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_stripe

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/atelier-lunaire?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre_secret_nextauth_tres_long_et_aleatoire

# Email (pour réinitialisation de mot de passe)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=no-reply@votre-domaine.com
EMAIL_SERVER_PASSWORD=votre_mot_de_passe_email
EMAIL_SERVER_SECURE=false
EMAIL_FROM=Atelier Lunaire <no-reply@votre-domaine.com>

# App URL (pour emails, webhooks, etc.)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation des dépendances

Assurez-vous que toutes les dépendances nécessaires sont installées :

```bash
npm install next-auth bcryptjs mongoose zod nodemailer @hookform/resolvers react-hook-form swr
```

## 2. Configuration des services externes

### Base de données MongoDB

1. Créez un compte sur MongoDB Atlas (gratuit) : https://www.mongodb.com/cloud/atlas
2. Créez un cluster et obtenez votre URI de connexion
3. Mettez à jour la variable MONGODB_URI dans votre fichier .env.local

### Stripe

1. Créez un compte Stripe : https://stripe.com
2. Obtenez vos clés API (publique et secrète) et mettez-les dans le fichier .env.local
3. Pour tester les webhooks en local, installez Stripe CLI:
   ```bash
   # Installation via Homebrew pour macOS
   brew install stripe/stripe-cli/stripe
   
   # Connectez-vous à votre compte Stripe
   stripe login
   
   # Écoutez les webhooks et redirigez-les vers votre serveur local
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```
4. Utilisez la clé du webhook fournie par la commande pour mettre à jour votre fichier .env.local

### Serveur SMTP pour les emails

Pour les fonctionnalités de mot de passe oublié, vous aurez besoin d'un serveur SMTP:
- Vous pouvez utiliser un service comme SendGrid, Mailgun, ou Amazon SES
- Pour les tests locaux, vous pouvez utiliser Mailtrap.io (gratuit)
- Mettez à jour les variables EMAIL_* dans votre fichier .env.local

## 3. Implémentation des fichiers principaux

### Connexion MongoDB (lib/mongodb.js)

```javascript
import mongoose from 'mongoose';

/**
 * Variables globales
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Veuillez définir la variable d\'environnement MONGODB_URI dans .env.local'
  );
}

/**
 * Cache de la connexion MongoDB pour améliorer les performances
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connexion à MongoDB
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

### Modèle Utilisateur (models/User.js)

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide'],
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false, // Ne pas renvoyer le mot de passe par défaut
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  newsletterSubscribed: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash du mot de passe avant la sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

### Configuration NextAuth (pages/api/auth/[...nextauth].js)

```javascript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        await connectToDatabase();
        
        // Trouver l'utilisateur dans la base de données
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user) {
          throw new Error('Aucun utilisateur trouvé avec cet email');
        }
        
        // Vérifier si le mot de passe correspond
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isMatch) {
          throw new Error('Mot de passe incorrect');
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/connexion',
    signOut: '/',
    error: '/auth/erreur',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
```

### Provider d'authentification (components/AuthProvider.js)

```javascript
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
```

### Mise à jour de _app.js (pages/_app.js)

```javascript
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import AuthProvider from '../components/AuthProvider';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
```

### API d'inscription (pages/api/auth/register.js)

```javascript
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const validationResult = registerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Données d\'inscription invalides';
      return res.status(400).json({ message: errorMessage });
    }
    
    const { name, email, password, newsletterSubscribed } = validationResult.data;

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
      password,
      newsletterSubscribed: !!newsletterSubscribed,
    });

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
```

## 4. Implémentation des autres fichiers

Pour le reste de l'implémentation, vous devrez créer les fichiers suivants avec le code approprié:

- Le modèle Order (pour enregistrer les commandes)
- Le modèle Product (pour les produits)
- Les pages de connexion, inscription, et réinitialisation de mot de passe
- Les pages du compte utilisateur (tableau de bord, commandes, paramètres)
- L'API de checkout Stripe et le webhook
- Les APIs pour récupérer les commandes et les détails du profil

## 5. Tests et débogage

Une fois tout installé:
1. Lancez le serveur de développement: `npm run dev`
2. Testez l'inscription et la connexion utilisateur
3. Testez le processus d'achat complet avec Stripe
4. Testez les webhooks Stripe pour s'assurer que les commandes sont bien enregistrées
5. Vérifiez que les données sont correctement stockées dans MongoDB

## Ressources supplémentaires

- Documentation MongoDB: https://docs.mongodb.com/
- Documentation NextAuth.js: https://next-auth.js.org/
- Documentation Stripe: https://stripe.com/docs
- Documentation Zod: https://github.com/colinhacks/zod
