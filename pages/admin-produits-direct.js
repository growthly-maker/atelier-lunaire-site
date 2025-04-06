import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiHome } from 'react-icons/fi';

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

export default function AdminProductsDirect() {
  const [products] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  
  const categoryOptions = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'colliers', label: 'Colliers' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'bagues', label: 'Bagues' },
    { value: 'boucles-oreilles', label: 'Boucles d\'oreilles' },
    { value: 'autres', label: 'Autres' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Gestion des produits (Direct) | Administration Atelier Lunaire</title>
      </Head>
      
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
        <div className="flex-1 flex items-center justify-between px-4">
          <div className="font-bold text-lg">Atelier Lunaire - Gestion des produits (Accès direct)</div>
          <div>
            <Link href="/admin-override" className="mr-4 text-primary-600 hover:text-primary-800">
              <FiHome className="inline mr-1" /> Dashboard
            </Link>
            <span className="text-sm text-red-600">
              Mode d'accès d'urgence
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif text-gray-800">Gestion des produits</h1>
          <Link 
            href="/admin-nouveau-produit-direct"
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
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-100 rounded-md relative overflow-hidden">
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
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
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            title="Modifier"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
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
        
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Cette interface est simplifiée et ne permet pas d'enregistrer les modifications en base de données. Elle est fournie à des fins de visualisation uniquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}