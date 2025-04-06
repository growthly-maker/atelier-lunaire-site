import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { FiHome, FiBox, FiUsers, FiShoppingBag, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

// Layout admin corrigé
export default function FixedAdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: FiHome },
    { name: 'Produits', href: '/admin/produits', icon: FiBox },
    { name: 'Commandes', href: '/admin/commandes', icon: FiShoppingBag },
    { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: FiUsers },
    { name: 'Paramètres', href: '/admin/parametres', icon: FiSettings },
  ];
  
  // Si l'utilisateur n'est pas encore chargé
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté ou n'est pas administrateur
  // Note: cette vérification est faite ici mais aussi dans le middleware pour plus de sécurité
  if (status === 'unauthenticated') {
    // Redirection client-side
    router.push('/auth/connexion?callbackUrl=/admin');
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
        <p className="mb-6">Vous devez être connecté en tant qu'administrateur pour accéder à cette page.</p>
        <Link 
          href="/auth/connexion?callbackUrl=/admin" 
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  // Si connecté mais pas admin
  if (session && !session.user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
        <p className="mb-6">Votre compte n'a pas les privilèges d'administration nécessaires.</p>
        <Link 
          href="/" 
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar mobile */}
      <div className="lg:hidden">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 transition-opacity"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar */}
        <div 
          className={`
            fixed inset-y-0 left-0 flex flex-col w-64 bg-primary-800 text-white transform transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
            <h2 className="text-xl font-serif">Admin</h2>
            <button onClick={toggleSidebar} className="text-white">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-md text-sm font-medium
                    ${isActive 
                      ? 'bg-primary-700 text-white' 
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'}
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t border-primary-700">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white rounded-md"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-primary-800 lg:text-white">
        <div className="flex items-center h-16 px-4 border-b border-primary-700">
          <h2 className="text-xl font-serif">Atelier Lunaire Admin</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-md text-sm font-medium
                  ${isActive 
                    ? 'bg-primary-700 text-white' 
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'}
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-primary-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white rounded-md"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
          <button 
            onClick={toggleSidebar}
            className="px-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex-1 flex items-center justify-between px-4">
            <div></div>
            <div className="flex items-center">
              {session?.user?.name && (
                <div className="text-sm text-gray-700">
                  Connecté en tant que <span className="font-medium">{session.user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}