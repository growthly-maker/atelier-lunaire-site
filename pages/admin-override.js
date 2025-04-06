import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiBox, FiShoppingBag, FiUsers, FiCreditCard } from 'react-icons/fi';

// Page d'accès d'urgence au panel admin sans vérification d'authentification
export default function AdminOverride() {
  const [stats, setStats] = useState({
    totalProducts: 24,
    totalOrders: 18,
    totalUsers: 42,
    totalRevenue: 2450.75,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Panel Admin Direct | Atelier Lunaire</title>
      </Head>
      
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex h-16 bg-white shadow">
        <div className="flex-1 flex items-center justify-between px-4">
          <div className="font-bold text-lg">Atelier Lunaire - Panel Administrateur (Accès direct)</div>
          <div className="text-sm text-red-600">
            Mode d'accès d'urgence (pas de vérification d'authentification)
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-serif text-gray-800 mb-2">Tableau de bord d'urgence</h1>
          <p className="text-gray-600 mb-6">Utilisez cette page pour accéder aux fonctionnalités administratives en cas de problème avec l'authentification.</p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Vous êtes en mode accès d'urgence. Pour une sécurité optimale, veuillez résoudre les problèmes d'authentification une fois votre configuration terminée.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiBox className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Produits</p>
                <p className="text-xl font-semibold text-gray-800">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <FiShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Commandes</p>
                <p className="text-xl font-semibold text-gray-800">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <FiUsers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Utilisateurs</p>
                <p className="text-xl font-semibold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FiCreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                <p className="text-xl font-semibold text-gray-800">{stats.totalRevenue.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Directe */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Navigation Directe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin-produits-direct" className="p-4 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
              <FiBox className="inline-block mr-2" /> Gestion des produits
            </Link>
            <Link href="/admin-commandes-direct" className="p-4 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors">
              <FiShoppingBag className="inline-block mr-2" /> Gestion des commandes
            </Link>
            <Link href="/admin-utilisateurs-direct" className="p-4 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors">
              <FiUsers className="inline-block mr-2" /> Gestion des utilisateurs
            </Link>
            <Link href="/" className="p-4 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
              Retour au site
            </Link>
          </div>
        </div>
        
        {/* Guide de résolution des problèmes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Résolution des problèmes d'authentification</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">1. Vérifiez votre base de données MongoDB</h3>
              <p className="text-gray-600 ml-5 mt-1">Vérifiez que votre utilisateur a bien le champ <code className="bg-gray-100 px-1 py-0.5 rounded">isAdmin: true</code> dans la collection users.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">2. Créer un nouvel utilisateur admin</h3>
              <p className="text-gray-600 ml-5 mt-1">Utilisez le fichier <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> pour définir un nouvel utilisateur admin par défaut et redémarrez l'application.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">3. Vérifier la connexion à MongoDB</h3>
              <p className="text-gray-600 ml-5 mt-1">Assurez-vous que votre application peut se connecter à MongoDB en vérifiant les logs du serveur.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}