import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { ShoppingBagIcon, UserIcon, CogIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Account() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/connexion?callbackUrl=/compte');
    }
  }, [status, router]);
  
  // Récupérer les commandes récentes
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchOrders = async () => {
        try {
          const response = await fetch('/api/account/orders');
          
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des commandes');
          }
          
          const data = await response.json();
          setOrders(data.data.slice(0, 3)); // Prendre seulement les 3 plus récentes
          setIsLoading(false);
        } catch (err) {
          console.error('Erreur:', err);
          setError('Impossible de récupérer vos commandes. Veuillez réessayer plus tard.');
          setIsLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [status]);
  
  // Afficher le chargement
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Afficher le tableau de bord quand l'utilisateur est connecté
  if (status === 'authenticated') {
    return (
      <Layout>
        <Head>
          <title>Mon compte | Atelier Lunaire</title>
          <meta name="description" content="Gérez votre compte et suivez vos commandes chez Atelier Lunaire" />
        </Head>
        
        <div className="container mx-auto px-4 py-8 mb-12">
          <h1 className="text-3xl font-semibold mb-6">Mon compte</h1>
          
          {/* Carte de bienvenue */}
          <div className="bg-primary-50 p-6 rounded-lg shadow-sm mb-8 flex flex-col sm:flex-row justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-medium">Bonjour, {session.user.name}</h2>
              <p className="text-gray-600 mt-2">Bienvenue sur votre espace personnel. Vous pouvez gérer vos commandes, adresses et informations personnelles.</p>
            </div>
            <Link 
              href="/compte/profil" 
              className="self-start sm:self-center inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Voir mon profil
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {/* Sections principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Mes commandes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start mb-4">
                <ShoppingBagIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium">Mes commandes</h3>
                  <p className="text-gray-600 text-sm">Suivez et gérez vos achats</p>
                </div>
              </div>
              <Link href="/compte/commandes" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
                Voir toutes mes commandes
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {/* Mon profil */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start mb-4">
                <UserIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium">Mon profil</h3>
                  <p className="text-gray-600 text-sm">Consultez vos informations personnelles</p>
                </div>
              </div>
              <Link href="/compte/profil" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
                Voir mon profil
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {/* Paramètres */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start mb-4">
                <CogIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium">Paramètres</h3>
                  <p className="text-gray-600 text-sm">Modifiez vos préférences</p>
                </div>
              </div>
              <Link href="/compte/parametres" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
                Gérer mes paramètres
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Commandes récentes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium mb-4">Commandes récentes</h2>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
                {error}
              </div>
            )}
            
            {!error && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Détails</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${order.orderStatus === 'livrée' ? 'bg-green-100 text-green-800' : ''}
                            ${order.orderStatus === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.orderStatus === 'confirmée' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.orderStatus === 'préparation' ? 'bg-indigo-100 text-indigo-800' : ''}
                            ${order.orderStatus === 'expédiée' ? 'bg-purple-100 text-purple-800' : ''}
                            ${order.orderStatus === 'annulée' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.total.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/compte/commandes/${order._id}`} className="text-primary-600 hover:text-primary-900">
                            Détails
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                {!error && (
                  <>
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore de commandes.</p>
                    <Link href="/boutique" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      Découvrir nos produits
                    </Link>
                  </>
                )}
              </div>
            )}
            
            {!error && orders.length > 0 && (
              <div className="mt-4 text-right">
                <Link href="/compte/commandes" className="text-primary-600 hover:text-primary-700 inline-flex items-center text-sm font-medium">
                  Voir toutes mes commandes
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }
  
  // Par défaut, retourner null (ne devrait jamais être atteint)
  return null;
}