import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminBasic() {
  const { data: session, status } = useSession();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Admin Basic | Atelier Lunaire</title>
      </Head>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Panel Admin Basique</h1>
        
        <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-md">
          <p className="font-medium">Statut de la session :</p>
          <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto">
            {status === 'loading' ? 'Chargement...' : 
             !session ? 'Non connecté' : 
             JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        {session?.user?.isAdmin ? (
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/admin"
              className="block p-4 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 transition-colors text-center"
            >
              Tableau de bord
            </Link>
            <Link 
              href="/admin/produits"
              className="block p-4 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 transition-colors text-center"
            >
              Gestion des produits
            </Link>
            <Link 
              href="/admin/commandes"
              className="block p-4 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 transition-colors text-center"
            >
              Gestion des commandes
            </Link>
            <Link 
              href="/admin/utilisateurs"
              className="block p-4 bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 transition-colors text-center"
            >
              Gestion des utilisateurs
            </Link>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
            <p>Vous n'êtes pas connecté en tant qu'administrateur.</p>
            <Link href="/auth/connexion" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              Se connecter
            </Link>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}