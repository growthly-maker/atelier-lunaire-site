// pages/produit/[id].js
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag, FiHeart, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Newsletter from '../../components/Newsletter';

// Données fictives des produits - Normalement ces données viendraient d'une API ou d'une base de données
const products = [
  {
    id: 1,
    name: "Collier Éclat Céleste",
    description: "Ce collier délicat est orné d'un pendentif en pierre de lune, symbole de féminité et d'intuition. La chaîne fine en argent 925 met en valeur ce joyau nacré dont les reflets bleutés évoquent les mystères de la lune. Chaque pierre étant naturelle, elle possède ses propres nuances et inclusions, rendant votre bijou véritablement unique.",
    longDescription: "Inspiré par les cycles lunaires et leur influence sur notre monde, l'Éclat Céleste capture la magie de ces nuits où la lune nous éclaire de sa lumière douce et mystérieuse. Ce collier est né d'une fascination pour les jeux de lumière de la pierre de lune, cette gemme aux reflets lactés qui change subtilement selon l'angle et l'éclairage.\n\nLa pierre est sertie à la main dans une monture en argent 925 aux formes organiques, comme si elle était délicatement posée dans un nid d'argent. La chaîne fine permet à la pierre d'être mise en valeur, comme suspendue dans l'air.\n\nPortez ce collier seul pour un effet minimaliste et élégant, ou superposez-le avec d'autres colliers pour un style plus bohème. La pierre de lune étant associée à l'intuition féminine et à la créativité, ce bijou accompagnera parfaitement celles qui suivent leur propre chemin.",
    price: 95,
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401"
    ],
    details: [
      "Pierre de lune naturelle (8-10mm)",
      "Chaîne et monture en argent 925",
      "Longueur de chaîne ajustable: 40-45cm",
      "Poids: environ 3.5g"
    ],
    care: "Évitez le contact avec l'eau, les parfums et produits cosmétiques. Pour nettoyer, utilisez un chiffon doux. Conservez votre bijou dans sa pochette lorsque vous ne le portez pas.",
    related: [2, 5, 8],
    options: [
      {
        name: "Longueur de chaîne",
        choices: ["40-45cm (standard)", "45-50cm (+5€)"]
      }
    ]
  },
  {
    id: 2,
    name: "Bague Murmure Doré",
    description: "Bague ajustable en laiton doré ornée de motifs floraux délicatement ciselés à la main.",
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d"
    ],
    category: "bagues",
    related: [6, 1, 3]
  },
  {
    id: 3,
    name: "Bracelet Écorce Sauvage",
    description: "Bracelet en argent texturé imitant l'écorce d'arbre, orné de petits éclats de turquoise brute.",
    price: 78,
    images: [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0"
    ],
    category: "bracelets",
    related: [7, 1, 4]
  },
  {
    id: 4,
    name: "Boucles d'Oreilles Goutte de Lune",
    description: "Élégantes boucles d'oreilles en argent 925 ornées de perles en pierre de lune.",
    price: 68,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59"
    ],
    category: "boucles-oreilles",
    related: [8, 1, 5]
  },
  {
    id: 5,
    name: "Collier Cascade Stellaire",
    description: "Collier multi-rangs avec pendentifs en laiton doré à l'or fin et petites perles de verre.",
    price: 110,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e"
    ],
    category: "colliers",
    related: [1, 4, 7]
  },
  {
    id: 6,
    name: "Bague Écume Argentée",
    description: "Bague en argent au design organique évoquant l'écume des vagues sur le sable.",
    price: 72,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e"
    ],
    category: "bagues",
    related: [2, 3, 8]
  },
  {
    id: 7,
    name: "Bracelet Solstice d'Été",
    description: "Bracelet jonc semi-ouvert en laiton doré avec embouts ornés de perles en amazonite.",
    price: 85,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bdb49ff5c"
    ],
    category: "bracelets",
    related: [3, 1, 5]
  },
  {
    id: 8,
    name: "Boucles d'Oreilles Étoile Filante",
    description: "Longues boucles d'oreilles minimalistes avec chaîne fine et petit pendentif étoile.",
    price: 58,
    images: [
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584"
    ],
    category: "boucles-oreilles",
    related: [4, 1, 2]
  }
];

// Fonction pour trouver un produit par son ID
const findProductById = (id) => {
  return products.find(product => product.id === Number(id)) || null;
};

