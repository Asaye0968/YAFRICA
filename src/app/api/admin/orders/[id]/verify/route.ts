// C:\Users\hp\Desktop\nextjs pro\yafrican\src\app\api\admin\orders\[id]\verify\route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
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

    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string; name: string }
    
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { status, adminNotes } = await req.json()

    if (!['confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Use "confirmed" or "cancelled"' }, { status: 400 })
    }

    await connectMongo()

    // Await the params
    const { id } = await context.params

    const updateData: any = { 
      status,
      updatedAt: new Date()
    }

    if (adminNotes) {
      updateData.adminNotes = adminNotes
    }

    // If confirming payment, mark payment as verified
    if (status === 'confirmed') {
      updateData.$set = {
        'paymentProof.verified': true,
        'paymentProof.verifiedBy': payload.name,
        'paymentProof.verifiedAt': new Date()
      }
      updateData.adminVerified = true
      updateData.adminVerifiedAt = new Date()
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      order,
      message: `Order ${status} successfully` 
    })

  } catch (error: any) {
    console.error('Admin order verify error:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}