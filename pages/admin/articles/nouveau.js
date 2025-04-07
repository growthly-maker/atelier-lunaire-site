import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { FiSave, FiEye, FiArrowLeft } from 'react-icons/fi';
import AdminLayout from '../../../components/layouts/AdminLayout';
import Spinner from '../../../components/ui/Spinner';
import Alert from '../../../components/ui/Alert';

// Import dynamique de l'éditeur de texte riche
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function NouvelArticle() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '',
    category: 'actualites',
    tags: '',
    isFeatured: false,
    isPublished: true,
    relatedProducts: []
  });
  
  // États pour les produits associés
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Charger les produits pour les associer à l'article
  useEffect(() => {
    if (status === 'authenticated' && session.user.isAdmin) {
      const fetchProducts = async () => {
        try {
          const res = await fetch('/api/products');
          const data = await res.json();
          
          if (data.success) {
            setProducts(data.data);
          }
        } catch (err) {
          console.error('Erreur lors du chargement des produits', err);
        }
      };
      
      fetchProducts();
    }
  }, [status, session]);

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
    
    // Si c'est le titre, générer aussi le slug
    if (name === 'title') {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value)
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
    // Pour les tags (convertir en tableau)
    else if (name === 'tags') {
      setFormData({
        ...formData,
        tags: value
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
      
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Article créé avec succès !');
        setTimeout(() => {
          router.push('/admin/articles');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la création de l\'article');
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'article');
      console.error(err);
    } finally {
      setSubmitting(false);
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
    <AdminLayout title="Nouvel Article">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Créer un Nouvel Article</h1>
          </div>
          
          <div className="flex space-x-3">
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
              <FiSave className="mr-2" /> Publier
            </button>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}

        {previewMode ? (
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