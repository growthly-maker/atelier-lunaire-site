import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminDirect() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Accès Admin Direct | Atelier Lunaire</title>
      </Head>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Accès Admin</h1>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Link href="/admin" className="bg-primary-600 text-white py-3 px-4 rounded-md text-center hover:bg-primary-700 transition-colors">
              Accéder au Panel Admin
            </Link>

            <Link href="/admin/produits" className="bg-primary-600 text-white py-3 px-4 rounded-md text-center hover:bg-primary-700 transition-colors">
              Accéder à la Gestion des Produits
            </Link>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
            <p className="font-bold mb-2">Diagnostic :</p>
            <p>Cette page est accessible, ce qui signifie que votre serveur Next.js fonctionne correctement.</p>
            <p className="mt-2">Si les liens ci-dessus ne fonctionnent pas, le problème est probablement lié à :</p>
            <ul className="list-disc pl-5 mt-2">
              <li>La structure des fichiers dans le dossier pages/admin/</li>
              <li>Des erreurs dans les composants utilisés par ces pages</li>
              <li>Des problèmes avec les middlewares de vérification d'authentification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}