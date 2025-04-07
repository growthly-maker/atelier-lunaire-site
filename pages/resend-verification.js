import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de l\'envoi de l\'email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Renvoyer l'email de vérification - Atelier Lunaire</title>
      </Head>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Renvoyer l'email de vérification
          </h1>
          
          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg 
                  className="w-16 h-16 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <p className="mb-6 text-gray-700">
                Si votre adresse email existe dans notre système et n'est pas encore vérifiée, un nouvel email de vérification vous a été envoyé.
              </p>
              <Link 
                href="/auth/connexion" 
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <Alert type="error" message={error} className="mb-4" />}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer l\'email de vérification'
                  )}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <Link href="/auth/connexion" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}