import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiEye, FiArchive } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminLayout from '../../../components/layouts/AdminLayout';
import Spinner from '../../../components/ui/Spinner';
import Alert from '../../../components/ui/Alert';

export default function ArticlesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Rediriger si non connecté ou non admin
  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && !session.user.isAdmin)) {
      router.push('/auth/connexion');
    }
  }, [session, status, router]);

  // Charger les articles avec filtres
  useEffect(() => {
    if (status === 'authenticated' && session.user.isAdmin) {
      fetchArticles();
    }
  }, [status, session, currentPage, categoryFilter, publishedFilter, featuredFilter]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `/api/articles?page=${currentPage}&limit=10`;
      
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (publishedFilter) url += `&published=${publishedFilter}`;
      if (featuredFilter) url += `&featured=${featuredFilter}`;
      if (searchQuery) url += `&search=${searchQuery}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setArticles(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: 'DELETE',
        });
        
        const data = await res.json();
        
        if (data.success) {
          // Actualiser la liste après suppression
          setArticles(articles.filter(article => article._id !== id));
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setPublishedFilter('');
    setFeaturedFilter('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  if (status === 'loading' || (status === 'authenticated' && !session.user.isAdmin)) {
    return (
      <AdminLayout title="Chargement des articles...">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Articles">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Articles du Blog</h1>
          <Link href="/admin/articles/nouveau" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
            <FiPlus className="mr-2" /> Nouvel Article
          </Link>
        </div>

        {/* Filtres */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Toutes les catégories</option>
              <option value="actualites">Actualités</option>
              <option value="conseils">Conseils</option>
              <option value="inspiration">Inspiration</option>
              <option value="evenements">Événements</option>
              <option value="artisanat">Artisanat</option>
            </select>
          </div>

          <div>
            <label htmlFor="publishedFilter" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              id="publishedFilter"
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Publié</option>
              <option value="false">Brouillon</option>
            </select>
          </div>

          <div>
            <label htmlFor="featuredFilter" className="block text-sm font-medium text-gray-700 mb-1">Mise en avant</label>
            <select
              id="featuredFilter"
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Tous les articles</option>
              <option value="true">À la une</option>
              <option value="false">Standard</option>
            </select>
          </div>

          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titre, contenu..."
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            Réinitialiser les filtres
          </button>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        {/* Liste des articles */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-gray-50 p-6 text-center rounded-lg">
            <p className="text-gray-500">Aucun article trouvé. Créez votre premier article !</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={article.coverImage} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{article.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{article.summary}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                      {article.isFeatured && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          À la une
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.isPublished ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <FiCheck className="mr-1" /> Publié
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          <FiArchive className="mr-1" /> Brouillon
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link href={`/blog/${article.slug}`} className="text-indigo-600 hover:text-indigo-900" target="_blank">
                          <FiEye size={18} />
                        </Link>
                        <Link href={`/admin/articles/${article._id}`} className="text-amber-600 hover:text-amber-900">
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Précédent
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                Suivant
              </button>
            </nav>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}