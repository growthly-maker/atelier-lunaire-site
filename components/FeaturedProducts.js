import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function FeaturedProducts() {
  // Produits fictifs
  const featuredProducts = [
    {
      id: 1,
      name: "Collier Éclat Céleste",
      description: "Collier fin orné d'un pendentif en pierre de lune, symbole de féminité et d'intuition.",
      price: 95,
      image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236"
    },
    {
      id: 2,
      name: "Bague Murmure Doré",
      description: "Bague ajustable en laiton doré ornée de motifs floraux délicatement ciselés à la main.",
      price: 65,
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d"
    },
    {
      id: 3,
      name: "Bracelet Écorce Sauvage",
      description: "Bracelet en argent texturé imitant l'écorce d'arbre, orné de petits éclats de turquoise brute.",
      price: 78,
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      y: -10,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-primary-700">Nos Créations Phares</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Découvrez nos pièces les plus appréciées, façonnées avec passion et une attention particulière aux détails.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
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
                </div>
                <h3 className="text-xl font-medium mb-2 text-primary-800">{product.name}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <p className="text-primary-600 font-medium">{product.price} €</p>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/boutique"
            className="inline-block px-8 py-3 border border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors duration-300"
          >
            Voir toute la collection
          </Link>
        </div>
      </div>
    </section>
  );
}