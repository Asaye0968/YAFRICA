import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectMongo()
    
    // Get ALL products with detailed info
    const allProducts = await Product.find({})
      .populate('sellerId', 'name email storeName phone')
      .sort({ createdAt: -1 })
      .lean()

    console.log('🔍 ALL PRODUCTS IN DATABASE:')
    allProducts.forEach((product: any, index: number) => {
      console.log(`Product ${index + 1}:`, {
        _id: product._id?.toString(),
        name: product.name,
        status: product.status,
        statusType: typeof product.status,
        sellerId: product.sellerId?._id?.toString(),
        sellerName: product.sellerId?.name,
        createdAt: product.createdAt
      })
    })

    // Check specific status values
    const statusValues = await Product.distinct('status')
    console.log('📊 DISTINCT STATUS VALUES:', statusValues)

    return NextResponse.json({
      success: true,
      totalProducts: allProducts.length,
      distinctStatusValues: statusValues,
      products: allProducts.map((p: any) => ({
        _id: p._id?.toString(),
        name: p.name,
        status: p.status,
        statusType: typeof p.status,
        sellerId: p.sellerId?._id?.toString(),
        sellerName: p.sellerId?.name,
        sellerStore: p.sellerId?.storeName,
        price: p.price,
        category: p.category,
        createdAt: p.createdAt,
        rawData: p // Include full raw data for inspection
      }))
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}