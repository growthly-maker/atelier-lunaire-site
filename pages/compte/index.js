import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiClock } from 'react-icons/fi';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AccountLayout from '../../components/account/AccountLayout';

// Fetcher pour SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Une erreur est survenue lors du chargement des données');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default function Account() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Rediriger si non connecté
  if (status === 'unauthenticated') {
    router.push('/auth/connexion?callbackUrl=/compte');
    return null;
  }
  
  // Charger les dernières commandes
  const { data: recentOrders, error: ordersError } = useSWR(
    status === 'authenticated' ? '/api/account/recent-orders' : null,
    fetcher
  );
  
  // État de chargement
  const isLoading = status === 'loading' || (status === 'authenticated' && !recentOrders && !ordersError);

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Mon Compte | Atelier Lunaire</title>
        <meta name="description" content="Gérez votre compte et suivez vos commandes sur Atelier Lunaire." />
      </Head>

      <Header />

      <main className="pt-32 pb-20 px-4">
        <AccountLayout>
          <div className="bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-serif text-primary-700 mb-6">Bienvenue {session?.user?.name}</h1>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Aperçu du compte</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-beige-50 p-4 rounded-sm">
                  <div className="flex items-center mb-2">
                    <FiShoppingBag className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Commandes</h3>
                  </div>
                  <p className="text-gray-600">
                    {isLoading 
                      ? 'Chargement...' 
                      : ordersError 
                        ? 'Erreur de chargement' 
                        : `${recentOrders?.total || 0} commande(s)`
                    }
                  </p>
                </div>
                
                <div className="bg-beige-50 p-4 rounded-sm">
                  <div className="flex items-center mb-2">
                    <FiClock className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Dernière commande</h3>
                  </div>
                  <p className="text-gray-600">
                    {isLoading 
                      ? 'Chargement...' 
                      : ordersError || !recentOrders?.orders?.[0]
                        ? 'Aucune commande' 
                        : new Date(recentOrders.orders[0].createdAt).toLocaleDateString('fr-FR')
                    }
                  </p>
                </div>
                
                <div className="bg-beige-50 p-4 rounded-sm">
                  <div className="flex items-center mb-2">
                    <FiHeart className="text-primary-600 mr-2" />
                    <h3 className="font-medium">Liste de souhaits</h3>
                  </div>
                  <p className="text-gray-600">Fonctionnalité à venir</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Commandes récentes</h2>
              {isLoading ? (
                <p className="text-gray-600">Chargement des commandes...</p>
              ) : ordersError ? (
                <p className="text-red-600">Erreur lors du chargement des commandes</p>
              ) : recentOrders?.orders?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.orders.map((order) => (
                        <tr key={order._id}>
                          <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.substring(order._id.length - 6)}</td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.orderStatus === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                              order.orderStatus === 'confirmée' ? 'bg-blue-100 text-blue-800' :
                              order.orderStatus === 'préparation' ? 'bg-indigo-100 text-indigo-800' :
                              order.orderStatus === 'expédiée' ? 'bg-purple-100 text-purple-800' :
                              order.orderStatus === 'livrée' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} €</td>
                          <td className="py-4 px-4 whitespace-nowrap text-sm">
                            <Link href={`/compte/commandes/${order._id}`} className="text-primary-600 hover:text-primary-700">
                              Voir détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Vous n'avez pas encore de commande.</p>
              )}
              
              {recentOrders?.orders?.length > 0 && (
                <div className="mt-4 text-right">
                  <Link href="/compte/commandes" className="text-primary-600 hover:text-primary-700">
                    Voir toutes mes commandes
                  </Link>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Informations personnelles</h2>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700">Coordonnées</h3>
                <p className="text-gray-600 mt-1">
                  {session?.user?.name}<br />
                  {session?.user?.email}
                </p>
              </div>
              
              <Link 
                href="/compte/parametres"
                className="inline-block text-primary-600 hover:text-primary-700 hover:underline"
              >
                Modifier mes informations
              </Link>
            </div>
          </div>
        </AccountLayout>
      </main>

      <Footer />
    </div>
  );
}