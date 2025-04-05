import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function OrderSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { session_id } = router.query;

  // Vide le panier une fois que la commande est terminée
  useEffect(() => {
    if (session_id) {
      clearCart();
    }
  }, [session_id, clearCart]);

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

            {session_id && (
              <motion.div 
                variants={itemVariants}
                className="mb-8 p-4 bg-beige-200 text-primary-700 rounded-sm"
              >
                <p className="font-medium">Référence de commande</p>
                <p className="text-sm">{session_id}</p>
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
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Besoin d'aide ?
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
