// models/Otp.ts
import mongoose from 'mongoose'

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['registration', 'password-reset', 'login'],
    default: 'registration'
  },
  attempts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 600 } // Auto-delete after 10 minutes
  }
}, {
  timestamps: true
})

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema)