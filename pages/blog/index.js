import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiClock, FiTag, FiFilter, FiX } from 'react-icons/fi';
import MainLayout from '../../components/layouts/MainLayout';
import Spinner from '../../components/ui/Spinner';

export default function Blog() {
  const router = useRouter();
  const { category, tag } = router.query;
  
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([
    { id: 'actualites', name: 'Actualités' },
    { id: 'conseils', name: 'Conseils' },
    { id: 'inspiration', name: 'Inspiration' },
    { id: 'evenements', name: 'Événements' },
    { id: 'artisanat', name: 'Artisanat' }
  ]);

  // Effet pour charger les articles
  useEffect(() => {
    fetchArticles();
  }, [currentPage, category, tag]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `/api/articles?page=${currentPage}&limit=9`;
      
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        if (currentPage === 1 && !category && !tag) {
          // Pour la première page sans filtres, trouver un article en vedette
          const featuredArticles = data.data.filter(article => article.isFeatured);
          
          if (featuredArticles.length > 0) {
            // Prendre le premier article mis en avant
            setFeaturedArticle(featuredArticles[0]);
            // Filtrer l'article en vedette des résultats normaux
            setArticles(data.data.filter(article => article._id !== featuredArticles[0]._id));
          } else {
            // Si aucun article n'est mis en avant, afficher tous les articles
            setFeaturedArticle(null);
            setArticles(data.data);
          }
        } else {
          // Pour les pages suivantes ou avec des filtres
          setFeaturedArticle(null);
          setArticles(data.data);
        }
        
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

  // Formatage de la date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  // Fonction pour traduire les noms de catégories
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Gérer le changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Réinitialiser les filtres
  const clearFilters = () => {
    router.push('/blog');
  };

  return (
    <MainLayout>
      <Head>
        <title>Blog - Atelier Lunaire</title>
        <meta name="description" content="Découvrez les dernières actualités, conseils et inspirations d'Atelier Lunaire, créateur de bijoux artisanaux bohème-chic." />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-cormorant font-bold text-gray-800 mb-4">Le Journal de l'Atelier</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Actualités, inspirations et conseils pour sublimer votre style bohème-chic au quotidien.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/blog?category=${cat.id}`}
                className={`px-4 py-2 rounded-full border ${
                  category === cat.id 
                    ? 'bg-indigo-100 border-indigo-300 text-indigo-800' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          
          {(category || tag) && (
            <div className="flex justify-center mt-4">
              <button 
                onClick={clearFilters}
                className="text-sm flex items-center text-gray-500 hover:text-indigo-600"
              >
                <FiX className="mr-1" /> Effacer les filtres
              </button>
            </div>
          )}
        </div>

        {/* Filtres actifs */}
        {(category || tag) && (
          <div className="mb-8 flex items-center justify-center">
            <div className="bg-gray-100 px-4 py-2 rounded-lg inline-flex items-center">
              <FiFilter className="mr-2 text-gray-500" />
              {category && (
                <span className="mr-2">
                  Catégorie: <strong>{getCategoryName(category)}</strong>
                </span>
              )}
              {tag && (
                <span>
                  Tag: <strong>{tag}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
          </div>
        ) : (
          <div>
            {/* Article en vedette */}
            {featuredArticle && (
              <div className="mb-16">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:shadow-xl">
                  <div className="md:flex">
                    <div className="md:w-2/5">
                      <div className="h-64 md:h-full bg-cover bg-center" style={{ backgroundImage: `url(${featuredArticle.coverImage})` }}>
                        <img 
                          src={featuredArticle.coverImage} 
                          alt={featuredArticle.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6 md:p-8">
                      <div className="flex items-center mb-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          À la une
                        </span>
                        <span className="ml-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryName(featuredArticle.category)}
                        </span>
                      </div>
                      <h2 className="text-3xl font-cormorant font-bold text-gray-800 mb-4">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {featuredArticle.summary}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-6">
                        <FiClock className="mr-1" />
                        <span>{formatDate(featuredArticle.publishedAt)}</span>
                      </div>
                      <Link 
                        href={`/blog/${featuredArticle.slug}`} 
                        className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Lire l'article
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des articles */}
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun article trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <div key={article._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <Link href={`/blog/${article.slug}`}>
                      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${article.coverImage})` }}>
                        <img 
                          src={article.coverImage} 
                          alt={article.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex mb-3">
                        <Link 
                          href={`/blog?category=${article.category}`}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {getCategoryName(article.category)}
                        </Link>
                      </div>
                      <Link href={`/blog/${article.slug}`}>
                        <h3 className="font-cormorant font-bold text-xl text-gray-800 mb-2 hover:text-indigo-600">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiClock className="mr-1" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex items-center">
                            <FiTag className="mr-1" />
                            <Link 
                              href={`/blog?tag=${article.tags[0]}`}
                              className="hover:text-indigo-600"
                            >
                              {article.tags[0]}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                      onClick={() => handlePageChange(page)}
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
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
        )}
      </div>
    </MainLayout>
  );
}