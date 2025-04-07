import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { FiSave, FiEye, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../../../components/layouts/AdminLayout';
import Spinner from '../../../components/ui/Spinner';
import Alert from '../../../components/ui/Alert';

// Import dynamique de l'éditeur de texte riche
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditArticle() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
    isFeatured: false,
    isPublished: true,
    relatedProducts: []
  });
  
  // États pour les produits associés
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Rediriger si non connecté ou non admin
  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && !session.user.isAdmin)) {
      router.push('/auth/connexion');
    }
  }, [session, status, router]);

  // Charger l'article et les produits
  useEffect(() => {
    if (id && status === 'authenticated' && session.user.isAdmin) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Charger l'article
          const articleRes = await fetch(`/api/articles/${id}`);
          const articleData = await articleRes.json();
          
          if (articleData.success) {
            const article = articleData.data;
            
            // Formater les données pour le formulaire
            setFormData({
              title: article.title,
              slug: article.slug,
              summary: article.summary,
              content: article.content,
              coverImage: article.coverImage,
              category: article.category,
              tags: article.tags.join(', '),
              isFeatured: article.isFeatured,
              isPublished: article.isPublished,
              relatedProducts: article.relatedProducts ? article.relatedProducts.map(p => p._id || p) : []
            });
          } else {
            setError('Article non trouvé');
          }
          
          // Charger les produits
          const productsRes = await fetch('/api/products');
          const productsData = await productsRes.json();
          
          if (productsData.success) {
            setProducts(productsData.data);
          }
        } catch (err) {
          setError('Erreur lors du chargement des données');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [id, status, session]);

  // Générer un slug à partir du titre
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si c'est le titre, on peut mettre à jour le slug automatiquement
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
      });
    } 
    // Pour les champs checkbox
    else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
    // Pour les champs select multiples (produits associés)
    else if (name === 'relatedProducts') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData({
        ...formData,
        relatedProducts: selectedOptions
      });
    } 
    // Pour tous les autres champs
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Régénérer le slug
  const handleRegenerateSlug = () => {
    setFormData({
      ...formData,
      slug: generateSlug(formData.title)
    });
  };

  // Gestion de l'éditeur de texte riche
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Préparer les données pour l'API
      const articleData = {
        ...formData,
        // Convertir les tags en tableau
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Article mis à jour avec succès !');
        setTimeout(() => {
          router.push('/admin/articles');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour de l\'article');
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'article');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer l'article
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      setSubmitting(true);
      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: 'DELETE',
        });
        
        const data = await res.json();
        
        if (data.success) {
          setSuccess('Article supprimé avec succès !');
          setTimeout(() => {
            router.push('/admin/articles');
          }, 1500);
        } else {
          setError(data.message || 'Erreur lors de la suppression de l\'article');
        }
      } catch (err) {
        setError('Erreur lors de la suppression de l\'article');
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (status === 'loading' || (status === 'authenticated' && !session.user.isAdmin)) {
    return (
      <AdminLayout title="Chargement...">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Modifier l'article">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Modifier l'article</h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
              disabled={submitting}
            >
              <FiTrash2 className="mr-2" /> Supprimer
            </button>
            
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
            >
              <FiEye className="mr-2" /> {previewMode ? 'Éditer' : 'Aperçu'}
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center disabled:bg-indigo-300"
            >
              <FiSave className="mr-2" /> Enregistrer
            </button>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : previewMode ? (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{formData.title || 'Titre de l\'article'}</h2>
            {formData.coverImage && (
              <img 
                src={formData.coverImage} 
                alt={formData.title} 
                className="w-full h-64 object-cover rounded-lg mb-6" 
              />
            )}
            <div className="text-lg text-gray-600 mb-6 italic">{formData.summary || 'Résumé de l\'article'}</div>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content || '<p>Contenu de l\'article...</p>' }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">