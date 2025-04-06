import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../context/CartContext';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    // Appel de l'API d'initialisation de l'admin au premier chargement
    fetch('/api/init-admin').catch(error => {
      console.error('Erreur lors de l\'initialisation de l\'admin:', error);
    });
  }, []);

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </SessionProvider>
  );
}