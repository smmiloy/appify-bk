import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    unique: true,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
