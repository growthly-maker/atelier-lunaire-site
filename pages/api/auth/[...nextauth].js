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
        password: { label: "Mot de passe", type: "password" },
        bypassVerification: { label: "Ignorer la vérification", type: "checkbox" }
      },
      async authorize(credentials) {
        await connectToDatabase();
        
        // Trouver l'utilisateur dans la base de données
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        // Vérifier si l'utilisateur existe
        if (!user) {
          throw new Error('Aucun utilisateur trouvé avec cet email');
        }
        
        // Vérifier si l'email a été vérifié
        // Note: skip la vérification si l'environnement est en développement ou si l'option est activée
        const skipVerification = process.env.NODE_ENV === 'development' || process.env.SKIP_EMAIL_VERIFICATION === 'true';
        
        if (!user.isVerified && !skipVerification) {
          throw new Error('Veuillez vérifier votre adresse email avant de vous connecter');
        }
        
        // Vérifier si le mot de passe correspond
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isMatch) {
          throw new Error('Mot de passe incorrect');
        }
        
        // Retourne l'utilisateur sans le mot de passe
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      session.user.isVerified = token.isVerified;
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