import mongoose from 'mongoose';

const VerificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 43200, // Le token expire après 12 heures (en secondes)
  },
});

export default mongoose.models.VerificationToken || 
  mongoose.model('VerificationToken', VerificationTokenSchema);