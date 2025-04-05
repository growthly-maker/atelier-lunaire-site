import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Vérifie si localStorage est disponible (pour éviter les erreurs côté serveur)
  const isLocalStorageAvailable = typeof window !== 'undefined';
  
  // Initialise le panier depuis localStorage ou vide
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charge le panier depuis localStorage lors du montage du composant
  useEffect(() => {
    if (isLocalStorageAvailable) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      setIsLoading(false);
    }
  }, [isLocalStorageAvailable]);

  // Mise à jour du localStorage lorsque le panier change
  useEffect(() => {
    if (isLocalStorageAvailable && !isLoading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading, isLocalStorageAvailable]);

  // Fonctions pour manipuler le panier
  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    setCartItems(prevItems => {
      // Cherche si le produit existe déjà dans le panier avec les mêmes options
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.id === product.id && 
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );

      if (existingItemIndex !== -1) {
        // Si le produit existe, met à jour la quantité
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Sinon, ajoute un nouvel élément au panier
        return [...prevItems, { ...product, quantity, selectedOptions }];
      }
    });
  };

  const removeFromCart = (itemIndex) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== itemIndex));
  };

  const updateQuantity = (itemIndex, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[itemIndex].quantity = newQuantity;
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculer le total du panier
  const cartTotal = cartItems.reduce((total, item) => {
    // Si le prix est basé sur des options, calculer en conséquence
    let itemPrice = item.price;
    
    // Exemple: ajout du prix pour une longueur de chaîne plus longue
    if (item.selectedOptions['Longueur de chaîne'] === '45-50cm (+5€)') {
      itemPrice += 5;
    }
    
    return total + (itemPrice * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
