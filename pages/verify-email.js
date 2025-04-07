import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ne vérifier que si le token est disponible
    if (token && !verifying && !success && !error) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    setVerifying(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la vérification de votre email');
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Vérification d'Email - Atelier Lunaire</title>
      </Head>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Vérification de votre adresse email
          </h1>
          
          <div className="text-center">
            {verifying ? (
              <div className="flex flex-col items-center">
                <Spinner size="lg" className="mb-4" />
                <p>Vérification en cours...</p>
              </div>
            ) : success ? (
              <>
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
                  Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
                </p>
                <Link 
                  href="/auth/connexion" 
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Connexion
                </Link>
              </>
            ) : error ? (
              <>
                <Alert type="error" message={error} className="mb-6" />
                <p className="text-gray-700 mb-6">
                  Le lien de vérification est peut-être expiré ou invalide.
                </p>
                <Link 
                  href="/resend-verification" 
                  className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mb-4"
                >
                  Renvoyer l'email de vérification
                </Link>
                <div className="mt-4">
                  <Link 
                    href="/auth/connexion" 
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </>
            ) : !token ? (
              <p className="text-gray-700">
                Lien de vérification invalide.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}