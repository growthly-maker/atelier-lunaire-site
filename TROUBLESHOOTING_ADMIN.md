# Guide de dépannage pour le Panel Administrateur

## Problème d'accès à l'interface admin

Si vous rencontrez une erreur 404 ou des problèmes pour accéder à la page `/admin`, voici les solutions pour résoudre ce problème.

### Solution 1 : Utilisez les URLs alternatives

Nous avons créé des URLs alternatives pour vous permettre d'accéder au panel admin en cas de problème :

1. **Page d'accès direct** : `/admin-direct`
2. **Dashboard admin simplifié** : `/admin/index-basic`

Ces pages vous permettront de diagnostiquer et de contourner les problèmes d'accès.

### Solution 2 : Réactiver le middleware (si nécessaire)

Le middleware d'authentification a été temporairement désactivé pour faciliter le diagnostic. Si vous souhaitez le réactiver :

1. Supprimez le fichier `middleware.js`
2. Renommez `middleware.js.backup` en `middleware.js`

### Solution 3 : Vérifier l'état de l'utilisateur administrateur

Assurez-vous que votre compte est bien configuré en tant qu'administrateur :

1. Vérifiez que le fichier `.env.local` contient les bonnes informations admin :
   ```
   ADMIN_NAME=VotreNom
   ADMIN_EMAIL=votre@email.com
   ADMIN_PASSWORD=MotDePasseSecurise123!
   ```

2. Redémarrez l'application pour que l'initialisation du compte admin se déclenche automatiquement.

3. Utilisez les identifiants définis dans `.env.local` pour vous connecter.

## Routes d'accès direct

Voici les routes principales de l'interface d'administration qui ont été mises à jour pour utiliser le layout corrigé :

- **Dashboard** : `/admin` ou `/admin/index-basic`
- **Gestion des produits** : `/admin/produits`
- **Ajout de produit** : `/admin/produits/nouveau`

## Vérification de l'état de session

Pour vérifier l'état de votre session et les droits d'administration :

1. Accédez à `/admin/index-basic`
2. Votre état de session sera affiché en détail
3. Si vous êtes correctement connecté en tant qu'admin, vous verrez les liens vers toutes les sections du panel administrateur

## Instructions pour un accès garanti

1. Supprimez complètement le dossier `.next` à la racine de votre projet pour effacer le cache
2. Redémarrez le serveur de développement avec `npm run dev`
3. Accédez directement à http://localhost:3000/admin-direct
4. À partir de cette page, essayez d'accéder aux différentes sections du panel

## Besoin d'aide supplémentaire ?

Si vous rencontrez toujours des problèmes d'accès, vous pouvez :

1. Vérifier les erreurs dans la console du navigateur (F12)
2. Vérifier les logs du terminal où vous avez lancé `npm run dev`
3. Essayer un autre navigateur ou une session de navigation privée