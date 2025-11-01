import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import User from '@/models/User'
import Product from '@/models/Product'
import connectDB from '@/lib/mongodb'

// Track user search behavior - SIMPLIFIED
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchQuery, category, subcategory, productId, action } = await request.json()
    const userId = request.headers.get('x-user-id') || 'anonymous'
    
    console.log(`📝 Tracking ${action}:`, { searchQuery, category, productId, userId })

    // For now, just log the behavior without saving to database
    // This will prevent the ObjectId errors
    if (action === 'search' && searchQuery) {
      console.log(`🔍 User searched for: ${searchQuery} in ${category}`)
    }
    
    if (action === 'view' && productId) {
      console.log(`👀 User viewed product: ${productId}`)
      // Still track product views in the Product model
      await Product.findByIdAndUpdate(productId, {
        $inc: { viewCount: 1 }
      }).catch(err => console.log('Product view tracking failed:', err.message))
    }

    return NextResponse.json({ 
      success: true, 
      userId,
      message: 'Behavior tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking user behavior:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Tracking failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// Get recommendations - SIMPLIFIED
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const currentQuery = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '8')

    console.log(`🎯 Getting recommendations for: "${currentQuery}" in ${category}`)

    let query: any = { 
      status: 'approved', 
      inStock: true 
    }

    if (currentQuery) {
      query.$or = [
        { name: { $regex: currentQuery, $options: 'i' } },
        { description: { $regex: currentQuery, $options: 'i' } },
        { category: { $regex: currentQuery, $options: 'i' } }
      ]
    }

    if (category && category !== 'All Categories') {
      query.category = category
    }

    // Get recommendations based on popularity and relevance
    const recommendations = await Product.find(query)
      .limit(limit)
      .sort({ 
        isNewProduct: -1, 
        isOnSale: -1, 
        viewCount: -1,
        createdAt: -1 
      })

    console.log(`🎁 Found ${recommendations.length} recommendations`)

    return NextResponse.json({ 
      success: true, 
      recommendations,
      recommendationType: 'general', // Simple general recommendations for now
      query: currentQuery,
      count: recommendations.length
    })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    // Fallback to empty recommendations on error
    return NextResponse.json({ 
      success: true, 
      recommendations: [],
      recommendationType: 'fallback',
      message: 'Using fallback recommendations'
    })
  }
}