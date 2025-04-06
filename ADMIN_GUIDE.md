# Guide d'utilisation du Panel Administrateur

## Installation et Configuration

1. **Préparez l'environnement**
   - Assurez-vous d'avoir copié le fichier `.env.example` en `.env.local`
   - Configurez les variables d'environnement, en particulier `ADMIN_EMAIL` et `ADMIN_PASSWORD`

2. **Démarrez l'application**
   ```bash
   npm run dev
   ```

3. **Compte administrateur**
   - Au premier démarrage, un compte administrateur sera automatiquement créé avec les informations fournies dans `.env.local`
   - Vous pourrez utiliser ces identifiants pour vous connecter et accéder au panel d'administration

## Accès au Panel Admin

1. **Connexion**
   - Rendez-vous sur http://localhost:3000/auth/connexion
   - Connectez-vous avec les identifiants administrateur

2. **Accéder au panel**
   - Option 1 : Cliquez sur l'icône utilisateur en haut à droite, puis sur "Administration"
   - Option 2 : Allez directement à http://localhost:3000/admin

## Fonctionnalités du Panel Administrateur

### Tableau de bord

Le tableau de bord vous donne une vue d'ensemble de votre boutique avec :
- Statistiques clés (produits, commandes, utilisateurs, chiffre d'affaires)
- Liste des commandes récentes
- Produits en stock faible nécessitant un réapprovisionnement

### Gestion des Produits

**Liste des produits**
- Consultez tous vos produits avec filtrage par catégorie et recherche
- Voyez rapidement l'état du stock et les informations essentielles

**Ajouter un produit**
1. Cliquez sur "Ajouter un produit" en haut à droite
2. Remplissez le formulaire avec les informations du produit
   - Les champs marqués d'un astérisque (*) sont obligatoires
   - Le slug est généré automatiquement à partir du nom
3. Ajoutez des caractéristiques, options et images selon vos besoins
4. Cliquez sur "Créer le produit" pour finaliser

**Modifier un produit**
- Cliquez sur l'icône de modification dans la liste des produits
- Apportez vos modifications et sauvegardez

**Supprimer un produit**
- Cliquez sur l'icône de suppression dans la liste des produits
- Confirmez la suppression dans la fenêtre de dialogue

### Gestion des Commandes

**Liste des commandes**
- Consultez toutes les commandes avec filtrage par statut et recherche
- Voyez rapidement les informations essentielles sur chaque commande

**Détails d'une commande**
- Cliquez sur une commande pour voir ses détails complets
- Consultez les produits commandés, les informations client et les détails de livraison

**Mettre à jour une commande**
1. Dans la vue détaillée d'une commande, cliquez sur "Modifier"
2. Mettez à jour le statut, ajoutez un numéro de suivi ou des notes
3. Sauvegardez les modifications

### Gestion des Utilisateurs

**Liste des utilisateurs**
- Consultez tous les utilisateurs inscrits sur votre boutique
- Filtrez par rôle (admin/client) ou recherchez un utilisateur spécifique

**Modifier les droits d'un utilisateur**
1. Cliquez sur "Modifier le rôle" pour un utilisateur
2. Choisissez entre les rôles "Administrateur" et "Client"
3. Confirmez le changement

### Paramètres du Site

Personnalisez les paramètres de votre boutique avec trois onglets :

**Général**
- Informations de base du site (nom, description)
- Coordonnées (email, téléphone, adresse)

**Livraison**
- Configuration des frais de livraison
- Seuil pour la livraison gratuite

**Emails**
- Personnalisation des modèles d'emails (confirmation de commande, expédition, etc.)

## Conseils d'utilisation

- **Navigation mobile** : Utilisez le bouton hamburger en haut à gauche pour ouvrir le menu sur les appareils mobiles
- **Mise à jour du stock** : Surveillez régulièrement la section "Produits en stock faible" du tableau de bord
- **Sécurité** : Changez régulièrement le mot de passe de votre compte administrateur
- **Sauvegarde** : Effectuez des sauvegardes régulières de votre base de données pour sécuriser vos données

## Besoin d'aide ?

Si vous rencontrez des difficultés ou avez des questions sur l'utilisation du panel administrateur, n'hésitez pas à consulter la documentation complète ou à contacter notre équipe de support.