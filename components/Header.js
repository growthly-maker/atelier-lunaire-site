import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingBag, FiSearch, FiUser } from 'react-icons/fi';
import CartIcon from './CartIcon';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Détectez si nous sommes sur une page sans header image
  const isPageWithoutDarkHeader = [
    '/contact',
    '/panier',
    '/commande/success',
    '/mentions-legales',
    '/conditions-generales',
    '/politique-confidentialite'
  ].includes(router.pathname);

  // Initialisation de l'état isScrolled en fonction de la page
  useEffect(() => {
    // Si on est sur la page contact, on force le header en mode clair
    if (isPageWithoutDarkHeader) {
      setIsScrolled(true);
    } else {
      // Autrement, on dépend du scroll
      const handleScroll = () => {
        if (window.scrollY > 10) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      // Vérification initiale du scroll
      handleScroll();

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isPageWithoutDarkHeader]);

  // Animation pour le header
  const headerVariants = {
    initial: { y: -100 },
    animate: { y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  // Animation pour les liens de navigation
  const navItemVariants = {
    hover: { y: -3, transition: { duration: 0.3 } }
  };

  return (
    <motion.header 
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-soft py-3' : 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className={`font-serif text-3xl font-bold ${isScrolled ? 'text-primary-700' : 'text-white'} transition-colors duration-300`}>
          <span className="text-secondary-500">L</span>unaire
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex space-x-8">
          {['Accueil', 'Boutique', 'Notre Histoire', 'Contact'].map((item, i) => {
            const path = item === 'Accueil' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
            return (
              <motion.div key={i} whileHover="hover" className="relative group">
                <motion.div variants={navItemVariants}>
                  <Link 
                    href={path} 
                    className={`${isScrolled ? 'text-neutral-700' : 'text-white'} hover:text-primary-500 py-2 transition-colors duration-300 font-medium`}
                  >
                    {item}
                  </Link>
                </motion.div>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300 ${router.pathname === path ? 'w-full' : ''}`}></span>
              </motion.div>
            );
          })}
        </nav>

        {/* Icons navigation */}
        <div className="flex items-center space-x-5">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.97 }}>
            <Link href="/recherche" className={`${isScrolled ? 'text-neutral-700' : 'text-white'} hover:text-primary-500 transition-colors`}>
              <FiSearch size={20} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.97 }}>
            <Link href="/compte" className={`${isScrolled ? 'text-neutral-700' : 'text-white'} hover:text-primary-500 transition-colors`}>
              <FiUser size={20} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.97 }}>
            <CartIcon className={isScrolled ? 'text-neutral-700 hover:text-primary-500' : 'text-white hover:text-primary-300'} />
          </motion.div>
          
          {/* Bouton menu mobile */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.97 }}
            className={`md:hidden ${isScrolled ? 'text-neutral-700' : 'text-white'} hover:text-primary-500 focus:outline-none transition-colors`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="md:hidden bg-white shadow-lg absolute w-full overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
              {['Accueil', 'Boutique', 'Notre Histoire', 'Contact'].map((item, i) => {
                const path = item === 'Accueil' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block text-lg py-2 border-b border-neutral-100 text-neutral-800 ${router.pathname === path ? 'text-primary-500 font-medium' : ''}`}
                    >
                      {item}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 flex space-x-4"
              >
                <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">Instagram</a>
                <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">Pinterest</a>
                <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">Facebook</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}