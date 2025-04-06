import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiUser, FiHeart } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Gestionnaire de défilement pour l'effet du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Vérifier la position initiale
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fonction pour basculer le menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Fonction pour basculer le menu utilisateur
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  // Fonction pour se déconnecter
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };
  
  // Navigation principale
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Boutique', href: '/boutique' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-30 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl text-primary-800">
          Atelier Lunaire
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={`text-sm ${router.pathname === item.href ? 'text-primary-700 font-medium' : 'text-gray-700 hover:text-primary-600'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Icônes de droite */}
        <div className="flex items-center space-x-4">
          {/* Icon de recherche */}
          <Link href="/recherche" className="text-gray-700 hover:text-primary-600">
            <FiSearch size={20} />
          </Link>
          
          {/* Icône du panier */}
          <Link href="/panier" className="relative text-gray-700 hover:text-primary-600">
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* Icône utilisateur avec menu */}
          <div className="relative">
            <button 
              onClick={toggleUserMenu}
              className="text-gray-700 hover:text-primary-600 flex items-center"
            >
              <FiUser size={20} />
            </button>
            
            {/* Menu utilisateur */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                      </div>
                      <Link 
                        href="/mon-compte"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mon compte
                      </Link>
                      <Link 
                        href="/mon-compte/commandes"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mes commandes
                      </Link>
                      <Link 
                        href="/mon-compte/favoris"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mes favoris
                      </Link>
                      {session.user.isAdmin && (
                        <Link 
                          href="/admin"
                          className="block px-4 py-2 text-sm text-primary-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Administration
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/auth/connexion"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Connexion
                      </Link>
                      <Link 
                        href="/auth/inscription"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Inscription
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Bouton du menu mobile */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-primary-600"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-3">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`block py-2 ${router.pathname === item.href ? 'text-primary-700 font-medium' : 'text-gray-700'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {session && (
                <div className="pt-3 border-t border-gray-200">
                  <Link 
                    href="/mon-compte"
                    className="block py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Mon compte
                  </Link>
                  <Link 
                    href="/mon-compte/commandes"
                    className="block py-2 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Mes commandes
                  </Link>
                  {session.user.isAdmin && (
                    <Link 
                      href="/admin"
                      className="block py-2 text-primary-700 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Administration
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}