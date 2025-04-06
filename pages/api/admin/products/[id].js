import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

export default async function handler(req, res) {
  // Vérifier l'authentification et les droits d'administrateur
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user.isAdmin) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  
  const { id } = req.query;
  
  try {
    await connectToDatabase();
    
    // Gestion de la requête selon la méthode HTTP
    switch (req.method) {
      case 'GET':
        return await getProduct(id, res);
      case 'PUT':
        return await updateProduct(id, req.body, res);
      case 'DELETE':
        return await deleteProduct(id, res);
      default:
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur dans l\'API de produits:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Récupérer un produit par son ID
async function getProduct(id, res) {
  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
  }
}

// Mettre à jour un produit
async function updateProduct(id, updateData, res) {
  try {
    // Vérifier si le produit existe
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    // Si le slug est mis à jour, vérifier qu'il n'existe pas déjà
    if (updateData.slug && updateData.slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug: updateData.slug });
      
      if (existingProduct) {
        return res.status(400).json({ message: 'Un produit avec ce slug existe déjà' });
      }
    }
    
    // Mise à jour du produit
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
}

// Supprimer un produit
async function deleteProduct(id, res) {
  try {
    // Vérifier si le produit existe
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    // Supprimer le produit
    await Product.findByIdAndDelete(id);
    
    return res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
}