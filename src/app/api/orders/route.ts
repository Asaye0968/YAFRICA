// src/app/api/orders/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ticket, customerInfo, cartItems, totalPrice, paymentMethod, bankDetails } = body

    await connectMongo()

    // Create order in database
    const order = await Order.create({
      orderNumber: ticket.orderNumber,
      customerInfo: ticket.customerInfo,
      items: ticket.items,
      totalAmount: ticket.totalAmount,
      paymentMethod: ticket.paymentMethod,
      bankDetails: ticket.bankDetails,
      status: 'pending',
      paymentProof: {
        imageUrl: '',
        uploadedAt: null,
        verified: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('✅ Order created:', order.orderNumber)

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    })

  } catch (error) {
    console.error('❌ Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}