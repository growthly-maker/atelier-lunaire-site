import dbConnect from '../../../../lib/dbConnect';
import Article from '../../../../models/Article';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { slug } = req.query;
  const session = await getSession({ req });
  await dbConnect();

  // GET - Récupérer un article par slug
  if (req.method === 'GET') {
    try {
      const article = await Article.findOne({ slug })
        .populate('author', 'name email image')
        .populate('relatedProducts', 'name slug images price');
      
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article non trouvé' });
      }
      
      // Vérifier si l'article n'est pas publié et que l'utilisateur n'est pas admin
      if (!article.isPublished && (!session || !session.user.isAdmin)) {
        return res.status(403).json({ success: false, message: 'Accès non autorisé' });
      }
      
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
}