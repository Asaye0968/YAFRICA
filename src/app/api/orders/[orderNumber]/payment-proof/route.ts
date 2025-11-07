// src/app/api/orders/[orderNumber]/payment-proof/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    const { imageUrl, uploadedAt } = await request.json()

    await connectMongo()

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber },
      {
        $set: {
          'paymentProof.imageUrl': imageUrl,
          'paymentProof.uploadedAt': new Date(uploadedAt),
          'paymentProof.verified': false,
          status: 'pending'
        }
      },
      { new: true }
    )

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })

  } catch (error) {
    console.error('Update payment proof error:', error)
    return NextResponse.json(
      { error: 'Failed to update payment proof' },
      { status: 500 }
    )
  }
}