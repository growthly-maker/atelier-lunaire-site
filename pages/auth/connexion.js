import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Schéma de validation avec Zod
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Rediriger si déjà connecté
  if (status === 'authenticated') {
    router.push('/compte');
    return null;
  }

  // Gestion de la soumission du formulaire
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if (result.error) {
        setError(result.error);

        // Vérifier si l'erreur est liée à la vérification de l'email
        if (result.error.includes('vérifier votre adresse email')) {
          // Ajouter un message spécifique pour la vérification
          setError(
            "Votre adresse email n'a pas été vérifiée. Veuillez vérifier votre boîte de réception ou "
          );
        }
      } else {
        // Récupère le paramètre callbackUrl ou redirige vers la page compte
        const callbackUrl = router.query.callbackUrl || '/compte';
        router.push(callbackUrl);
      }
    } catch (e) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Connexion | Atelier Lunaire</title>
        <meta name="description" content="Connectez-vous à votre compte Atelier Lunaire pour accéder à vos commandes et informations personnelles." />
      </Head>

      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-primary-700 mb-6 text-center">Connexion</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-start">
              <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <span>{error}</span>
                {error.includes('adresse email') && (
                  <Link 
                    href="/resend-verification" 
                    className="block mt-1 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Renvoyer l'email de vérification
                  </Link>
                )}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiMail />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-10 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiLock />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`block w-full pl-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <div className="mt-1 text-right">
                <Link href="/auth/mot-de-passe-oublie" className="text-sm text-primary-600 hover:text-primary-700">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white ${loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} transition-colors duration-300`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link href="/auth/inscription" className="text-primary-600 hover:text-primary-700 font-medium">
                Créer un compte
              </Link>
            </p>
            <div className="mt-2">
              <Link 
                href="/resend-verification"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Besoin de vérifier votre email ?
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}