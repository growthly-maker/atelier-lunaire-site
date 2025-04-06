import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiLoader, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function OrderSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupérer les détails de la commande
  useEffect(() => {
    // Attendre que router.isReady soit true avant de procéder
    if (!router.isReady) return;

    // Vide le panier une fois que nous sommes sur la page de succès
    clearCart();

    // Si pas de session_id, utiliser un ID de démo pour les tests
    const sessionId = session_id || 'test_session_1';
    
    // Récupère les détails de commande de l'API
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/check-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails de commande');
        }
        
        const data = await response.json();
        if (data.success) {
          setOrderDetails(data);
          setLoading(false);
        } else {
          throw new Error(data.error || 'Erreur lors de la récupération des détails');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de récupérer les détails de votre commande');
        setLoading(false);
      }
    };
    
    // Ajouter un délai pour éviter les problèmes de timing avec l'API Stripe
    const timer = setTimeout(() => {
      fetchOrderDetails();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [router.isReady, session_id, clearCart]);

  // Format d'affichage de la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Contenu à afficher pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100">
        <Header />
        <div className="pt-32 pb-20 px-4 flex items-center justify-center">
          <div className="flex items-center text-primary-600">
            <FiLoader className="animate-spin mr-2" size={20} />
            <span>Chargement des détails de votre commande...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Contenu à afficher en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-beige-100">
        <Header />
        <div className="pt-32 pb-20 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-primary-700 mb-6">Un problème est survenu</h1>
          <p className="text-gray-700 mb-8">{error}</p>
          <Link href="/boutique" className="inline-block px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors">
            Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Commande Confirmée | Atelier Lunaire</title>
        <meta name="description" content="Votre commande de bijoux artisanaux Atelier Lunaire a été confirmée." />
        <meta name="robots" content="noindex, nofollow" /> {/* Ne pas indexer les pages de confirmation */}
      </Head>

      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-8 md:p-12 shadow-sm text-center"
          >
            <motion.div 
              variants={itemVariants} 
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <FiCheck size={40} className="text-primary-600" />
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-serif text-primary-700 mb-4"
            >
              Merci pour votre commande !
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-700 mb-6 max-w-md mx-auto"
            >
              Votre commande a été confirmée et sera préparée avec soin par nos artisans.
            </motion.p>

            {orderDetails && (
              <motion.div 
                variants={itemVariants}
                className="mb-8 p-4 bg-beige-200 text-primary-700 text-left rounded-sm"
              >
                <div className="border-b border-primary-200 pb-3 mb-3">
                  <p className="font-medium">Référence de commande</p>
                  <p className="text-sm">{orderDetails.orderId}</p>
                </div>

                {orderDetails.customer && (
                  <div className="border-b border-primary-200 pb-3 mb-3">
                    <p className="font-medium">Client</p>
                    <p className="text-sm">{orderDetails.customer.name}</p>
                    <p className="text-sm">{orderDetails.customer.email}</p>
                  </div>
                )}

                {orderDetails.shipping && orderDetails.shipping.address && (
                  <div className="border-b border-primary-200 pb-3 mb-3 flex items-start">
                    <FiMapPin className="mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Adresse de livraison</p>
                      <p className="text-sm">{orderDetails.shipping.address.line1}</p>
                      {orderDetails.shipping.address.line2 && (
                        <p className="text-sm">{orderDetails.shipping.address.line2}</p>
                      )}
                      <p className="text-sm">
                        {orderDetails.shipping.address.postal_code} {orderDetails.shipping.address.city}
                      </p>
                      <p className="text-sm">{orderDetails.shipping.address.country}</p>
                    </div>
                  </div>
                )}

                <div className="border-b border-primary-200 pb-3 mb-3 flex items-start">
                  <FiCalendar className="mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Date de commande</p>
                    <p className="text-sm">{formatDate(orderDetails.payment?.created)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiCreditCard className="mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Total payé</p>
                    <p className="text-lg font-medium">{orderDetails.payment?.amount.toFixed(2)} €</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Détails des articles commandés */}
            {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
              <motion.div variants={itemVariants} className="mb-8 text-left">
                <h2 className="text-xl font-serif text-primary-700 mb-4">Articles commandés</h2>
                <div className="divide-y divide-gray-200">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {(item.amount_total / 100).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.p 
              variants={itemVariants}
              className="text-gray-600 mb-10"
            >
              Vous recevrez sous peu un e-mail de confirmation avec tous les détails de votre commande
              et les informations de suivi de livraison.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="space-y-4 md:space-y-0 md:flex md:space-x-4 justify-center"
            >
              <Link
                href="/boutique"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors"
              >
                Continuer le shopping
                <FiArrowRight className="ml-2" />
              </Link>

              <Link
                href="/compte/commandes"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Voir mes commandes
              </Link>
            </motion.div>
          </motion.div>

          <div className="mt-10 text-center text-gray-600">
            <h2 className="text-xl font-serif text-primary-700 mb-4">Et maintenant ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-6 shadow-sm">
                <div className="text-2xl font-serif text-primary-500 mb-2">1</div>
                <h3 className="font-medium mb-2">Artisanat minutieux</h3>
                <p className="text-sm">Votre bijou sera façonné ou préparé avec soin par nos artisans.</p>
              </div>
              
              <div className="bg-white p-6 shadow-sm">
                <div className="text-2xl font-serif text-primary-500 mb-2">2</div>
                <h3 className="font-medium mb-2">Expédition avec attention</h3>
                <p className="text-sm">Emballé dans notre écrin signature et expédié avec soin.</p>
              </div>
              
              <div className="bg-white p-6 shadow-sm">
                <div className="text-2xl font-serif text-primary-500 mb-2">3</div>
                <h3 className="font-medium mb-2">Le plaisir de recevoir</h3>
                <p className="text-sm">Votre précieux bijou vous parviendra dans les jours à venir.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
