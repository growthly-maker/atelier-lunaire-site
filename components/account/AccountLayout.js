import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';

export default function AccountLayout({ children }) {
  const router = useRouter();
  const currentPath = router.pathname;

  // Fonction pour vérifier si un lien est actif
  const isActive = (path) => {
    if (path === '/compte' && currentPath === '/compte') {
      return true;
    }
    if (path !== '/compte' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Fonction pour se déconnecter
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar de navigation */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-primary-700 mb-4">Mon Compte</h2>
            
            <nav className="space-y-1">
              <Link href="/compte" 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-sm ${isActive('/compte') && !isActive('/compte/commandes') && !isActive('/compte/liste-souhaits') && !isActive('/compte/parametres') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiUser className="mr-3 flex-shrink-0" />
                Tableau de bord
              </Link>
              
              <Link href="/compte/commandes" 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-sm ${isActive('/compte/commandes') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiShoppingBag className="mr-3 flex-shrink-0" />
                Mes commandes
              </Link>
              
              <Link href="/compte/liste-souhaits" 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-sm ${isActive('/compte/liste-souhaits') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiHeart className="mr-3 flex-shrink-0" />
                Liste de souhaits
              </Link>
              
              <Link href="/compte/parametres" 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-sm ${isActive('/compte/parametres') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiSettings className="mr-3 flex-shrink-0" />
                Paramètres
              </Link>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm"
              >
                <FiLogOut className="mr-3 flex-shrink-0" />
                Déconnexion
              </button>
            </nav>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}