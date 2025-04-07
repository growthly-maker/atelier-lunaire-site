import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre de l\'article est requis'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  summary: {
    type: String,
    required: [true, 'Le résumé est requis'],
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
  },
  coverImage: {
    type: String,
    required: [true, 'Une image de couverture est requise'],
  },
  images: {
    type: [String],
    default: [],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis'],
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['actualites', 'conseils', 'inspiration', 'evenements', 'artisanat'],
  },
  tags: {
    type: [String],
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  relatedProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Création d'un index de recherche en texte
ArticleSchema.index({ title: 'text', summary: 'text', content: 'text' });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);