import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CartIcon from './CartIcon';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Détectez si nous sommes sur la page Contact ou d'autres pages sans header image
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

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-beige-100 shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className={`font-serif text-2xl ${isScrolled ? 'text-primary-700' : 'text-white'}`}>
          Atelier Lunaire
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={`${isScrolled ? 'text-primary-600' : 'text-white'} hover:opacity-75 transition-opacity`}>
            Accueil
          </Link>
          <Link href="/boutique" className={`${isScrolled ? 'text-primary-600' : 'text-white'} hover:opacity-75 transition-opacity`}>
            Boutique
          </Link>
          <Link href="/a-propos" className={`${isScrolled ? 'text-primary-600' : 'text-white'} hover:opacity-75 transition-opacity`}>
            Notre Histoire
          </Link>
          <Link href="/contact" className={`${isScrolled ? 'text-primary-600' : 'text-white'} hover:opacity-75 transition-opacity`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <CartIcon className={isScrolled ? 'text-primary-700' : 'text-white'} />
          
          <button 
            className={`md:hidden ${isScrolled ? 'text-primary-700' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-beige-100 absolute w-full"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-700 py-2 border-b border-primary-200"
              >
                Accueil
              </Link>
              <Link 
                href="/boutique" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-700 py-2 border-b border-primary-200"
              >
                Boutique
              </Link>
              <Link 
                href="/a-propos" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-700 py-2 border-b border-primary-200"
              >
                Notre Histoire
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-700 py-2"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}