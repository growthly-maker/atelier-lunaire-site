import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { ArrowLeftIcon, UserIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/connexion?callbackUrl=/compte/profil');
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
  }, [status]);
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
  
  // Afficher le profil
  if (status === 'authenticated' && userData) {
    return (
      <Layout title="Mon profil | Atelier Lunaire" description="Consultez et gérez votre profil chez Atelier Lunaire">
        <div className="container mx-auto px-4 py-8 mb-12">
          <div className="flex items-center mb-6">
            <Link href="/compte" className="text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-semibold">Mon profil</h1>
          </div>
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte de profil */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
                <div className="flex flex-col items-center">
                  <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="h-12 w-12 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
                  <p className="text-gray-500 mb-4">{userData.email}</p>
                  
                  <div className="w-full mt-4">
                    <div className="flex items-start mb-3">
                      <CalendarIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Client depuis</p>
                        <p className="font-medium">{formatDate(userData.createdAt)}</p>
                      </div>
                    </div>
                    
                    {userData.phone && (
                      <div className="flex items-start mb-3">
                        <PhoneIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{userData.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start mb-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mb-3">
                      <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        {userData.address && (userData.address.street || userData.address.city) ? (
                          <div>
                            {userData.address.street && <p>{userData.address.street}</p>}
                            {userData.address.postalCode && userData.address.city && (
                              <p>{userData.address.postalCode} {userData.address.city}</p>
                            )}
                            {userData.address.country && <p>{userData.address.country}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic">Non renseignée</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/compte/parametres" className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Modifier mon profil
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Informations complémentaires */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-semibold mb-4">Préférences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md">
                    <div>
                      <h3 className="font-medium">Newsletter</h3>
                      <p className="text-sm text-gray-500">Recevoir nos actualités et offres spéciales</p>
                    </div>
                    <div className="text-sm font-medium">
                      {userData.newsletterSubscribed ? (
                        <span className="text-green-600">Activée</span>
                      ) : (
                        <span className="text-gray-500">Désactivée</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-md">
                    <div>
                      <h3 className="font-medium">Compte vérifié</h3>
                      <p className="text-sm text-gray-500">Statut de vérification de votre compte</p>
                    </div>
                    <div className="text-sm font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Vérifié
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-right">
                  <Link href="/compte/parametres" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Gérer mes préférences
                  </Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Activité récente</h2>
                  <Link href="/compte/commandes" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Voir tout
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  {/* Note: Ici, nous pourrions afficher les dernières activités de l'utilisateur
                      comme les connexions récentes, les commandes, etc. */}
                  <p className="text-gray-500 text-center py-4">Aucune activité récente à afficher</p>
                  
                  <div className="mt-4 text-center">
                    <Link href="/boutique" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      Découvrir nos produits
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Par défaut, retourner null (ne devrait jamais être atteint)
  return null;
}