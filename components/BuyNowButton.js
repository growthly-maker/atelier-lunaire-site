import { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { getStripe } from '../utils/stripe';

export default function BuyNowButton({ product, selectedOptions, quantity = 1 }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleBuyNow = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const stripe = await getStripe();

      // Calcule le prix en fonction des options
      let itemPrice = product.price;
      
      // Exemple: ajout du prix pour une longueur de chaîne plus longue
      if (selectedOptions && selectedOptions['Longueur de chaîne'] === '45-50cm (+5€)') {
        itemPrice += 5;
      }

      // Prépare l'item pour Stripe
      const item = {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: Object.entries(selectedOptions || {}).map(([k, v]) => `${k}: ${v}`).join(', '),
            images: product.images ? [product.images[0]] : [],
          },
          unit_amount: itemPrice * 100, // Prix en centimes
        },
        quantity: quantity,
      };

      // Appel API pour créer la session Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [item],
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      const session = await response.json();

      // Redirection vers la page de paiement Stripe
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setError(error.message || "Une erreur s'est produite lors du traitement du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBuyNow}
        disabled={isProcessing}
        className={`w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-sm ${isProcessing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-primary-700'} transition-colors flex items-center justify-center`}
      >
        <FiShoppingCart className="mr-2" />
        {isProcessing ? 'Traitement en cours...' : 'Acheter maintenant'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
