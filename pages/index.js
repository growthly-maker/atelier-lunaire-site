import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import FeaturedProducts from '../components/FeaturedProducts';
import BlogPreview from '../components/home/BlogPreview';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Atelier Lunaire | Bijoux Bohème-Chic Artisanaux</title>
        <meta name="description" content="Découvrez des bijoux uniques et artisanaux de style bohème-chic par Atelier Lunaire, façonnés avec passion à partir de matériaux naturels et précieux." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        {/* Section Hero */}
        <section className="relative h-[85vh] overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0" 
            alt="Main artisanale créant un bijou" 
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-5xl md:text-7xl font-serif tracking-wide mb-6"
            >
              Atelier Lunaire
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto italic font-light"
            >
              Bijoux artisanaux inspirés par les cycles lunaires et la poésie de la nature
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link 
                href="/boutique"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center px-8 py-3 border-2 border-white bg-transparent hover:bg-white/10 transition-all duration-300 text-white rounded-none"
              >
                <span className="mr-2">Découvrir la collection</span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Section Présentation */}
        <section className="py-20 px-4 md:px-8 bg-beige-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-primary-700">Notre Philosophie</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Chaque bijou Atelier Lunaire est une invitation à la rêverie, conçu et façonné à la main pour 
              célébrer la beauté des imperfections et la poésie des matières naturelles. 
              Nous croyons en la magie des petits détails, en l'âme des choses créées avec patience et en 
              l'histoire que chaque pièce raconte silencieusement lorsqu'elle est portée.
            </p>
          </div>
        </section>

        {/* Section Produits Phares */}
        <FeaturedProducts />

        {/* Section Blog */}
        <BlogPreview />

        {/* Section Artisanat */}
        <section className="py-20 px-4 md:px-8 flex flex-col md:flex-row items-center bg-primary-50">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0" 
                alt="Main artisanale créant un bijou" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-primary-700">L'Art de l'Artisanat</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Chaque création est le fruit d'un processus artisanal minutieux où chaque élément est soigneusement sélectionné
              pour sa qualité et sa beauté intrinsèque. Nous travaillons principalement avec des matériaux naturels comme les pierres
              semi-précieuses, le bois, la nacre et les métaux nobles.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Notre atelier s'inspire des cycles de la lune, de la poésie des saisons et de la beauté imparfaite de la nature.
              Nous créons des pièces intemporelles qui portent en elles une histoire et une âme.
            </p>
            <Link 
              href="/a-propos"
              className="inline-block px-8 py-3 bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-300"
            >
              Découvrir notre histoire
            </Link>
          </div>
        </section>

        {/* Section Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}