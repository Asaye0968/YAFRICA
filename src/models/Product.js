// models/product.js - COMPLETELY FIXED WITH SPECIFICATIONS
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  // Basic Information
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: { type: String, unique: true, sparse: true },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative']
  },
  originalPrice: { 
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: { 
    type: String, 
    required: true,
    trim: true,
  //   enum: [
  //   'Electronics', 'Clothing', 'Home & Garden', 'Beauty & Health', 
  //   'Sports & Outdoors', 'Toys & Games', 'Automotive', 
  //   'Books & Media', 'Jewelry & Accessories', 'Food & Beverages'
  enum: [
    'ELECTRONICS', 
    'CLOTHING', 
    'HOME_GARDEN', 
    'BEAUTY_HEALTH', 
    'SPORTS_OUTDOORS', 
    'TOYS_GAMES', 
    'AUTOMOTIVE', 
    'BOOKS_MEDIA', 
    'JEWELRY_ACCESSORIES', 
    'FOOD_BEVERAGES'
  ]
},
  subcategory: { 
    type: String, 
    trim: true 
  },
  images: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(images) {
        return images.length <= 10
      },
      message: 'Cannot upload more than 10 images'
    }
  },
  description: { 
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  stock: { 
    type: Number, 
    default: 1,
    min: [0, 'Stock cannot be negative']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Product Details
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  exchangePossible: {
    type: Boolean,
    default: false
  },
  
  // ✅ FIXED: Comprehensive Specifications with proper configuration
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { 
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // ✅ FIXED: Ensure specifications is always an object in JSON output
      if (!ret.specifications || typeof ret.specifications !== 'object') {
        ret.specifications = {}
      }
      return ret
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      // ✅ FIXED: Ensure specifications is always an object in object output
      if (!ret.specifications || typeof ret.specifications !== 'object') {
        ret.specifications = {}
      }
      return ret
    }
  }
})

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Virtual for current price
ProductSchema.virtual('currentPrice').get(function() {
  return this.isOnSale && this.salePrice ? this.salePrice : this.price
})

// Indexes for optimal query performance
ProductSchema.index({ seller: 1, status: 1 })
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ 'specifications.brand': 1 })
ProductSchema.index({ 'specifications.condition': 1 })
ProductSchema.index({ 'specifications.ram': 1 })
ProductSchema.index({ 'specifications.storage': 1 })
ProductSchema.index({ 'specifications.screenSize': 1 })
ProductSchema.index({ 'specifications.color': 1 })
ProductSchema.index({ 'specifications.simType': 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ rating: -1 })

// Text search index
ProductSchema.index({
  name: 'text',
  description: 'text',
  'specifications.brand': 'text',
  'specifications.model': 'text'
})

// ✅ FIXED: Add middleware to ensure specifications is always an object
ProductSchema.pre('save', function(next) {
  if (!this.specifications || typeof this.specifications !== 'object') {
    this.specifications = {}
  }
  next()
})

// ✅ FIXED: Add middleware for find operations to ensure specifications consistency
ProductSchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (doc.specifications && typeof doc.specifications === 'object') {
      // Already good
    } else {
      doc.specifications = {}
    }
  })
})

ProductSchema.post('findOne', function(doc) {
  if (doc && (!doc.specifications || typeof doc.specifications !== 'object')) {
    doc.specifications = {}
  }
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
export default Product


// // models/product.js - UPDATED TO MATCH NEW SCHEMA
// import mongoose from 'mongoose'

// const ProductSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true, 
//     trim: true,
//     maxlength: [100, 'Product name cannot exceed 100 characters']
//   },
//   slug: { type: String, unique: true },
//   price: { 
//     type: Number, 
//     required: true,
//     min: [0, 'Price cannot be negative']
//   },
//   originalPrice: { 
//     type: Number,
//     min: [0, 'Original price cannot be negative']
//   },
//   category: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   subcategory: { 
//     type: String, 
//     trim: true 
//   },
//   images: { 
//     type: [String], 
//     default: [],
//     validate: {
//       validator: function(images) {
//         return images.length <= 4 // Max 4 images
//       },
//       message: 'Cannot upload more than 4 images'
//     }
//   },
//   description: { 
//     type: String,
//     maxlength: [1000, 'Description cannot exceed 1000 characters']
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   inStock: { 
//     type: Boolean, 
//     default: true 
//   },
//   stock: { 
//     type: Number, 
//     default: 1,
//     min: [0, 'Stock cannot be negative']
//   },
//   seller: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Changed from 'Seller' to 'User'
//     required: true
//   }
// }, { 
//   timestamps: true // This adds createdAt and updatedAt
// })

// // Add indexes for better performance
// ProductSchema.index({ seller: 1, status: 1 })
// ProductSchema.index({ category: 1, status: 1 })

// const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
// export default Product