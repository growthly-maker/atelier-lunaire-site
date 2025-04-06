import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminDiagnostic() {
  const { data: session, status: sessionStatus } = useSession();
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/check-status');
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setApiStatus(data);
      } catch (err) {
        console.error('Erreur lors de la vérification du statut:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Head>
        <title>Diagnostic Admin | Atelier Lunaire</title>
      </Head>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Diagnostic de votre compte administrateur</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyse en cours de votre configuration...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700 font-medium">Erreur lors de la vérification</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statut de connexion */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium">Statut de connexion</div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${sessionStatus === 'authenticated' ? 'bg-green-500' : sessionStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">
                    {sessionStatus === 'authenticated' ? 'Connecté' : 
                     sessionStatus === 'loading' ? 'Chargement...' : 
                     'Non connecté'}
                  </span>
                </div>
                
                {session && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-md">
                    <p><span className="font-medium">Utilisateur:</span> {session.user.name}</p>
                    <p><span className="font-medium">Email:</span> {session.user.email}</p>
                    <p>
                      <span className="font-medium">Admin:</span> 
                      {session.user.isAdmin ? (
                        <span className="text-green-600">Oui</span>
                      ) : (
                        <span className="text-red-600">Non</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Résultats de l'API */}
            {apiStatus && (
              <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b font-medium">Résultats du diagnostic</div>
                <div className="p-4 space-y-4">
                  {/* Connexion MongoDB */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">Connexion MongoDB:</h3>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${apiStatus.mongodbConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span>{apiStatus.mongodbConnected ? 'Connecté' : 'Non connecté'}</span>
                    </div>
                  </div>
                  
                  {/* Variables d'environnement */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">Variables d'environnement:</h3>
                    <ul className="bg-gray-50 p-2 rounded">
                      {Object.entries(apiStatus.env).map(([key, value]) => (
                        <li key={key} className="flex items-center py-1">
                          <div className={`w-2 h-2 rounded-full mr-2 ${value === 'Défini' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="font-mono text-sm">{key}:</span>
                          <span className="ml-2 text-sm">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Comptes admin existants */}
                  <div>
                    <h3 className="text-sm font-medium mb-1">Comptes administrateurs dans MongoDB:</h3>
                    {apiStatus.adminUsers.length > 0 ? (
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-sm mb-2">{apiStatus.adminUsers.length} compte(s) administrateur trouvé(s):</p>
                        <ul className="space-y-2">
                          {apiStatus.adminUsers.map((admin, index) => (
                            <li key={index} className="text-sm bg-white p-2 rounded border">
                              <div><span className="font-medium">Nom:</span> {admin.name}</div>
                              <div><span className="font-medium">Email:</span> {admin.email}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-red-50 text-red-700 p-2 rounded border border-red-200">
                        Aucun compte administrateur trouvé dans la base de données.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Problèmes détectés et solutions */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b font-medium">Diagnostic et solutions</div>
              <div className="p-4">
                {/* Détection automatique des problèmes */}
                {apiStatus && (
                  <div className="space-y-4">
                    {/* Problème 1: Pas de compte admin */}
                    {apiStatus.adminUsers.length === 0 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                        <h3 className="font-medium text-yellow-800">Problème: Aucun compte administrateur trouvé</h3>
                        <p className="mt-1 text-yellow-700">Solution: Créez un compte administrateur en configurant les variables ADMIN_* dans .env.local puis redémarrez l'application.</p>
                      </div>
                    )}

                    {/* Problème 2: Session active mais pas admin */}
                    {session && !session.user.isAdmin && apiStatus.adminUsers.some(admin => admin.email === session.user.email) && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
                        <h3 className="font-medium text-yellow-800">Problème: Désynchronisation de session</h3>
                        <p className="mt-1 text-yellow-700">Solution: Votre compte est admin dans la base de données mais pas dans votre session. Déconnectez-vous et reconnectez-vous.</p>
                      </div>
                    )}

                    {/* Problème 3: MongoDB non connecté */}
                    {!apiStatus.mongodbConnected && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-3">
                        <h3 className="font-medium text-red-800">Problème: Pas de connexion à la base de données</h3>
                        <p className="mt-1 text-red-700">Solution: Vérifiez votre variable MONGODB_URI dans .env.local et assurez-vous que votre instance MongoDB est en cours d'exécution.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Liens d'accès rapide */}
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Accès rapide au panel administrateur:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link href="/admin-override" className="block p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded transition-colors">
                      Panel admin direct →
                    </Link>
                    <Link href="/admin-produits-direct" className="block p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded transition-colors">
                      Gestion des produits directe →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}