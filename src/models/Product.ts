// models/Product.ts - Add tracking fields
import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface IProduct extends Omit<Document, 'isNew'> {
  // Basic Information
  name: string
  slug?: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  description?: string
  status: 'pending' | 'approved' | 'rejected'
  inStock: boolean
  stock: number
  seller: mongoose.Types.ObjectId
  
  // Product Details
  rating?: number
  reviewCount?: number
  isNewProduct?: boolean
  isOnSale?: boolean
  salePrice?: number
  exchangePossible?: boolean
  
  // Tracking for recommendations
  viewCount: number
  purchaseCount: number
  popularityScore: number
  tags: string[]
  
  // ✅ FIXED: Use any type for specifications to avoid schema conflicts
  specifications?: any
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    // Basic Information
    name: { 
      type: String, 
      required: [true, 'Product name is required'], 
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: { type: String, unique: true, sparse: true },
    price: { 
      type: Number, 
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: { 
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'],
      trim: true,
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
        validator: function(images: string[]) {
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
      type: Schema.Types.ObjectId,
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
    
    // Tracking for recommendations
    viewCount: {
      type: Number,
      default: 0
    },
    purchaseCount: {
      type: Number,
      default: 0
    },
    popularityScore: {
      type: Number,
      default: 0
    },
    tags: [{
      type: String,
      trim: true
    }],
    
    // ✅ FIXED: Use Schema.Types.Mixed with proper configuration
    specifications: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        // Ensure specifications is always an object in JSON output
        if (!ret.specifications) {
          ret.specifications = {}
        }
        return ret
      }
    },
    toObject: { 
      virtuals: true,
      transform: function(doc, ret) {
        // Ensure specifications is always an object in object output
        if (!ret.specifications) {
          ret.specifications = {}
        }
        return ret
      }
    }
  }
)

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Virtual for current price (sale or regular)
ProductSchema.virtual('currentPrice').get(function() {
  return this.isOnSale && this.salePrice ? this.salePrice : this.price
})

// Auto-update popularity score
ProductSchema.pre('save', function(next) {
  this.popularityScore = (this.viewCount * 0.7) + (this.purchaseCount * 0.3)
  next()
})

// Indexes for optimal query performance
ProductSchema.index({ seller: 1, status: 1 })
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ popularityScore: -1 })
ProductSchema.index({ viewCount: -1 })
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
  'specifications.model': 'text',
  tags: 'text'
})

// ✅ FIXED: Add middleware to ensure specifications is always an object
ProductSchema.pre('save', function(next) {
  if (!this.specifications || typeof this.specifications !== 'object') {
    this.specifications = {}
  }
  next()
})

const Product = models.Product || model<IProduct>('Product', ProductSchema)
export default Product

// // models/Product.ts - COMPLETELY FIXED WITH SPECIFICATIONS
// import mongoose, { Schema, model, models, Document } from 'mongoose'

// // Simplified interface - use Mixed type for specifications to avoid conflicts
// export interface IProduct extends Omit<Document, 'isNew'> {
//   // Basic Information
//   name: string
//   slug?: string
//   price: number
//   originalPrice?: number
//   category: string
//   subcategory?: string
//   images: string[]
//   description?: string
//   status: 'pending' | 'approved' | 'rejected'
//   inStock: boolean
//   stock: number
//   seller: mongoose.Types.ObjectId
  
//   // Product Details
//   rating?: number
//   reviewCount?: number
//   isNewProduct?: boolean
//   isOnSale?: boolean
//   salePrice?: number
//   exchangePossible?: boolean
  
//   // ✅ FIXED: Use any type for specifications to avoid schema conflicts
//   specifications?: any
  
//   // Timestamps
//   createdAt: Date
//   updatedAt: Date
// }

