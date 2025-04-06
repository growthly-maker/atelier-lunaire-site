import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String,
  selectedOptions: {
    type: Map,
    of: String,
    default: {},
  },
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Peut être null pour les commandes d'invités
  },
  items: [OrderItemSchema],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  paymentInfo: {
    stripeSessionId: String,
    stripeCustomerId: String,
    stripePaymentIntentId: String,
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'autre'],
      default: 'card',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: ['en attente', 'confirmée', 'préparation', 'expédiée', 'livrée', 'annulée'],
    default: 'en attente',
  },
  trackingNumber: String,
  shippingMethod: {
    type: String,
    enum: ['standard', 'express'],
    default: 'standard',
  },
  estimatedDelivery: Date,
  notes: String,
  email: String, // Pour les commandes sans compte
  ip: String,
  userAgent: String,
  guestCheckout: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Ajouter un index pour améliorer les performances de recherche
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ "paymentInfo.stripeSessionId": 1 });
OrderSchema.index({ email: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);