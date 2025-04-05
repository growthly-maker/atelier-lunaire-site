// pages/_app.js
import { useEffect } from 'react';
import { Cormorant_Garamond, Poppins } from 'next/font/google';
import Head from 'next/head';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';

// Définition des polices
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  // Gestion du défilement fluide sur toute l'application
  useEffect(() => {
    // Fonction pour gérer les liens d'ancrage internes avec défilement doux
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      const elem = document.getElementById(href.substring(1));
      if (!elem) return;
      
      e.preventDefault();
      elem.scrollIntoView({ behavior: 'smooth' });
    };

    document.addEventListener('click', handleSmoothScroll);
    
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);
  
  return (
    <CartProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#967c58" />
        <meta name="description" content="Atelier Lunaire - Bijoux bohème-chic artisanaux" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${cormorant.variable} ${poppins.variable}`}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}