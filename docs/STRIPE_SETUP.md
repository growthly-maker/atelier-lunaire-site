# Configuration de Stripe pour Atelier Lunaire

Ce document explique comment configurer Stripe correctement pour votre site e-commerce Atelier Lunaire.

## 1. Créer un compte Stripe

1. Inscrivez-vous sur [Stripe](https://dashboard.stripe.com/register)
2. Complétez votre profil d'entreprise

## 2. Obtenir vos clés API

1. Allez dans le [Dashboard Stripe](https://dashboard.stripe.com/apikeys)
2. Vous verrez deux types de clés : Clé publiable (pk_) et Clé secrète (sk_)
   - En mode développement, vous utiliserez les clés de test (commencant par pk_test_ et sk_test_)
   - En production, vous utiliserez les clés de production (commencant par pk_live_ et sk_live_)

## 3. Configurer les webhooks

1. Allez dans la section [Webhooks de Stripe](https://dashboard.stripe.com/webhooks)
2. Cliquez sur "Ajouter un endpoint"
3. Pour le développement local, vous aurez besoin de Stripe CLI ou d'un outil comme ngrok
   - Téléchargez [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - Utilisez `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Pour la production, entrez l'URL de votre endpoint (ex: https://votresite.com/api/webhooks/stripe)
5. Sélectionnez les événements à écouter (au minimum : checkout.session.completed)
6. Notez le secret du webhook (commencant par whsec_)

## 4. Configuration dans votre application

1. Copiez le fichier `.env.local.example` en `.env.local`
2. Remplissez les variables :

```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_... (même valeur que STRIPE_PUBLIC_KEY)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000 (en développement) ou https://votresite.com (en production)
```

## 5. Test du paiement

Utilisez ces cartes de test pour vérifier que tout fonctionne :

| Type de carte | Numéro | Date | CVC | Code postal |
|--------------|------------|------|-----|------------|
| Visa (succès) | 4242 4242 4242 4242 | Toute date future | Tout | Tout |
| Mastercard (succès) | 5555 5555 5555 4444 | Toute date future | Tout | Tout |
| Visa (refusée) | 4000 0000 0000 0002 | Toute date future | Tout | Tout |
| 3D Secure | 4000 0000 0000 3220 | Toute date future | Tout | Tout |

## 6. Passage en production

Quand vous êtes prêt à passer en production :

1. Complétez toutes les informations d'entreprise dans Stripe
2. Activez le mode production dans Stripe
3. Remplacez vos clés de test par les clés de production
4. Mettez à jour les webhooks pour pointer vers votre URL de production
5. Testez un achat réel pour vérifier que tout fonctionne

## 7. Gestion des erreurs courantes

Problèmes courants et solutions :

- **Erreur "No API key provided"** : Vérifiez que STRIPE_SECRET_KEY est correctement configuré
- **Erreur "Invalid API key provided"** : Vérifiez que la clé API est correcte
- **Erreur webhook "No signatures found matching the expected signature"** : Vérifiez STRIPE_WEBHOOK_SECRET
- **La redirection après paiement ne fonctionne pas** : Vérifiez NEXT_PUBLIC_APP_URL

## 8. Ressources utiles

- [Documentation Stripe](https://stripe.com/docs)
- [Guide d'intégration Stripe avec Next.js](https://stripe.com/docs/checkout/integration-builder)
- [Exemples de code pour Next.js](https://github.com/stripe-samples/accept-a-payment/tree/main/prebuilt-checkout-page/server/node-nextjs)
