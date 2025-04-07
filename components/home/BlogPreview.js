import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import Spinner from '../ui/Spinner';

export default function BlogPreview() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles?limit=3&featured=true');
        const data = await res.json();
        
        if (data.success) {
          setArticles(data.data);
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
    
    fetchArticles();
  }, []);

  // Formatage de la date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  };

  // Fonction pour traduire les noms de catégories
  const getCategoryName = (categoryId) => {
    const categories = {
      'actualites': 'Actualités',
      'conseils': 'Conseils',
      'inspiration': 'Inspiration',
      'evenements': 'Événements',
      'artisanat': 'Artisanat'
    };
    
    return categories[categoryId] || categoryId;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-cormorant font-bold text-gray-800 mb-4">Le Journal de l'Atelier</h2>
            <p className="text-gray-600">Découvrez nos derniers articles et inspirations</p>
          </div>
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error || articles.length === 0) {
    return null; // Ne pas afficher la section s'il n'y a pas d'articles
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-cormorant font-bold text-gray-800 mb-4">Le Journal de l'Atelier</h2>
          <p className="text-gray-600">Découvrez nos derniers articles et inspirations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
              <Link href={`/blog/${article.slug}`}>
                <div className="h-48 bg-cover bg-center">
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
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500">
                    <FiClock className="mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    Lire <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/blog" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
}