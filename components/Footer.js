import Link from 'next/link';
import { FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-serif mb-4">Atelier Lunaire</h3>
            <p className="text-gray-300 mb-4">
              Bijoux artisanaux bohème-chic inspirés par la nature et créés avec passion.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="hover:text-primary-300 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="https://pinterest.com" className="hover:text-primary-300 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="mailto:contact@atelierlunaire.com" className="hover:text-primary-300 transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/boutique" className="text-gray-300 hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-white transition-colors">
                  Notre Histoire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/conditions-generales" className="text-gray-300 hover:text-white transition-colors">
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Atelier Lunaire. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}