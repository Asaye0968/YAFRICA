// models/User.ts - CORRECTED VERSION
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  storeName: { type: String, default: "" },
    username: { type: String, unique: true, sparse: true }, // Added username field

  address: { type: String, default: "" },
  paymentMethod: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "seller", "customer"],
    default: "customer" 
  },
  status: { 
    type: String, 
    enum: ["active", "suspended"], 
    default: "active" 
  },
  
  // Recommendation fields
  searchHistory: [{
    query: String,
    category: String,
    subcategory: String,
    timestamp: { type: Date, default: Date.now },
    resultsCount: Number
  }],
  
  productViews: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // User preferences for better recommendations
  preferredCategories: [String],
  preferredPriceRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100000 }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  // Schema options go here, not in the fields
  timestamps: true // This automatically handles createdAt and updatedAt
})

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash)
}

// Static method to find by string ID
UserSchema.statics.findByStringId = function(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return this.findById(new mongoose.Types.ObjectId(id))
  }
  return this.findById(id)
}

// Update updatedAt before saving (redundant with timestamps: true, but safe to keep)
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
// // models/User.ts
// import mongoose from "mongoose"
// import bcrypt from "bcryptjs"

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, default: "" },
//   storeName: { type: String, default: "" },
//   address: { type: String, default: "" },
//   paymentMethod: { type: String, default: "" },
//   passwordHash: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["admin", "seller", "customer"], // Added "admin"
//     default: "customer" 
//   },
//   status: { 
//     type: String, 
//     enum: ["active", "suspended"], 
//     default: "active" 
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// })

// UserSchema.methods.comparePassword = function (password: string) {
//   return bcrypt.compare(password, this.passwordHash)
// }

// // Update updatedAt before saving
// UserSchema.pre('save', function(next) {
//   this.updatedAt = new Date()
//   next()
// })

// export default mongoose.models.User || mongoose.model("User", UserSchema)