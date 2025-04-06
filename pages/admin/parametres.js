import Head from 'next/head';
import { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import AdminLayout from '../../components/admin/Layout';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // États pour les différents formulaires
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Atelier Lunaire',
    siteDescription: 'Bijoux artisanaux inspirés par les cycles lunaires et la poésie de la nature',
    contactEmail: 'contact@atelierlunaire.com',
    phoneNumber: '+33 6 12 34 56 78',
    address: '12 rue de la Lune, 75001 Paris, France',
  });
  
  const [deliverySettings, setDeliverySettings] = useState({
    freeShippingThreshold: 80,
    standardShippingCost: 5.90,
    expressShippingCost: 12.90,
  });
  
  const [emailSettings, setEmailSettings] = useState({
    orderConfirmationTemplate: '<p>Bonjour {{name}},</p><p>Merci pour votre commande n°{{orderNumber}}.</p>',
    shippingConfirmationTemplate: '<p>Bonjour {{name}},</p><p>Votre commande n°{{orderNumber}} a été expédiée.</p>',
    welcomeTemplate: '<p>Bienvenue chez Atelier Lunaire, {{name}}!</p>',
  });
  
  // Gestion des changements dans le formulaire général
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gestion des changements dans le formulaire de livraison
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliverySettings(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  
  // Gestion des changements dans le formulaire d'emails
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Soumission des formulaires
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      
      // Masquer le message après 3 secondes
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Paramètres | Administration Atelier Lunaire</title>
      </Head>

      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-800">Paramètres</h1>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md">
          Les paramètres ont été sauvegardés avec succès.
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Navigation par onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'general' 
                ? 'border-b-2 border-primary-500 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Général
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'delivery' 
                ? 'border-b-2 border-primary-500 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Livraison
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`py-4 px-6 text-sm font-medium ${activeTab === 'emails' 
                ? 'border-b-2 border-primary-500 text-primary-600' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Emails
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {/* Paramètres généraux */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description du site
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Paramètres de livraison */}
          {activeTab === 'delivery' && (
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                    Seuil de livraison gratuite (€)
                  </label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    value={deliverySettings.freeShippingThreshold}
                    onChange={handleDeliveryChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Montant à partir duquel la livraison est offerte (0 pour désactiver)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="standardShippingCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Coût de livraison standard (€)
                  </label>
                  <input
                    type="number"
                    id="standardShippingCost"
                    name="standardShippingCost"
                    value={deliverySettings.standardShippingCost}
                    onChange={handleDeliveryChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="expressShippingCost" className="block text-sm font-medium text-gray-700 mb-1">
                    Coût de livraison express (€)
                  </label>
                  <input
                    type="number"
                    id="expressShippingCost"
                    name="expressShippingCost"
                    value={deliverySettings.expressShippingCost}
                    onChange={handleDeliveryChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Paramètres des emails */}
          {activeTab === 'emails' && (
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="orderConfirmationTemplate" className="block text-sm font-medium text-gray-700 mb-1">
                    Modèle d'email de confirmation de commande
                  </label>
                  <textarea
                    id="orderConfirmationTemplate"
                    name="orderConfirmationTemplate"
                    value={emailSettings.orderConfirmationTemplate}
                    onChange={handleEmailChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    Variables disponibles: {{name}}, {{orderNumber}}, {{total}}, {{date}}