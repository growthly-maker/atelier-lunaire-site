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

Créez un fichier `.env.local` à la racine du projet en vous basant sur le fichier `.env.example` fourni.

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
3. Pour tester les webhooks en local, installez Stripe CLI

### Serveur SMTP pour les emails

Pour les fonctionnalités de mot de passe oublié, configurez un serveur SMTP en utilisant les variables EMAIL_* dans votre fichier .env.local.

## 3. Mise à jour des fichiers existants

### Mise à jour de _app.js

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

### Mise à jour du Header et du panier

Mettez à jour ces composants pour qu'ils affichent l'état de connexion de l'utilisateur et s'intègrent au système d'authentification.

## 4. Tests et débogage

Une fois tout installé:
1. Lancez le serveur de développement: `npm run dev`
2. Testez l'inscription et la connexion utilisateur
3. Testez le processus d'achat complet avec Stripe
4. Testez les webhooks Stripe pour s'assurer que les commandes sont bien enregistrées
5. Vérifiez que les données sont correctement stockées dans MongoDB
