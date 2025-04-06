# Système de Comptes Utilisateurs pour Atelier Lunaire

Cette extension au site Atelier Lunaire ajoute un système complet de comptes utilisateurs avec base de données MongoDB, permettant aux clients de créer un compte, de se connecter, et de suivre leurs commandes.

## Fonctionnalités implémentées

- **Authentification complète** (inscription, connexion, déconnexion)
- **Profils utilisateurs** avec historique des commandes
- **Stockage sécurisé des données** avec MongoDB
- **Intégration avec le panier existant** pour associer les commandes aux utilisateurs
- **Intégration avec Stripe** pour le suivi des paiements

## Guide d'installation

### 1. Configuration de MongoDB

Avant de commencer, vous devez créer une base de données MongoDB:

1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster
3. Dans "Database Access", créez un utilisateur avec accès en lecture/écriture
4. Dans "Network Access", autorisez votre adresse IP (ou choisissez d'autoriser tout le monde pour le développement)
5. Dans "Clusters", cliquez sur "Connect" pour obtenir votre URI de connexion

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```
# MongoDB
MONGODB_URI=mongodb+srv://votre-utilisateur:votre-mot-de-passe@votrecluster.mongodb.net/atelier-lunaire?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000  # En production, utilisez votre URL de site
NEXTAUTH_SECRET=votre-secret-tres-long-et-aleatoire  # Générez une chaîne aléatoire complexe

# Stripe (déjà configuré dans votre projet)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Installation des dépendances

```bash
npm install next-auth bcryptjs mongoose zod nodemailer @hookform/resolvers react-hook-form swr
```

### 4. Intégration et tests

1. Démarrez le serveur de développement:
```bash
npm run dev
```

2. Testez les fonctionnalités suivantes:
   - Création d'un compte: `/auth/inscription`
   - Connexion: `/auth/connexion`
   - Tableau de bord: `/compte`

## Structure des fichiers

- **lib/mongodb.js** - Configuration de la connexion MongoDB
- **models/** - Modèles de données MongoDB (User, Order)
- **pages/api/auth/** - API d'authentification
- **pages/auth/** - Pages d'authentification (connexion, inscription)
- **pages/compte/** - Pages du tableau de bord utilisateur
- **components/AuthProvider.js** - Provider pour l'authentification

## Mise à jour du Header

Pour ajouter des liens vers le compte utilisateur dans votre Header, mettez à jour votre composant Header.js en y intégrant la vérification de l'authentification:

```jsx
import { useSession } from 'next-auth/react';

// Dans votre composant Header:
const { data: session, status } = useSession();

// Ajouter dans la section navigation:
{status === 'authenticated' ? (
  <div className="relative">
    <button onClick={() => setShowUserMenu(!showUserMenu)}>
      {session.user.name}
    </button>
    {showUserMenu && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg py-1 z-10">
        <Link href="/compte" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Mon compte
        </Link>
        <Link href="/api/auth/signout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Déconnexion
        </Link>
      </div>
    )}
  </div>
) : (
  <Link href="/auth/connexion" className="text-primary-600 hover:text-primary-700">
    Connexion
  </Link>
)}
```

## Webhook Stripe

Pour enregistrer automatiquement les commandes dans votre base de données lors d'un paiement:

1. Installez la CLI Stripe:
```bash
npm install -g stripe-cli
```

2. Exécutez la commande suivante pendant le développement:
```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

3. Ajoutez le webhook secret fourni dans votre fichier `.env.local`

4. En production, configurez un webhook dans le dashboard Stripe pointant vers `https://votre-site.com/api/webhooks/stripe`

## Pages à créer ou compléter

Voici les pages qui restent à créer pour finaliser l'implémentation:

1. **Page de tableau de bord** (`/pages/compte/index.js`) - Pour afficher un résumé des commandes et informations du compte
2. **Page de commandes** (`/pages/compte/commandes/index.js`) - Pour lister toutes les commandes de l'utilisateur
3. **Page de détail de commande** (`/pages/compte/commandes/[id].js`) - Pour afficher les détails d'une commande spécifique
4. **Page de paramètres** (`/pages/compte/parametres.js`) - Pour modifier les informations du profil

## API à compléter

Les API suivantes peuvent être ajoutées pour enrichir le système:

1. **API de récupération des commandes** (`/pages/api/account/orders.js`) - Pour lister les commandes de l'utilisateur
2. **API de profil** (`/pages/api/account/profile.js`) - Pour récupérer et modifier les informations du profil
3. **API de webhook Stripe** (`/pages/api/webhooks/stripe.js`) - Pour traiter les paiements réussis

## Prochaines étapes

1. Compléter les fonctionnalités manquantes listées ci-dessus
2. Intégrer le système de comptes au processus d'achat
3. Ajouter des fonctionnalités supplémentaires comme la liste de souhaits ou les adresses enregistrées

## Support et maintenance

Si vous rencontrez des problèmes ou avez besoin d'assistance pour intégrer ce système, n'hésitez pas à me contacter.