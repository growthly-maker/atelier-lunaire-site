import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Schéma de validation
const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // Si un des champs de mot de passe est rempli, tous doivent être remplis
  if (data.currentPassword || data.newPassword || data.confirmPassword) {
    return data.currentPassword && data.newPassword && data.confirmPassword;
  }
  return true;
}, {
  message: "Tous les champs de mot de passe doivent être remplis",
  path: ["currentPassword"],
}).refine(data => {
  // Vérifier que le nouveau mot de passe et la confirmation correspondent
  if (data.newPassword && data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
}).refine(data => {
  // Vérifier que le nouveau mot de passe est assez long s'il est fourni
  if (data.newPassword) {
    return data.newPassword.length >= 8;
  }
  return true;
}, {
  message: "Le nouveau mot de passe doit contenir au moins 8 caractères",
  path: ["newPassword"],
});

export default function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Configuration du formulaire avec React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/connexion?callbackUrl=/compte/parametres');
    }
  }, [status, router]);
  
  // Récupérer les données du profil
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/account/profile');
          
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération du profil');
          }
          
          const data = await response.json();
          
          if (data.success) {
            setUserData(data.data);
            
            // Pré-remplir le formulaire
            reset({
              name: data.data.name || '',
              email: data.data.email || '',
              phone: data.data.phone || '',
              street: data.data.address?.street || '',
              city: data.data.address?.city || '',
              postalCode: data.data.address?.postalCode || '',
              country: data.data.address?.country || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          } else {
            throw new Error(data.message || 'Erreur lors de la récupération du profil');
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error('Erreur:', err);
          setError('Impossible de récupérer vos informations. Veuillez réessayer plus tard.');
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [status, reset]);
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    
    try {
      // Préparer les données à envoyer
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      };
      
      // Ajouter les mots de passe si fournis
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }
      
      // Envoyer la requête de mise à jour
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('Votre profil a été mis à jour avec succès');
        
        // Mettre à jour les données locales
        setUserData(result.data);
        
        // Réinitialiser les champs de mot de passe
        reset({
          ...data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour de votre profil');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Afficher le chargement
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Afficher la page de paramètres
  if (status === 'authenticated') {
    return (
      <Layout>
        <Head>
          <title>Paramètres du compte | Atelier Lunaire</title>
          <meta name="description" content="Gérez vos paramètres de compte chez Atelier Lunaire" />
        </Head>
        
        <div className="container mx-auto px-4 py-8 mb-12">
          <div className="flex items-center mb-6">
            <Link href="/compte" className="text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-semibold">Paramètres du compte</h1>
          </div>
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Informations personnelles */}
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-4">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  {/* Téléphone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Adresse */}
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-4">Adresse de livraison</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rue */}
                  <div className="md:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="street"
                      {...register('street')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* Ville */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('city')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* Code postal */}
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      {...register('postalCode')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  {/* Pays */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Pays
                    </label>
                    <input
                      type="text"
                      id="country"
                      {...register('country')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Mot de passe */}
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-4">Changer le mot de passe</h2>
                <p className="text-gray-500 text-sm mb-4">Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mot de passe actuel */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      {...register('currentPassword')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  
                  {/* Nouveau mot de passe */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      {...register('newPassword')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                  </div>
                  
                  {/* Confirmation du mot de passe */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex justify-end">
                <Link
                  href="/compte"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-4 hover:bg-gray-50"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Par défaut, retourner null (ne devrait jamais être atteint)
  return null;
}