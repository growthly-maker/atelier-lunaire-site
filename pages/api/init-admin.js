import { initAdminUser } from '../../lib/initAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
  
  try {
    await initAdminUser();
    return res.status(200).json({ message: 'Initialisation admin effectuée' });
  } catch (error) {
    console.error('Erreur API init-admin:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}