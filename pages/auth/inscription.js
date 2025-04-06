import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Schéma de validation avec Zod
const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      newsletter: false,
    }
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // Appel API pour créer un compte
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          newsletterSubscribed: data.newsletter
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Une erreur s\'est produite lors de l\'inscription');
      }
      
      setSuccess(true);
      
      // Connecter l'utilisateur automatiquement
      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      // Rediriger vers la page compte après un court délai
      setTimeout(() => {
        router.push('/compte');
      }, 1500);
      
    } catch (e) {
      setError(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Head>
        <title>Créer un compte | Atelier Lunaire</title>
        <meta name="description" content="Créez votre compte Atelier Lunaire pour accéder à vos commandes et informations personnelles." />
      </Head>

      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-primary-700 mb-6 text-center">Créer un compte</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-start">
              <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-sm flex items-start">
              <FiCheck className="flex-shrink-0 mt-0.5 mr-2" />
              <span>Votre compte a été créé avec succès ! Vous allez être redirigé...</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiUser />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`block w-full pl-10 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="Votre nom"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
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
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiLock />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={`block w-full pl-10 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="newsletter"
                type="checkbox"
                {...register('newsletter')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                Je souhaite recevoir la newsletter et les offres spéciales
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white ${loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} transition-colors duration-300`}
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link href="/auth/connexion" className="text-primary-600 hover:text-primary-700 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}