import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import CartIcon from './CartIcon';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const userMenuRef = useRef(null);

  // Détectez si nous sommes sur la page Contact ou d'autres pages sans header image
  const isPageWithoutDarkHeader = [
    '/contact',
    '/panier',
    '/commande/success',
    '/mentions-legales',
    '/conditions-generales',
    '/politique-confidentialite',
    '/auth/connexion',
    '/auth/inscription',
    '/compte',
    '/compte/commandes',
    '/compte/parametres',
    '/compte/profil'
  ].includes(router.pathname) || router.pathname.startsWith('/compte/commandes/');

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

  // Gestion du clic en dehors du menu utilisateur pour le fermer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Gérer la déconnexion
  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOut({ redirect: false });
    setShowUserMenu(false);
    router.push('/');
  };

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
          {/* Menu utilisateur connecté ou lien de connexion */}
          {status === 'authenticated' ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center ${isScrolled ? 'text-primary-600' : 'text-white'} hover:opacity-75 transition-opacity`}
              >
                <FiUser className="mr-1" />
                <span className="hidden sm:inline">{session.user.name.split(' ')[0]}</span>
                <FiChevronDown className="ml-1" size={14} />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link 
                    href="/compte" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Tableau de bord
                  </Link>
                  <Link 
                    href="/compte/profil" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mon profil
                  </Link>
                  <Link 
                    href="/compte/commandes" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Mes commandes
                  </Link>
                  <Link 
                    href="/compte/parametres" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Paramètres
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/auth/connexion" 
              className={`flex items-center ${isScrolled ? 'text-primary-600' : 'text-white'} hover:opacity-75 transition-opacity`}
            >
              <FiUser className="mr-1" />
              <span className="hidden sm:inline">Connexion</span>
            </Link>
          )}
          
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
                className="text-primary-700 py-2 border-b border-primary-200"
              >
                Contact
              </Link>
              
              {/* Ajouter les liens de compte utilisateur dans le menu mobile */}
              {status === 'authenticated' ? (
                <>
                  <Link 
                    href="/compte" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-primary-700 py-2 border-b border-primary-200"
                  >
                    Tableau de bord
                  </Link>
                  <Link 
                    href="/compte/profil" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-primary-700 py-2 border-b border-primary-200"
                  >
                    Mon profil
                  </Link>
                  <Link 
                    href="/compte/commandes" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-primary-700 py-2 border-b border-primary-200"
                  >
                    Mes commandes
                  </Link>
                  <Link 
                    href="/compte/parametres" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-primary-700 py-2 border-b border-primary-200"
                  >
                    Paramètres
                  </Link>
                  <button 
                    onClick={(e) => {
                      handleSignOut(e);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-primary-700 py-2 text-left"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/connexion" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-primary-700 py-2"
                >
                  Connexion
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}