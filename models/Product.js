import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
  },
  longDescription: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  images: {
    type: [String],
    required: [true, 'Au moins une image est requise'],
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['colliers', 'bracelets', 'bagues', 'boucles-oreilles', 'autres'],
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: 0,
    default: 0,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  details: {
    type: [String],
  },
  care: {
    type: String,
  },
  related: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
  options: [{
    name: {
      type: String,
      required: true,
    },
    choices: {
      type: [String],
      required: true,
    },
  }],
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
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);