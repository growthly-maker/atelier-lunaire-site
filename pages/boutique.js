// pages/boutique.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';

// Données fictives des produits
const products = [
  {
    id: 1,
    name: "Collier Éclat Céleste",
    description: "Collier fin orné d'un pendentif en pierre de lune, symbole de féminité et d'intuition.",
    price: 95,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236",
    category: "colliers",
    isNew: true
  },
  {
    id: 2,
    name: "Bague Murmure Doré",
    description: "Bague ajustable en laiton doré ornée de motifs floraux délicatement ciselés à la main.",
    price: 65,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
    category: "bagues",
    isNew: false
  },
  {
    id: 3,
    name: "Bracelet Écorce Sauvage",
    description: "Bracelet en argent texturé imitant l'écorce d'arbre, orné de petits éclats de turquoise brute.",
    price: 78,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0",
    category: "bracelets",
    isNew: false
  },
  {
    id: 4,
    name: "Boucles d'Oreilles Goutte de Lune",
    description: "Élégantes boucles d'oreilles en argent 925 ornées de perles en pierre de lune.",
    price: 68,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59",
    category: "boucles-oreilles",
    isNew: false
  },
  {
    id: 5,
    name: "Collier Cascade Stellaire",
    description: "Collier multi-rangs avec pendentifs en laiton doré à l'or fin et petites perles de verre.",
    price: 110,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e",
    category: "colliers",
    isNew: true
  },
  {
    id: 6,
    name: "Bague Écume Argentée",
    description: "Bague en argent au design organique évoquant l'écume des vagues sur le sable.",
    price: 72,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    category: "bagues",
    isNew: false
  },
  {
    id: 7,
    name: "Bracelet Solstice d'Été",
    description: "Bracelet jonc semi-ouvert en laiton doré avec embouts ornés de perles en amazonite.",
    price: 85,
    image: "https://images.unsplash.com/photo-1611591437281-460bdb49ff5c",
    category: "bracelets",
    isNew: true
  },
  {
    id: 8,
    name: "Boucles d'Oreilles Étoile Filante",
    description: "Longues boucles d'oreilles minimalistes avec chaîne fine et petit pendentif étoile.",
    price: 58,
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584",
    category: "boucles-oreilles",
    isNew: false
  }
];

export default function Boutique() {
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const categories = [
    { id: 'tous', label: 'Tous les bijoux' },
    { id: 'colliers', label: 'Colliers' },
    { id: 'bracelets', label: 'Bracelets' },
    { id: 'bagues', label: 'Bagues' },
    { id: 'boucles-oreilles', label: 'Boucles d\'oreilles' },
    { id: 'nouveautes', label: 'Nouveautés' }
  ];
  
  const filteredProducts = selectedCategory === 'tous' 
    ? products 
    : selectedCategory === 'nouveautes'
      ? products.filter(product => product.isNew)
      : products.filter(product => product.category === selectedCategory);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Boutique | Atelier Lunaire - Bijoux Bohème-Chic Artisanaux</title>
        <meta name="description" content="Découvrez notre collection de bijoux bohème-chic artisanaux. Pièces uniques fabriquées à la main avec des matériaux naturels et précieux." />
      </Head>

      <Header />

      {/* Bannière */}
      <div className="relative pt-20 h-[30vh] bg-primary-800 flex items-center justify-center text-center">
        <div className="px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Notre Collection</h1>
          <p className="text-beige-100 text-lg max-w-xl mx-auto">
            Chaque pièce raconte une histoire, façonnée à la main avec attention et poésie
          </p>
        </div>
      </div>

      <main className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Bouton filtre mobile */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 border border-primary-300 text-primary-700 rounded-sm"
          >
            <FiFilter className="mr-2" />
            Filtrer par catégorie
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <h2 className="text-xl font-serif mb-4 text-primary-700">Catégories</h2>
            <nav>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left px-3 py-2 transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-primary-100 text-primary-700 font-medium' 
                          : 'text-gray-600 hover:bg-primary-50'
                      }`}
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Filtre mobile */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-100%' }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-white md:hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif text-primary-700">Catégories</h2>
                    <button 
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category.id}>
                        <button
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setIsFilterOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-3 transition-colors ${
                            selectedCategory === category.id 
                              ? 'bg-primary-100 text-primary-700 font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          {category.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Produits */}
          <div className="flex-1">
            <h2 className="text-2xl font-serif mb-6 text-primary-700 md:hidden">
              {categories.find(cat => cat.id === selectedCategory)?.label || 'Tous les bijoux'}
            </h2>
            
            {filteredProducts.length === 0 ? (
              <p className="text-center py-10 text-gray-500">
                Aucun produit ne correspond à cette catégorie pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="group"
                  >
                    <Link href={`/produit/${product.id}`} className="block">
                      <div className="relative h-80 mb-4 overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.isNew && (
                          <span className="absolute top-3 right-3 bg-primary-600 text-white text-sm py-1 px-3">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-medium mb-2 text-primary-800">{product.name}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <p className="text-primary-600 font-medium">{product.price} €</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}