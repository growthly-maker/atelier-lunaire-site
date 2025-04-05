// pages/_app.js
import { useEffect } from 'react';
import { Outfit, Playfair_Display, Sora } from 'next/font/google';
import Head from 'next/head';
import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';

// Définition des polices modernes
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sora',
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
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="description" content="Atelier Lunaire - Bijoux contemporains et élégants" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${outfit.variable} ${playfair.variable} ${sora.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}