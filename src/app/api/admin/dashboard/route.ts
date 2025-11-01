import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/adminAuth'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'
import Product from '@/models/Product'

export async function GET(req: Request) {
  try {
    await verifyAdmin(req)
    await connectMongo()

    // Get all counts in parallel for better performance
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      pendingApprovals
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'seller' }),
      Product.countDocuments({}),
      // FIXED: Use correct status query
      Product.countDocuments({
        $or: [
          { status: 'pending' },
          { status: { $exists: false } }
        ]
      })
    ])

    const stats = {
      totalUsers,
      totalSellers,
      totalProducts,
      pendingApprovals,
      totalRevenue: 0,
      monthlySales: 0
    }

    return NextResponse.json({ 
      success: true, 
      stats 
    })
  } catch (error: any) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' }, 
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}