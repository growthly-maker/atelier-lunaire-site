import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiClock, FiTag, FiArrowLeft, FiShare2, FiHeart, FiMessageSquare } from 'react-icons/fi';
import MainLayout from '../../components/layouts/MainLayout';
import Spinner from '../../components/ui/Spinner';

export default function Article() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'article
  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/slug/${slug}`);
      const data = await res.json();
      
      if (data.success) {
        setArticle(data.data);
        
        // Charger quelques articles de la même catégorie
        if (data.data.category) {
          fetchRelatedArticles(data.data.category, data.data._id);
        }
      } else {
        setError(data.message || 'Article non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement de l\'article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (category, excludeId) => {
    try {
      const res = await fetch(`/api/articles?category=${category}&limit=3`);
      const data = await res.json();
      
      if (data.success) {
        // Exclure l'article courant et limiter à 3 articles max
        const filtered = data.data
          .filter(a => a._id !== excludeId)
          .slice(0, 3);
        
        setRelatedArticles(filtered);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des articles associés', err);
    }
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
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

  // Partager l'article
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      })
      .catch((err) => console.error('Erreur de partage', err));
    } else {
      // Copier le lien dans le presse-papier
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Lien copié dans le presse-papier'))
        .catch(err => console.error('Erreur de copie', err));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-6">{error || "L'article que vous recherchez n'existe pas ou a été supprimé."}</p>
          <Link href="/blog" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <FiArrowLeft className="mr-2" /> Retour au blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{article.title} - Atelier Lunaire</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={`${article.title} - Atelier Lunaire`} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={article.coverImage} />
        <meta property="og:type" content="article" />
      </Head>

      <article className="container mx-auto px-4 py-12">
        {/* En-tête de l'article */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6">
            <FiArrowLeft className="mr-2" /> Retour au blog
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-gray-800 mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
            <div className="flex items-center mr-6 mb-2">
              <FiClock className="mr-1" />
              <span>Publié le {formatDate(article.publishedAt)}</span>
            </div>
            
            <Link 
              href={`/blog?category=${article.category}`}
              className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 mr-6 mb-2"
            >
              {getCategoryName(article.category)}
            </Link>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center mb-2">
                <FiTag className="mr-1" />
                {article.tags.map((tag, index) => (
                  <Link 
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="hover:text-indigo-600 mr-2"
                  >
                    #{tag}{index < article.tags.length - 1 ? '' : ''}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-lg italic text-gray-700">
              {article.summary}
            </p>
          </div>
        </div>
        
        {/* Image principale */}
        <div className="mb-12">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-md" 
          />
        </div>
        
        {/* Contenu de l'article */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Actions */}
          <div className="flex justify-between items-center border-t border-b border-gray-200 py-6 mt-12 mb-12">
            <div className="flex space-x-6">
              <button 
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <FiShare2 className="mr-2" /> Partager
              </button>
              
              <button 
                className="flex items-center text-gray-600 hover:text-pink-500"
              >
                <FiHeart className="mr-2" /> J'aime
              </button>
            </div>
            
            <Link 
              href="#commentaires"
              className="flex items-center text-gray-600 hover:text-indigo-600"
            >
              <FiMessageSquare className="mr-2" /> Commentaires
            </Link>
          </div>
          
          {/* Produits associés */}
          {article.relatedProducts && article.relatedProducts.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-cormorant font-bold text-gray-800 mb-6">
                Produits liés à cet article
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {article.relatedProducts.map((product) => (
                  <Link 
                    key={product._id} 
                    href={`/produit/${product.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                      <div className="h-48 bg-cover bg-center">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-indigo-600 font-semibold mt-2">
                          {product.price.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Articles associés */}
          {relatedArticles.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-cormorant font-bold text-gray-800 mb-6">
                Articles similaires
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relArticle) => (
                  <Link 
                    key={relArticle._id} 
                    href={`/blog/${relArticle.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                      <div className="h-40 bg-cover bg-center">
                        <img 
                          src={relArticle.coverImage} 
                          alt={relArticle.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {relArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {relArticle.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Section commentaires (placeholder) */}
          <div id="commentaires" className="mt-12">
            <h3 className="text-2xl font-cormorant font-bold text-gray-800 mb-6">
              Commentaires
            </h3>
            
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">
                La fonctionnalité de commentaires sera bientôt disponible.
              </p>
            </div>
          </div>
        </div>
      </article>
    </MainLayout>
  );
}