/**
 * Utilitaire pour gérer les erreurs Stripe et les traduire en messages compréhensibles
 */

// Types d'erreurs Stripe communs
const STRIPE_ERROR_TYPES = {
  StripeCardError: 'Erreur de carte', 
  StripeInvalidRequestError: 'Requête invalide',
  StripeAPIError: 'Erreur API Stripe',
  StripeConnectionError: 'Erreur de connexion',
  StripeAuthenticationError: 'Erreur d\'authentification',
  StripeRateLimitError: 'Trop de requêtes',
  StripeError: 'Erreur Stripe',
};

// Messages d'erreur spécifiques selon les codes d'erreur
const ERROR_MESSAGES = {
  'card_declined': 'La carte a été refusée.',
  'insufficient_funds': 'La carte ne dispose pas de fonds suffisants.',
  'card_not_supported': 'Cette carte n\'est pas prise en charge pour ce paiement.',
  'expired_card': 'La carte a expiré.',
  'incorrect_cvc': 'Le code de sécurité de la carte est incorrect.',
  'processing_error': 'Une erreur s\'est produite lors du traitement de la carte.',
  'incorrect_number': 'Le numéro de carte est incorrect.',
  'invalid_expiry_month': 'Le mois d\'expiration de la carte est invalide.',
  'invalid_expiry_year': 'L\'année d\'expiration de la carte est invalide.',
  'rate_limit': 'Trop de requêtes. Veuillez réessayer plus tard.',
  'api_connection': 'Impossible de se connecter aux serveurs de paiement. Vérifiez votre connexion internet.',
  'invalid_request': 'Paramètres de paiement invalides.',
  'authentication_required': 'L\'authentification 3D Secure est requise pour cette carte.',
};

/**
 * Traite les erreurs Stripe et retourne un message d'erreur compréhensible
 * @param {Error} error - L'erreur capturée
 * @returns {string} Message d'erreur
 */
export const handleStripeError = (error) => {
  // Type d'erreur Stripe
  const errorType = error.type || 'StripeError';
  
  // Code d'erreur spécifique
  const errorCode = error.code || 'unknown_error';
  
  // Construction du message d'erreur
  let errorMessage = ERROR_MESSAGES[errorCode] || error.message || 'Une erreur est survenue lors du paiement.';
  
  // Log complet pour le débogage
  console.error(`Erreur Stripe: ${errorType} - ${errorCode} - ${error.message}`);
  
  return errorMessage;
};

/**
 * Traite les erreurs de réponse d'API Stripe
 * @param {Object} response - La réponse d'erreur de l'API
 * @returns {string} Message d'erreur
 */
export const handleStripeAPIError = (response) => {
  if (!response || !response.error) {
    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
  }
  
  const { error } = response;
  const errorCode = error.code || 'unknown_error';
  
  return ERROR_MESSAGES[errorCode] || error.message || 'Erreur lors du traitement du paiement. Veuillez réessayer.';
};

/**
 * Vérifie si un paiement nécessite une authentification 3D Secure
 * @param {Error} error - L'erreur capturée
 * @returns {boolean} True si 3D Secure est nécessaire
 */
export const needs3DSecure = (error) => {
  return error && error.code === 'authentication_required';
};
