import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import MainLayout from '../../components/layouts/MainLayout';

export default function VerifyUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleVerifyUser = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez entrer une adresse email');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        setEmail('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Une erreur est survenue, veuillez réessayer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Protéger la page contre l'accès non authentifié
  if (status === 'loading') {
    return <div>Chargement...</div>;
  }
  
  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      router.push('/auth/connexion');
    }
    return <div>Accès non autorisé. Redirection...</div>;
  }

  return (
    <MainLayout>
      <Head>
        <title>Vérification manuelle des utilisateurs - Atelier Lunaire</title>
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Vérification Manuelle des Utilisateurs
          </h1>
          
          <form onSubmit={handleVerifyUser} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="email@exemple.com"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md">
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Traitement en cours...' : 'Marquer comme vérifié'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}