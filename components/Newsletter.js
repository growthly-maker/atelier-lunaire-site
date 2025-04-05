import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'inscription à la newsletter (simulée)
    setTimeout(() => {
      setIsSubmitted(true);
      setEmail('');
    }, 500);
  };

  return (
    <section className="py-16 px-4 bg-beige-200">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4 text-primary-700">Restez Inspiré</h2>
        <p className="text-lg text-gray-700 mb-8">
          Inscrivez-vous à notre newsletter pour découvrir nos nouvelles collections en avant-première,
          nos inspirations et les histoires derrière nos créations.
        </p>
        
        {isSubmitted ? (
          <div className="bg-primary-100 border border-primary-200 text-primary-700 p-4 rounded-sm">
            <p>Merci pour votre inscription ! Vous recevrez bientôt de nos nouvelles.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 w-full max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center"
            >
              <FiSend className="mr-2" />
              S'inscrire
            </button>
          </form>
        )}
      </div>
    </section>
  );
}