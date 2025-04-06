import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import FixedAdminLayout from '../../../components/admin/FixedLayout';
import { FiPlus, FiX, FiImage, FiSave } from 'react-icons/fi';

export default function NewProduct() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    price: '',
    category: '',
    stock: '0',
    isNew: false,
    isFeatured: false,
    images: [],
    details: [''],
    care: '',
    options: [],
  });
  
  const [newOption, setNewOption] = useState({ name: '', choices: [''] });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Générer automatiquement le slug à partir du nom
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
        .replace(/[\s_-]+/g, '-') // Remplacer les espaces et underscores par des tirets
        .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin
      
      setFormData(prevData => ({ ...prevData, slug }));
    }
  };
  
  // Gestion des détails (caractéristiques)
  const handleDetailChange = (index, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index] = value;
    setFormData(prevData => ({ ...prevData, details: updatedDetails }));
  };
  
  const addDetail = () => {
    setFormData(prevData => ({
      ...prevData,
      details: [...prevData.details, '']
    }));
  };
  
  const removeDetail = (index) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData(prevData => ({ ...prevData, details: updatedDetails }));
  };
  
  // Gestion des options
  const handleOptionNameChange = (e) => {
    setNewOption(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleOptionChoiceChange = (index, value) => {
    const updatedChoices = [...newOption.choices];
    updatedChoices[index] = value;
    setNewOption(prev => ({ ...prev, choices: updatedChoices }));
  };
  
  const addOptionChoice = () => {
    setNewOption(prev => ({
      ...prev,
      choices: [...prev.choices, '']
    }));
  };
  
  const removeOptionChoice = (index) => {
    const updatedChoices = [...newOption.choices];
    updatedChoices.splice(index, 1);
    setNewOption(prev => ({ ...prev, choices: updatedChoices }));
  };
  
  const addOption = () => {
    if (newOption.name.trim() === '' || newOption.choices.some(choice => choice.trim() === '')) {
      return;
    }
    
    setFormData(prevData => ({
      ...prevData,
      options: [...prevData.options, { ...newOption }]
    }));
    
    // Réinitialiser
    setNewOption({ name: '', choices: [''] });
  };
  
  const removeOption = (index) => {
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);
    setFormData(prevData => ({ ...prevData, options: updatedOptions }));
  };
  
  // Gestion des images
  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    if (imageUrl.trim() !== '') {
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, imageUrl]
      }));
      
      // Vider le champ
      e.target.value = '';
    }
  };
  
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData(prevData => ({ ...prevData, images: updatedImages }));
  };
  
  // Validation et soumission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.slug) newErrors.slug = 'Le slug est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!formData.price) newErrors.price = 'Le prix est requis';
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Le stock doit être un nombre entier positif';
    }
    if (formData.images.length === 0) newErrors.images = 'Au moins une image est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    // Simuler l'ajout d'un produit (démonstration uniquement)
    setTimeout(() => {
      console.log('Données du produit:', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      
      setSubmitting(false);
      router.push('/admin/produits');
    }, 1500);
  };

  return (
    <FixedAdminLayout>
      <Head>
        <title>Nouveau produit | Administration Atelier Lunaire</title>
      </Head>

      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Ajouter un nouveau produit</h1>
        <p className="text-gray-600">Créez un nouveau produit pour votre boutique.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Nom du produit */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.slug ? (
              <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">L'identifiant unique utilisé dans l'URL du produit.</p>
            )}
          </div>

          {/* Prix */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="colliers">Colliers</option>
              <option value="bracelets">Bracelets</option>
              <option value="bagues">Bagues</option>
              <option value="boucles-oreilles">Boucles d'oreilles</option>
              <option value="autres">Autres</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
          </div>

          {/* Options de mise en avant */}
          <div className="flex space-x-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Marquer comme nouveau</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Mettre en avant</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description courte */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description courte <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">Une brève description du produit affichée dans les listes et aperçus.</p>
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images du produit <span className="text-red-500">*</span>
          </label>
          
          {/* Galerie d'images */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden relative">
                    <img 
                      src={image} 
                      alt={`Image ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Ajout d'images */}
          <div className="flex items-center">
            <div className="flex-1">
              <input
                type="text"
                id="imageUrl"
                placeholder="Entrez l'URL de l'image"
                onBlur={handleImageChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${errors.images ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          </div>
          {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Entrez l'URL complète de chaque image et appuyez sur la touche Tab ou cliquez en dehors du champ pour l'ajouter.
          </p>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/produits')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Création en cours...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Créer le produit
              </>
            )}
          </button>
        </div>
      </form>
    </FixedAdminLayout>
  );
}