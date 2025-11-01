// app/api/products/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Product from '@/models/Product'
import connectDB from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { productSlug, action } = await request.json()
    
    if (!productSlug) {
      return NextResponse.json({ success: false, message: 'Product slug is required' })
    }

    // Find product by slug
    const product = await Product.findOne({ slug: productSlug })
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' })
    }

    if (action === 'view') {
      product.viewCount = (product.viewCount || 0) + 1
      // Update popularity score
      product.popularityScore = (product.viewCount * 0.7) + ((product.purchaseCount || 0) * 0.3)
    } else if (action === 'purchase') {
      product.purchaseCount = (product.purchaseCount || 0) + 1
      product.popularityScore = ((product.viewCount || 0) * 0.7) + (product.purchaseCount * 0.3)
    }

    await product.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking product interaction:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' })
  }
}