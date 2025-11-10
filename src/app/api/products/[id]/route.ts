import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Product from '@/models/Product'
import User from '@/models/User' // Import User model
import { ObjectId } from 'mongodb'

// GET product by ID or slug with proper CDN image handling
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 })
    }

    console.log('🔄 Fetching product:', id)
    
    // Connect to MongoDB
    await connectMongo()

    let product

    // Try to find by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      console.log(' Searching by ObjectId...')
      product = await Product.findById(id).populate({
        path: 'seller',
        select: 'name email storeName phone',
        model: 'User' // EXPLICITLY specify the User model
      })
    }

    // If not found by ID, try by slug
    if (!product) {
      console.log('🔍 Searching by slug...')
      product = await Product.findOne({ slug: id }).populate({
        path: 'seller',
        select: 'name email storeName phone',
        model: 'User' // EXPLICITLY specify the User model
      })
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    console.log(' Product found:', product.name)

    // Process images for CDN
    let images: string[] = []
    
    if (Array.isArray(product.images)) {
      images = product.images
    } else if (typeof product.images === 'string') {
      images = [product.images]
    } else if (product.image) { // Fallback to single image field
      images = [product.image]
    }

    // Process images for CDN - ensure absolute URLs
    const processedImages = images.map((img: string) => {
      if (!img) return ''
      
      // If already absolute URL (CDN), return as is
      if (img.startsWith('http')) {
        return img
      }
      
      // If relative path, construct absolute URL
      if (img.startsWith('/')) {
        return `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${img}`
      }
      
      // For CDN paths without protocol, add https
      if (img.startsWith('//')) {
        return `https:${img}`
      }
      
      return img
    }).filter((img: string) => img !== '')

    const processedProduct = {
      ...product.toObject(),
      _id: product._id.toString(),
      images: processedImages,
      // Ensure compatibility fields
      image: processedImages[0] || '', // For WishlistContext compatibility
      isDemo: false, // Mark as real product
    }

    console.log(' Processed product:', {
      name: processedProduct.name,
      imagesCount: processedProduct.images.length,
      firstImage: processedProduct.images[0]?.substring(0, 50) + '...',
      seller: processedProduct.seller?.storeName || 'No seller'
    })

    return NextResponse.json(processedProduct)
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

//for only idproduct fetching deployment testing
// import { NextResponse } from 'next/server'
// import connectMongo from '@/lib/mongodb'
// import Product from '@/models/Product'
// import User from '@/models/User'
// import { ObjectId } from 'mongodb'

// // GET product by ID ONLY - for testing deployment
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params

//     if (!id) {
//       return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 })
//     }

//     console.log('🔄 Fetching product by ID ONLY:', id)
    
//     // Connect to MongoDB
//     await connectMongo()

//     // STRICT ObjectId validation
//     const isValidObjectId = ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id)
    
//     if (!isValidObjectId) {
//       console.log('❌ Invalid ObjectId format:', id)
//       return NextResponse.json({ 
//         error: 'Invalid product ID format',
//         receivedId: id,
//         expectedFormat: '24-character hexadecimal MongoDB ObjectId'
//       }, { status: 400 })
//     }

//     console.log('✅ Valid ObjectId, searching...')
    
//     const product = await Product.findById(id).populate({
//       path: 'seller',
//       select: 'name email storeName phone',
//       model: 'User'
//     })

//     if (!product) {
//       console.log('❌ No product found with ID:', id)
//       return NextResponse.json({ 
//         error: 'Product not found with this ID',
//         productId: id
//       }, { status: 404 })
//     }

//     console.log('✅ Product found by ID:', product.name)

//     // Process images for CDN
//     let images: string[] = []
    
//     if (Array.isArray(product.images)) {
//       images = product.images
//     } else if (typeof product.images === 'string') {
//       images = [product.images]
//     } else if (product.image) {
//       images = [product.image]
//     }

//     // Process images for CDN
//     const processedImages = images.map((img: string) => {
//       if (!img) return ''
      
//       if (img.startsWith('http')) {
//         return img
//       }
      
//       if (img.startsWith('/')) {
//         return `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${img}`
//       }
      
//       if (img.startsWith('//')) {
//         return `https:${img}`
//       }
      
//       return img
//     }).filter((img: string) => img !== '')

//     const processedProduct = {
//       ...product.toObject(),
//       _id: product._id.toString(),
//       images: processedImages,
//       image: processedImages[0] || '',
//       isDemo: false,
//     }

//     console.log('📦 Processed product:', {
//       name: processedProduct.name,
//       imagesCount: processedProduct.images.length,
//       seller: processedProduct.seller?.storeName || 'No seller',
//       productId: processedProduct._id
//     })

//     return NextResponse.json({
//       success: true,
//       product: processedProduct,
//       foundBy: 'id',
//       debug: {
//         originalId: id,
//         processedId: processedProduct._id,
//         environment: process.env.NODE_ENV
//       }
//     })
//   } catch (error) {
//     console.error('❌ Error fetching product by ID:', error)
//     return NextResponse.json({ 
//       error: 'Failed to fetch product',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 })
//   }
// }