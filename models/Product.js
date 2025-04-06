import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  values: [{
    label: {
      type: String,
      required: true,
    },
    priceModifier: {
      type: Number,
      default: 0,
    },
  }],
  required: {
    type: Boolean,
    default: false,
  },
});

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
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La description du produit est requise'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix doit être positif'],
  },
  images: {
    type: [String],
    required: [true, 'Au moins une image est requise'],
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['colliers', 'bracelets', 'boucles', 'bagues', 'nouveautés', 'collections'],
  },
  collections: {
    type: [String],
    default: [],
  },
  materials: {
    type: [String],
    default: [],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [OptionSchema],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  weight: Number, // en grammes
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  metaTitle: String,
  metaDescription: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtuel pour calculer le prix final
ProductSchema.virtual('finalPrice').get(function() {
  if (this.discountPercentage && this.discountPercentage > 0) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
});

// Méthode pour vérifier la disponibilité d'un produit
ProductSchema.methods.isAvailable = function() {
  return this.inStock && this.quantity > 0;
};

// Indices pour améliorer les performances des requêtes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ collections: 1 });
ProductSchema.index({ materials: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ isArchived: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);