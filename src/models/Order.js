// models/Order.js
import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customerInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true }
  },
  items: [{
    id: String,
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  bankDetails: {
    name: String,
    accountNumber: String,
    accountName: String,
    branch: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentProof: {
  imageUrl: { type: String },
  uploadedAt: { type: Date },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: String },
  verifiedAt: { type: Date }
},
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Update updatedAt before saving
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)