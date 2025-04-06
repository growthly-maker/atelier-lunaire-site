import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/Layout';

// Données de démonstration
const demoProducts = [
  {
    _id: '1',
    name: 'Collier Éclat Céleste',
    description: "Collier fin orné d'un pendentif en pierre de lune, symbole de féminité et d'intuition.",
    price: 95,
    images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236"],
    category: 'colliers',
    stock: 8,
    isNew: true
  },
  {
    _id: '2',
    name: 'Bague Murmure Doré',
    description: "Bague ajustable en laiton doré ornée de motifs floraux délicatement ciselés à la main.",
    price: 65,
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d"],
    category: 'bagues',
    stock: 12,
    isNew: false
  },
  {
    _id: '3',
    name: 'Bracelet Écorce Sauvage',
    description: "Bracelet en argent texturé imitant l'écorce d'arbre, orné de petits éclats de turquoise brute.",
    price: 78,
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0"],
    category: 'bracelets',
    stock: 3,
    isNew: false
  },
  {
    _id: '4',
    name: "Boucles d'Oreilles Goutte de Lune",
    description: "Boucles d'oreilles en argent 925 ornées de perles en pierre de lune.",
    price: 68,
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59"],
    category: 'boucles-oreilles',
    stock: 0,
    isNew: false
  }
];

export default function AdminProducts() {
  const [products] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filtrer les produits en fonction des critères
  const filteredProducts = products.filter(product => {
    // Filtrer par catégorie
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    
    // Filtrer par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    // Fonction fictive pour démonstration
    console.log(`Suppression du produit ${productToDelete?.name}`);
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };
  
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };
  
  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'colliers', label: 'Colliers' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'bagues', label: 'Bagues' },
    { value: 'boucles-oreilles', label: 'Boucles d\'oreilles' },
    { value: 'autres', label: 'Autres' },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Gestion des produits | Administration Atelier Lunaire</title>
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-gray-800">Gestion des produits</h1>
        <Link 
          href="/admin/produits/nouveau"
          className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filtres et recherche */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 relative overflow-hidden rounded-md">
                          {product.images && product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{
                        'colliers': 'Colliers',
                        'bracelets': 'Bracelets',
                        'bagues': 'Bagues',
                        'boucles-oreilles': 'Boucles d\'oreilles',
                        'autres': 'Autres'
                      }[product.category]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price.toFixed(2)} €</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 10 ? 'En stock' : 
                         product.stock > 0 ? 'Stock faible' : 
                         'Épuisé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/produit/${product._id}`}
                          className="text-gray-500 hover:text-gray-700"
                          title="Voir"
                        >
                          <FiEye size={18} />
                        </Link>
                        <Link 
                          href={`/admin/produits/${product._id}`}
                          className="text-blue-500 hover:text-blue-700"
                          title="Modifier"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={cancelDelete}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Supprimer le produit</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ? Cette action est irréversible et supprimera définitivement ce produit de votre boutique.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelDelete}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}