// const ProductSchema = new Schema<IProduct>(
//   {
//     // Basic Information
//     name: { 
//       type: String, 
//       required: [true, 'Product name is required'], 
//       trim: true,
//       maxlength: [100, 'Product name cannot exceed 100 characters']
//     },
//     slug: { type: String, unique: true, sparse: true },
//     price: { 
//       type: Number, 
//       required: [true, 'Price is required'],
//       min: [0, 'Price cannot be negative']
//     },
//     originalPrice: { 
//       type: Number,
//       min: [0, 'Original price cannot be negative']
//     },
//     category: { 
//       type: String, 
//       required: [true, 'Category is required'],
//       trim: true,
//       enum: ['ELECTRONICS', 'CLOTHING', 'HOME_GARDEN', 'BEAUTY_HEALTH', 'SPORTS_OUTDOORS', 'TOYS_GAMES', 'AUTOMOTIVE', 'BOOKS_MEDIA', 'JEWELRY_ACCESSORIES', 'FOOD_BEVERAGES']
//     },
//     subcategory: { 
//       type: String, 
//       trim: true 
//     },
//     images: { 
//       type: [String], 
//       default: [],
//       validate: {
//         validator: function(images: string[]) {
//           return images.length <= 10
//         },
//         message: 'Cannot upload more than 10 images'
//       }
//     },
//     description: { 
//       type: String,
//       maxlength: [2000, 'Description cannot exceed 2000 characters']
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending'
//     },
//     inStock: { 
//       type: Boolean, 
//       default: true 
//     },
//     stock: { 
//       type: Number, 
//       default: 1,
//       min: [0, 'Stock cannot be negative']
//     },
//     seller: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
    
//     // Product Details
//     rating: {
//       type: Number,
//       min: 0,
//       max: 5,
//       default: 0
//     },
//     reviewCount: {
//       type: Number,
//       default: 0
//     },
//     isNewProduct: {
//       type: Boolean,
//       default: false
//     },
//     isOnSale: {
//       type: Boolean,
//       default: false
//     },
//     salePrice: {
//       type: Number,
//       min: 0
//     },
//     exchangePossible: {
//       type: Boolean,
//       default: false
//     },
    
//     // ✅ FIXED: Use Schema.Types.Mixed with proper configuration
//     specifications: {
//       type: Schema.Types.Mixed,
//       default: {}
//     }
//   },
//   { 
//     timestamps: true,
//     toJSON: { 
//       virtuals: true,
//       transform: function(doc, ret) {
//         // Ensure specifications is always an object in JSON output
//         if (!ret.specifications) {
//           ret.specifications = {}
//         }
//         return ret
//       }
//     },
//     toObject: { 
//       virtuals: true,
//       transform: function(doc, ret) {
//         // Ensure specifications is always an object in object output
//         if (!ret.specifications) {
//           ret.specifications = {}
//         }
//         return ret
//       }
//     }
//   }
// )

// // Virtual for discount percentage
// ProductSchema.virtual('discountPercentage').get(function() {
//   if (this.originalPrice && this.originalPrice > this.price) {
//     return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
//   }
//   return 0
// })

// // Virtual for current price (sale or regular)
// ProductSchema.virtual('currentPrice').get(function() {
//   return this.isOnSale && this.salePrice ? this.salePrice : this.price
// })

// // Indexes for optimal query performance
// ProductSchema.index({ seller: 1, status: 1 })
// ProductSchema.index({ category: 1, status: 1 })
// ProductSchema.index({ price: 1 })
// ProductSchema.index({ 'specifications.brand': 1 })
// ProductSchema.index({ 'specifications.condition': 1 })
// ProductSchema.index({ 'specifications.ram': 1 })
// ProductSchema.index({ 'specifications.storage': 1 })
// ProductSchema.index({ 'specifications.screenSize': 1 })
// ProductSchema.index({ 'specifications.color': 1 })
// ProductSchema.index({ 'specifications.simType': 1 })
// ProductSchema.index({ createdAt: -1 })
// ProductSchema.index({ rating: -1 })

// // Text search index
// ProductSchema.index({
//   name: 'text',
//   description: 'text',
//   'specifications.brand': 'text',
//   'specifications.model': 'text'
// })

// // ✅ FIXED: Add middleware to ensure specifications is always an object
// ProductSchema.pre('save', function(next) {
//   if (!this.specifications || typeof this.specifications !== 'object') {
//     this.specifications = {}
//   }
//   next()
// })

// const Product = models.Product || model<IProduct>('Product', ProductSchema)
// export default Product
