// app/api/orders/[orderNumber]/status/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(
  req: Request,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    await connectMongo()

    // Await the params
    const { orderNumber } = await context.params
    const order = await Order.findOne({ orderNumber })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      adminVerified: order.status === 'confirmed' || order.status === 'processing' || order.status === 'completed',
      adminVerifiedAt: order.updatedAt,
      status: order.status,
      paymentProof: order.paymentProof
    })

  } catch (error: any) {
    console.error('Order status check error:', error)
    return NextResponse.json({ error: 'Failed to check order status' }, { status: 500 })
  }
}