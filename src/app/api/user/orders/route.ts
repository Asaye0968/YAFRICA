import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: Request) {
  try {
    // Check authentication
    const cookieHeader = req.headers.get('cookie') || ''
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
    let token: string | null = null
    
    for (const cookie of cookies) {
      if (cookie.startsWith('token=')) {
        token = cookie.substring('token='.length)
        break
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string }
    
    await connectMongo()

    // Find orders by user email
    const orders = await Order.find({ 
      'customerInfo.email': payload.email 
    })
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean()

    return NextResponse.json({ 
      success: true, 
      orders: orders.map((order: any) => ({
        _id: order._id?.toString() || '',
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo,
        items: order.items || [],
        totalAmount: order.totalAmount || 0,
        status: order.status || 'pending',
        paymentProof: order.paymentProof ? {
          imageUrl: order.paymentProof.imageUrl,
          uploadedAt: order.paymentProof.uploadedAt?.toISOString(),
          verified: order.paymentProof.verified || false,
          verifiedBy: order.paymentProof.verifiedBy,
          verifiedAt: order.paymentProof.verifiedAt?.toISOString()
        } : undefined,
        createdAt: order.createdAt?.toISOString(),
        updatedAt: order.updatedAt?.toISOString(),
        adminNotes: order.adminNotes
      }))
    })

  } catch (error: any) {
    console.error('User orders fetch error:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}