// Fonction pour obtenir les produits associés
const getRelatedProducts = (relatedIds) => {
  return products.filter(product => relatedIds.includes(product.id));
};

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Si la page est en cours de chargement ou si l'ID n'est pas disponible
  if (router.isFallback || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary-600">Chargement...</div>
      </div>
    );
  }
  
  const product = findProductById(id);
  
  // Si le produit n'existe pas
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-serif text-primary-700 mb-4">Produit non trouvé</h1>
        <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <Link 
          href="/boutique"
          className="px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          Retourner à la boutique
        </Link>
      </div>
    );
  }
  
  // Produits associés
  const relatedProducts = product.related ? getRelatedProducts(product.related) : [];
  
  // Gestion des options
  const handleOptionChange = (optionName, value) => {
    setSelectedOption({
      ...selectedOption,
      [optionName]: value
    });
  };
  
  // Calcul du prix avec options
  const calculatePrice = () => {
    let finalPrice = product.price;
    
    // Exemple: ajout du prix pour une longueur de chaîne plus longue
    if (selectedOption['Longueur de chaîne'] === '45-50cm (+5€)') {
      finalPrice += 5;
    }
    
    return finalPrice * quantity;
  };

  // Ajouter au panier
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    // Ajoute un délai artificiel pour l'animation
    setTimeout(() => {
      addToCart(product, quantity, selectedOption);
      setAddedToCart(true);
      
      // Réinitialise l'indicateur après quelques secondes
      setTimeout(() => {
        setAddedToCart(false);
        setIsAddingToCart(false);
      }, 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>{product.name} | Atelier Lunaire</title>
        <meta name="description" content={product.description} />
      </Head>

      <Header />

      <main className="pt-24 pb-16 px-4">
        {/* Lien de retour */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link href="/boutique" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <FiArrowLeft className="mr-2" />
            Retour à la boutique
          </Link>
        </div>
        
        {/* Détails du produit */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Galerie d'images */}
            <div>
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-white">
                <Image 
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  className="transition-all duration-300"
                />
              </div>
              
              {/* Miniatures */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - vue ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Informations produit */}
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-serif text-primary-800 mb-2"
              >
                {product.name}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="text-2xl text-primary-600 font-medium mb-4"
              >
                {calculatePrice().toFixed(2)} €
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
              >
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Options du produit */}
                {product.options && product.options.length > 0 && (
                  <div className="mb-6">
                    {product.options.map((option, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          {option.name}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {option.choices.map((choice, choiceIndex) => (
                            <button
                              key={choiceIndex}
                              onClick={() => handleOptionChange(option.name, choice)}
                              className={`px-4 py-2 border ${
                                selectedOption[option.name] === choice
                                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Quantité */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Quantité
                  </label>
                  <div className="flex border border-gray-300 w-32">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <div className="flex-1 h-10 flex items-center justify-center border-l border-r border-gray-300">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`flex-1 px-6 py-3 ${addedToCart ? 'bg-green-600' : 'bg-primary-600 hover:bg-primary-700'} text-white transition-colors flex items-center justify-center`}
                  >
                    {addedToCart ? (
                      <>
                        <FiCheck className="mr-2" />
                        Ajouté au panier
                      </>
                    ) : (
                      <>
                        <FiShoppingBag className="mr-2" />
                        {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
                      </>
                    )}
                  </button>
                  <button className="px-4 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center">
                    <FiHeart className="mr-2" />
                    Ajouter aux favoris
                  </button>
                </div>
                
                {/* Détails du produit */}
                {product.details && (
                  <div className="mb-6">
                    <h2 className="text-xl font-serif text-primary-700 mb-3">Détails</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {product.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Entretien */}
                {product.care && (
                  <div className="mb-6">
                    <h2 className="text-xl font-serif text-primary-700 mb-3">Entretien</h2>
                    <p className="text-gray-700">{product.care}</p>
                  </div>
                )}
                
                {/* Description longue */}
                {product.longDescription && (
                  <div>
                    <h2 className="text-xl font-serif text-primary-700 mb-3">À propos de ce bijou</h2>
                    <div className="prose text-gray-700">
                      {product.longDescription.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Produits associés */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-serif text-primary-700 mb-6 text-center">Vous aimerez aussi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/produit/${product.id}`}
                    className="group"
                  >
                    <div className="relative h-64 mb-3 overflow-hidden bg-gray-100">
                      <Image
                        src={product.images ? product.images[0] : ''}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-primary-800 mb-1">{product.name}</h3>
                    <p className="text-primary-600">{product.price} €</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}