# Système de Compte Utilisateur pour Atelier Lunaire

Ce document explique la mise en œuvre du système de compte utilisateur avec MongoDB pour le site e-commerce Atelier Lunaire.

## Fonctionnalités implémentées

### 1. Base de données MongoDB
- Connexion sécurisée à MongoDB
- Modèles de données pour:
  - Utilisateurs (User.js)
  - Commandes (Order.js)
  - Produits (Product.js)

### 2. Système d'authentification
- Inscription d'utilisateurs
- Connexion sécurisée
- Déconnexion
- Mot de passe oublié avec envoi d'email
- Réinitialisation de mot de passe
- Protection des routes avec session

### 3. Espace utilisateur
- Tableau de bord personnel
- Historique des commandes
- Détails de commande complets
- Gestion du profil (informations personnelles, adresse)
- Modification du mot de passe

### 4. Intégration e-commerce
- Panier lié au compte utilisateur
- Checkout amélioré pour les utilisateurs connectés
- Enregistrement des commandes dans la base de données
- Historique des achats
- Webhook Stripe pour la gestion des paiements

## Configuration requise

### 1. Variables d'environnement
Créez un fichier `.env.local` avec les variables suivantes:

```
# MongoDB
MONGODB_URI=mongodb+srv://votre-uri-mongodb

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-nextauth-aleatoire

# Email (pour réinitialisation de mot de passe)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=user@example.com
EMAIL_SERVER_PASSWORD=password
EMAIL_SERVER_SECURE=false
EMAIL_FROM=Atelier Lunaire <noreply@example.com>

# Stripe (déjà configuré)
STRIPE_SECRET_KEY=sk_test_votre-cle
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre-cle
STRIPE_WEBHOOK_SECRET=whsec_votre-cle

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Installation des dépendances

```bash
npm install next-auth bcryptjs mongoose zod nodemailer @hookform/resolvers react-hook-form swr
```

## Structure des fichiers

Le système est organisé comme suit:

- `/lib/mongodb.js` - Configuration de la connexion MongoDB
- `/models/` - Modèles de données Mongoose
- `/pages/api/auth/` - API d'authentification et gestion des utilisateurs 
- `/pages/api/account/` - API pour les fonctionnalités de compte utilisateur
- `/pages/auth/` - Pages d'authentification (connexion, inscription, etc.)
- `/pages/compte/` - Pages de l'espace utilisateur
- `/components/account/` - Composants pour l'interface de compte utilisateur

## Webhook Stripe

Pour permettre l'enregistrement des commandes en base de données, un webhook Stripe a été implémenté. Pour le tester en local:

1. Installez la CLI Stripe:
```bash
pip install --upgrade stripe
```

2. Connectez-vous à votre compte Stripe:
```bash
stripe login
```

3. Écoutez les événements et redirigez-les vers votre serveur local:
```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

## Points d'amélioration future

1. **Liste de souhaits** - Permettre aux utilisateurs de sauvegarder des produits pour plus tard
2. **Système de notation et avis** - Permettre aux utilisateurs d'évaluer les produits achetés
3. **Dashboard administrateur** - Interface pour gérer les produits, commandes et utilisateurs
4. **Filtrage avancé des commandes** - Recherche par date, statut, etc.
5. **Intégration email marketing** - Pour les utilisateurs ayant accepté la newsletter