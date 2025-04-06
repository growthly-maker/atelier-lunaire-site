import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getStripe } from '../utils/stripe';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState('');

  // Fonction pour faire le checkout avec Stripe
  const handleCheckout = async () => {
    setIsProcessing(true);
    setProcessingError('');

    try {
      const stripe = await getStripe();

      // Prépare les items pour Stripe
      const stripeItems = cartItems.map(item => {
        // Calcule le prix en centimes (Stripe utilise les plus petites unités monétaires)
        let itemPrice = item.price;
        
        // Ajuste le prix si des options le nécessitent
        if (item.selectedOptions && item.selectedOptions['Longueur de chaîne'] === '45-50cm (+5€)') {
          itemPrice += 5;
        }

        // Générer une description valide non vide
        let description = "";
        if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
          description = Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ');
        }
        
        // S'assurer que la description n'est jamais vide
        if (!description || description.trim() === '') {
          description = "Produit Atelier Lunaire";
        }
        
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              description: description,
              images: item.images && item.images.length > 0 ? [item.images[0]] : [],
            },
            unit_amount: itemPrice * 100, // Prix en centimes
          },
          quantity: item.quantity,
        };
      });

      // Appel API pour créer la session Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: stripeItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Erreur lors de la création de la session de paiement');
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
      setProcessingError(error.message || "Une erreur s'est produite lors du traitement du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Animation pour la liste
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Votre Panier | Atelier Lunaire</title>
        <meta name="description" content="Votre panier - Finalisez votre commande de bijoux artisanaux Atelier Lunaire." />
      </Head>

      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/boutique" className="inline-flex items-center text-primary-600 hover:text-primary-700">
              <FiArrowLeft className="mr-2" />
              Continuer mes achats
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-primary-700 mb-8">Votre Panier</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-sm shadow-sm">
              <p className="text-gray-600 mb-6">Votre panier est vide.</p>
              <Link 
                href="/boutique"
                className="inline-block px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Découvrir nos bijoux
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des produits */}
              <div className="lg:col-span-2">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${Object.values(item.selectedOptions || {}).join('-')}`}
                      variants={itemVariants}
                      className="bg-white p-4 flex items-center shadow-sm"
                    >
                      {/* Image du produit */}
                      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100">
                        {item.images && item.images.length > 0 && (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </div>

                      {/* Détails du produit */}
                      <div className="ml-4 flex-grow">
                        <h3 className="text-lg font-medium text-primary-800">{item.name}</h3>
                        
                        {/* Options sélectionnées */}
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {Object.entries(item.selectedOptions).map(([key, value]) => (
                              <span key={key}>{key}: {value}</span>
                            )).reduce((prev, curr) => [prev, ' | ', curr])}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-gray-700">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border border-gray-300 text-gray-600"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-primary-600">
                              {/* Calcule le prix en fonction des options */}
                              {(() => {
                                let itemPrice = item.price;
                                
                                // Ajuste le prix si des options le nécessitent
                                if (item.selectedOptions && item.selectedOptions['Longueur de chaîne'] === '45-50cm (+5€)') {
                                  itemPrice += 5;
                                }
                                
                                return `${itemPrice} €`;
                              })()} × {item.quantity}
                            </span>
                            
                            <button 
                              onClick={() => removeFromCart(index)}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                              aria-label="Retirer du panier"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Résumé de la commande */}
              <div className="bg-white p-6 shadow-sm h-fit">
                <h2 className="text-xl font-serif text-primary-700 mb-4 pb-4 border-b border-gray-200">
                  Résumé de la commande
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{cartTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frais de livraison</span>
                    <span>Gratuit</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-700">{cartTotal.toFixed(2)} €</span>
                  </div>
                </div>
                
                {processingError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                    {processingError}
                  </div>
                )}
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-3 text-white font-medium ${isProcessing ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} transition-colors`}
                >
                  {isProcessing ? 'Traitement en cours...' : 'Procéder au paiement'}
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Paiement sécurisé via Stripe</p>
                  <p className="mt-2">Nous acceptons Visa, Mastercard, et American Express</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}