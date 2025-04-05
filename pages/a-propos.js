// pages/a-propos.js
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
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
        <title>Notre Histoire | Atelier Lunaire - Bijoux Bohème-Chic Artisanaux</title>
        <meta name="description" content="Découvrez l'histoire d'Atelier Lunaire, une marque de bijoux artisanaux bohème-chic créée par passion pour l'artisanat et les matériaux naturels." />
      </Head>

      <Header />

      {/* Bannière */}
      <div className="relative pt-20 h-[40vh] md:h-[50vh] overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88"
          alt="Atelier de création de bijoux"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="px-4">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Notre Histoire</h1>
            <p className="text-beige-100 text-lg max-w-xl mx-auto">
              Une passion pour la poésie des matières et le travail artisanal
            </p>
          </div>
        </div>
      </div>

      <main className="py-16 px-4">
        {/* L'histoire */}
        <section className="max-w-4xl mx-auto mb-20">
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="prose prose-lg mx-auto"
          >
            <h2 className="text-3xl font-serif text-primary-700 text-center mb-10">La Naissance d'Atelier Lunaire</h2>
            
            <div className="mb-12">
              <p className="text-gray-700 mb-4">
                C'est au cœur d'un petit village de l'arrière-pays provençal, baigné par la lumière dorée du sud, que l'histoire d'Atelier Lunaire a commencé. Éléonore, créatrice passionnée, avait toujours été fascinée par les matières brutes et les créations artisanales qui racontent une histoire.
              </p>
              <p className="text-gray-700 mb-4">
                Après des études en arts appliqués et plusieurs années passées auprès d'un maître joaillier, elle décide de donner vie à sa propre vision en créant Atelier Lunaire en 2018. Un nom qui évoque à la fois la lumière nocturne qui guide et inspire, et le cycle perpétuel de création et de renouveau.
              </p>
              <p className="text-gray-700">
                "Je voulais créer des bijoux qui soient plus que de simples ornements — des amulettes modernes qui accompagnent les femmes dans leur quotidien, qui évoluent avec elles et portent l'empreinte du temps", confie Éléonore.
              </p>
            </div>

            <div className="relative h-96 w-full my-12">
              <Image 
                src="https://images.unsplash.com/photo-1616935648060-56d26ff11128"
                alt="Atelier de création avec outils et matériaux"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>

            <h2 className="text-2xl font-serif text-primary-700 mb-6">Notre Philosophie</h2>
            <p className="text-gray-700 mb-4">
              Atelier Lunaire se définit par une approche holistique de la création. Chaque bijou est pensé non seulement comme un objet esthétique, mais comme un fragment d'histoire, un témoin silencieux de notre rapport au temps et à la beauté.
            </p>
            <p className="text-gray-700 mb-4">
              Nous privilégions les circuits courts et les fournisseurs éthiques pour nos matériaux. Les pierres semi-précieuses viennent de petites exploitations familiales, l'argent est recyclé quand c'est possible, et le laiton que nous utilisons est fabriqué en France.
            </p>
            <p className="text-gray-700">
              Cette démarche respectueuse s'étend jusqu'à nos emballages, réalisés en papier ensemencé que vous pouvez planter après utilisation pour faire germer des fleurs sauvages.
            </p>
          </motion.div>
        </section>

        {/* Le processus de création */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-serif text-primary-700 text-center mb-12">Notre Processus de Création</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-6 shadow-sm"
            >
              <div className="relative h-64 mb-4 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176"
                  alt="Matières premières et esquisses"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-serif text-primary-700 mb-3">Inspiration & Conception</h3>
              <p className="text-gray-700">
                Tout commence par une émotion, un fragment de poésie, la texture d'une écorce ou le mouvement d'une vague. Éléonore capture ces inspirations dans ses carnets d'esquisses, qui se transforment progressivement en dessins techniques.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 shadow-sm"
            >
              <div className="relative h-64 mb-4 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1592492152545-9695d3f473f4"
                  alt="Travail à l'atelier"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-serif text-primary-700 mb-3">Façonnage & Assemblage</h3>
              <p className="text-gray-700">
                Dans notre petit atelier baigné de lumière, chaque pièce est façonnée à la main. Le métal est coupé, martelé, ciselé, poli. Les pierres sont soigneusement sélectionnées pour leurs nuances et leurs énergies uniques.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 shadow-sm"
            >
              <div className="relative h-64 mb-4 overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1450297166380-cabe503887e5"
                  alt="Bijou porté"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-serif text-primary-700 mb-3">Vie & Patine</h3>
              <p className="text-gray-700">
                Nos bijoux sont conçus pour vivre et évoluer. L'argent se patine, le laiton s'adoucit, les pierres naturelles révèlent de nouvelles nuances au fil du temps. Chaque pièce raconte ainsi une histoire unique, celle de la personne qui la porte.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Notre équipe */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-primary-700 text-center mb-12">Notre Petite Équipe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative h-80 w-80 mx-auto mb-6 rounded-full overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Éléonore, fondatrice et créatrice"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-serif text-primary-700 mb-2">Éléonore Dumont</h3>
              <p className="text-primary-500 mb-4">Fondatrice & Créatrice</p>
              <p className="text-gray-700">
                Passionnée par l'artisanat depuis l'enfance, Éléonore a étudié la joaillerie avant de créer sa propre marque. Elle puise son inspiration dans ses voyages, la poésie et les paysages naturels.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="relative h-80 w-80 mx-auto mb-6 rounded-full overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
                  alt="Lucie, assistante de création"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="text-xl font-serif text-primary-700 mb-2">Lucie Moreau</h3>
              <p className="text-primary-500 mb-4">Assistante de Création</p>
              <p className="text-gray-700">
                Après une formation en design, Lucie a rejoint l'équipe en 2020. Son œil pour le détail et sa sensibilité aux matières font d'elle un soutien précieux dans le processus créatif.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}