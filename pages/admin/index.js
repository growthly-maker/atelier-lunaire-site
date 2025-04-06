import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiBox, FiShoppingBag, FiUsers, FiCreditCard } from 'react-icons/fi';
import AdminLayout from '../../components/admin/Layout';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simuler des données pour la démonstration
  useEffect(() => {
    // Dans un environnement de production, vous feriez un appel API ici
    setTimeout(() => {
      setStats({
        totalProducts: 24,
        totalOrders: 18,
        totalUsers: 42,
        totalRevenue: 2450.75,
        recentOrders: [
          {
            _id: '1',
            orderNumber: 'AL123456',
            user: { name: 'Sophie Martin' },
            status: 'processing',
            totalPrice: 145.90,
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            orderNumber: 'AL123457',
            user: { name: 'Thomas Dubois' },
            status: 'delivered',
            totalPrice: 85.50,
            createdAt: new Date().toISOString(),
          },
        ],
        lowStockProducts: [
          {
            _id: '1',
            name: 'Bracelet Écorce Sauvage',
            category: 'bracelets',
            price: 78.00,
            stock: 2,
          },
          {
            _id: '2',
            name: 'Collier Éclat Céleste',
            category: 'colliers',
            price: 95.00,
            stock: 3,
          },
        ],
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Tableau de bord | Administration Atelier Lunaire</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans l'espace d'administration de votre boutique.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiBox className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Produits</p>
                  <p className="text-xl font-semibold text-gray-800">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FiShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Commandes</p>
                  <p className="text-xl font-semibold text-gray-800">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiUsers className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Utilisateurs</p>
                  <p className="text-xl font-semibold text-gray-800">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FiCreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                  <p className="text-xl font-semibold text-gray-800">{stats.totalRevenue.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Commandes récentes */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Commandes récentes</h2>
              </div>
              <div className="p-4">
                {stats.recentOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N°</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.recentOrders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">#{order.orderNumber}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.user.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {{
                                  pending: 'En attente',
                                  processing: 'En traitement',
                                  shipped: 'Expédiée',
                                  delivered: 'Livrée',
                                  cancelled: 'Annulée'
                                }[order.status]}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.totalPrice.toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
                )}
              </div>
            </div>
            
            {/* Produits en stock faible */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Produits en stock faible</h2>
              </div>
              <div className="p-4">
                {stats.lowStockProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.lowStockProducts.map((product) => (
                          <tr key={product._id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{product.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                              {{
                                'colliers': 'Colliers',
                                'bracelets': 'Bracelets',
                                'bagues': 'Bagues',
                                'boucles-oreilles': 'Boucles d\'oreilles',
                                'autres': 'Autres'
                              }[product.category]}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {product.stock === 0 ? 'Épuisé' : `${product.stock} unités`}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{product.price.toFixed(2)} €</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Tous les produits ont un stock suffisant</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}