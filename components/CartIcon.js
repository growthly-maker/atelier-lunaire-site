import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartIcon({ className }) {
  const { cartCount } = useCart();

  return (
    <Link 
      href="/panier" 
      className={`relative ${className || ''}`}
      aria-label="Voir le panier"
    >
      <FiShoppingBag size={22} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
