// pages/contact.js
import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiInstagram, FiSend } from 'react-icons/fi';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Simuler un envoi de formulaire
    try {
      // Ici, dans un vrai site, on enverrait les données à une API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer ultérieurement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Contact | Atelier Lunaire - Bijoux Bohème-Chic Artisanaux</title>
        <meta name="description" content="Contactez Atelier Lunaire pour toute question sur nos bijoux artisanaux, commandes spéciales ou collaboration." />
      </Head>

      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-primary-700 mb-4">Contactez-nous</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Une question, une commande spéciale ou simplement envie d'échanger ? 
              Nous serions ravis d'avoir de vos nouvelles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="bg-white p-6 md:p-8 shadow-sm"
            >
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                    <FiSend size={28} />
                  </div>
                  <h2 className="text-2xl font-serif text-primary-700 mb-4">Message envoyé !</h2>
                  <p className="text-gray-700 mb-6">
                    Merci de nous avoir contactés. Nous vous répondrons dans les meilleurs délais.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif text-primary-700 mb-6">Écrivez-nous</h2>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                        Sujet
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-3 ${
                        isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                      } text-white transition-colors flex items-center justify-center`}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
            
            {/* Informations de contact */}
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <div className="bg-primary-50 p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-serif text-primary-700 mb-6">Nous Contacter</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                      <FiMail size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-700 mb-1">Email</h3>
                      <p className="text-gray-700">contact@atelierlunaire.com</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Nous vous répondons dans un délai de 24 à 48h, du lundi au vendredi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                      <FiMapPin size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-700 mb-1">Atelier</h3>
                      <p className="text-gray-700">
                        12 Rue des Artisans<br />
                        13100 Aix-en-Provence<br />
                        France
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Visites sur rendez-vous uniquement.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
                      <FiInstagram size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-700 mb-1">Instagram</h3>
                      <p className="text-gray-700">@atelierlunaire</p>
                      <p className="text-gray-600 text-sm mt-1">
                        Suivez-nous pour découvrir nos coulisses et dernières créations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-primary-700 mb-6">FAQ</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-primary-700 mb-2">Proposez-vous des commandes personnalisées ?</h3>
                    <p className="text-gray-700">
                      Oui, nous réalisons des bijoux sur-mesure. Contactez-nous avec votre idée, et nous étudierons ensemble sa faisabilité.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-primary-700 mb-2">Quel est le délai de livraison ?</h3>
                    <p className="text-gray-700">
                      Pour les pièces en stock, l'expédition se fait sous 2-3 jours ouvrés. Pour les commandes personnalisées, le délai varie entre 1 et 3 semaines selon la complexité.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-primary-700 mb-2">Peut-on visiter votre atelier ?</h3>
                    <p className="text-gray-700">
                      Notre atelier est ouvert aux visites sur rendez-vous uniquement. N'hésitez pas à nous contacter pour organiser votre venue.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}