import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/adminAuth'
import connectMongo from '@/lib/mongodb'
import Product from '@/models/Product'

export async function POST(req: Request) {
  try {
    await verifyAdmin(req)
    await connectMongo()
    
    console.log('🔧 Starting product status fix...')

    // Find products with undefined or missing status
    const productsToFix = await Product.find({
      $or: [
        { status: { $exists: false } },
        { status: undefined },
        { status: null },
        { status: '' }
      ]
    })

    console.log(`📊 Found ${productsToFix.length} products to fix`)

    // Fix status values
    let fixedCount = 0
    for (const product of productsToFix) {
      console.log(`🛠️ Fixing product: ${product._id} - "${product.name}"`)
      
      const oldStatus = product.status
      product.status = 'pending'
      await product.save()
      
      console.log(`✅ Fixed: ${oldStatus} -> ${product.status}`)
      fixedCount++
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} products with undefined status`,
      fixed: fixedCount,
      totalFound: productsToFix.length
    })
  } catch (error: any) {
    console.error('❌ Fix error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}