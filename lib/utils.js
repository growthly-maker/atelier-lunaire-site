/**
 * Formate un prix avec le symbole de l'euro et deux décimales
 * @param {number} price - Le prix à formater
 * @returns {string} Prix formaté
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Formate une date en format français
 * @param {string} dateString - La date à formater
 * @returns {string} Date formatée
 */
export function formatDate(dateString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

/**
 * Génère un slug à partir d'une chaîne de caractères
 * @param {string} str - La chaîne à transformer en slug
 * @returns {string} Slug généré
 */
export function generateSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplacer les espaces et underscores par des tirets
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin
}

/**
 * Tronque un texte à une longueur spécifiée
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - La longueur maximale
 * @returns {string} Texte tronqué
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Génère un numéro de commande unique
 * @returns {string} Numéro de commande
 */
export function generateOrderNumber() {
  const prefix = 'AL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}${timestamp}${random}`;
}

/**
 * Vérifie si un email est valide
 * @param {string} email - L'email à vérifier
 * @returns {boolean} Résultat de la validation
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Convertit une couleur hexadécimale en RGB
 * @param {string} hex - Code hexadécimal
 * @returns {object} Valeurs RGB {r, g, b}
 */
export function hexToRgb(hex) {
  // Supprimer le # si présent
  hex = hex.replace(/^#/, '');
  
  // Convertir en RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}