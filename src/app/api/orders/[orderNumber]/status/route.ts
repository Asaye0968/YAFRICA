// src/app/api/orders/[orderNumber]/status/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'

// Use the new Next.js 14 pattern with Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    // Await the params first
    const { orderNumber } = await params
    
    await connectMongo()
    
    const order = await Order.findOne({ 
      orderNumber 
    }).select('status paymentProof adminVerified adminVerifiedAt')
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      status: order.status,
      paymentProof: order.paymentProof,
      adminVerified: order.paymentProof?.verified || false,
      adminVerifiedAt: order.paymentProof?.verifiedAt,
      orderNumber: orderNumber
    })
    
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check order status' },
      { status: 500 }
    )
  }
}