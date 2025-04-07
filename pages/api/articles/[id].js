import dbConnect from '../../../lib/dbConnect';
import Article from '../../../models/Article';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getSession({ req });
  await dbConnect();

  // GET - Récupérer un article
  if (req.method === 'GET') {
    try {
      const article = await Article.findById(id)
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
  } 
  
  // PUT - Mettre à jour un article
  else if (req.method === 'PUT') {
    // Vérifier l'authentification et les droits admin
    if (!session || !session.user.isAdmin) {
      return res.status(401).json({ success: false, message: 'Non autorisé' });
    }
    
    try {
      const article = await Article.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article non trouvé' });
      }
      
      res.status(200).json({ success: true, data: article });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } 
  
  // DELETE - Supprimer un article
  else if (req.method === 'DELETE') {
    // Vérifier l'authentification et les droits admin
    if (!session || !session.user.isAdmin) {
      return res.status(401).json({ success: false, message: 'Non autorisé' });
    }
    
    try {
      const article = await Article.findByIdAndDelete(id);
      
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article non trouvé' });
      }
      
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } 
  
  else {
    res.status(405).json({ success: false, message: 'Méthode non autorisée' });
  }
}