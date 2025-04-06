# Configuration de Stripe pour Atelier Lunaire

Ce document explique comment configurer Stripe pour le paiement sur le site Atelier Lunaire.

## Prérequis

1. Un compte Stripe (créez-en un sur [https://stripe.com](https://stripe.com) si vous n'en avez pas)
2. Des clés API Stripe (publique et secrète)

## Configuration des variables d'environnement

Pour que Stripe fonctionne correctement, vous devez configurer plusieurs variables d'environnement dans un fichier `.env.local` à la racine du projet.

### Étape 1: Créer le fichier .env.local

Créez un fichier `.env.local` à la racine du projet s'il n'existe pas déjà.

### Étape 2: Ajouter les variables Stripe

Ajoutez les lignes suivantes dans le fichier `.env.local` :

```
# Clés Stripe
STRIPE_PUBLIC_KEY=pk_test_votre_clé_publique
STRIPE_SECRET_KEY=sk_test_votre_clé_secrète
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_votre_clé_publique

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Étape 3: Remplacer les clés Stripe

1. Connectez-vous à votre [dashboard Stripe](https://dashboard.stripe.com/)
2. Allez dans "Developers" > "API keys"
3. Copiez votre clé publique qui commence par `pk_test_` (en mode test) ou `pk_live_` (en production)
4. Copiez votre clé secrète qui commence par `sk_test_` (en mode test) ou `sk_live_` (en production)
5. Remplacez `pk_test_votre_clé_publique` et `sk_test_votre_clé_secrète` dans le fichier `.env.local` par vos clés réelles

### Étape 4: Configurer l'URL de l'application

- Pour le développement local, laissez `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Pour la production, remplacez-le par l'URL réelle de votre site

## Configuration de NextAuth

Si vous utilisez les fonctionnalités de compte utilisateur, vous devez également configurer NextAuth :

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=une_chaine_aleatoire_longue_et_complexe
```

Pour générer une chaîne aléatoire pour NEXTAUTH_SECRET, vous pouvez utiliser la commande suivante dans votre terminal :

```
openssl rand -base64 32
```

## Test de la configuration

Après avoir configuré vos variables d'environnement :

1. Redémarrez votre serveur de développement avec `npm run dev`
2. Allez dans la boutique et ajoutez des produits au panier
3. Procédez au paiement

### Cartes de test Stripe

Pour tester le paiement sans utiliser une vraie carte, utilisez ces données de carte de test :

- Numéro: `4242 4242 4242 4242`
- Date d'expiration: n'importe quelle date future (ex: 12/34)
- CVC: n'importe quel code à 3 chiffres (ex: 123)
- Code postal: n'importe quel code postal valide (ex: 75001)

## Résolution des problèmes courants

### Erreur "Erreur lors de la création de la session de paiement"

Cette erreur peut être causée par :

1. **Clés Stripe manquantes ou incorrectes** - Vérifiez que vos clés `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, et `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` sont correctement configurées dans `.env.local`

2. **URL de l'application incorrecte** - Assurez-vous que `NEXT_PUBLIC_APP_URL` est correctement configurée

3. **Format de panier invalide** - Assurez-vous que les articles dans le panier ont le format correct

### Vérification des journaux

Pour voir les erreurs détaillées, consultez les journaux de la console dans votre terminal où Next.js s'exécute et dans la console du navigateur (F12 > Console).

## Support

Si vous rencontrez des problèmes, vérifiez :

1. Que tous les fichiers `.env.local` sont correctement configurés
2. Que le serveur de développement a été redémarré après les modifications
3. Que les clés Stripe sont valides et appartiennent au bon compte/mode (test/production)
