# Accès garanti au Panel Administrateur

Ce document vous explique comment accéder au panel administrateur d'Atelier Lunaire, quelle que soit votre configuration.

## Pages d'accès direct (sans authentification)

Les pages suivantes sont accessibles **sans authentification** et vous permettront de gérer votre boutique même si vous rencontrez des problèmes avec la connexion admin:

- **Dashboard admin d'urgence**: [http://localhost:3000/admin-override](http://localhost:3000/admin-override)
- **Gestion des produits directe**: [http://localhost:3000/admin-produits-direct](http://localhost:3000/admin-produits-direct)
- **Diagnostic du compte admin**: [http://localhost:3000/admin-diagnostic](http://localhost:3000/admin-diagnostic)

## Diagnostic et résolution des problèmes

Visitez la page [http://localhost:3000/admin-diagnostic](http://localhost:3000/admin-diagnostic) pour obtenir un rapport détaillé sur:

- L'état de votre connexion MongoDB
- Les comptes administrateurs présents dans la base de données
- Le statut de votre session et les droits d'accès
- Les problèmes détectés et leurs solutions

## Solutions aux problèmes courants

### 1. Aucun compte administrateur trouvé

Si vous n'avez pas de compte administrateur dans la base de données:

1. Créez ou modifiez le fichier `.env.local` avec:
   ```
   ADMIN_NAME=VotreNom
   ADMIN_EMAIL=votre@email.com
   ADMIN_PASSWORD=VotreMotDePasse123!
   ```

2. Redémarrez l'application:
   ```
   npm run dev
   ```

### 2. Le compte est admin dans MongoDB mais pas dans la session

Si votre compte apparaît comme administrateur dans MongoDB mais que vous n'avez pas accès au panel admin:

1. Déconnectez-vous complètement
2. Reconnectez-vous avec votre compte administrateur
3. Utilisez les pages d'accès direct listées ci-dessus

### 3. Problèmes avec MongoDB

Si votre application ne peut pas se connecter à MongoDB:

1. Vérifiez que MongoDB est bien démarré
2. Vérifiez la variable `MONGODB_URI` dans `.env.local`
3. En attendant, utilisez les pages d'accès direct qui fonctionnent sans base de données

## En cas de problème persistant

Si vous rencontrez toujours des problèmes d'accès:

1. Effacez le cache Next.js:
   ```
   rm -rf .next
   ```

2. Redémarrez l'application en nettoyant le cache:
   ```
   npm run dev
   ```

3. Essayez un autre navigateur ou une session de navigation privée