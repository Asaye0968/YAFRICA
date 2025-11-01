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
      console.log('🔍 Searching by ObjectId...')
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

    console.log('✅ Product found:', product.name)

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

    console.log('✅ Processed product:', {
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