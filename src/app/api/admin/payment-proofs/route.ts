// src/app/api/admin/payment-proofs/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Order from '@/models/Order'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: Request) {
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

    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string }
    
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await connectMongo()

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'pending'

    console.log('🔍 Fetching payment proofs with filter:', filter)

    // IMPROVED QUERY: Better handling of payment proof existence
    let query: any = {}
    
    switch (filter) {
      case 'pending':
        // Look for orders with payment proof that are not verified
        query = {
          $and: [
            { 
              $or: [
                { 'paymentProof.imageUrl': { $exists: true, $ne: null } },
                { 'paymentProof.imageUrl': { $ne: '' } }
              ]
            },
            { 'paymentProof.verified': { $ne: true } },
            { status: 'pending' }
          ]
        }
        break
      case 'verified':
        // Orders with verified payment proofs
        query = {
          'paymentProof.verified': true
        }
        break
      case 'rejected':
        // Orders that were cancelled/rejected
        query = {
          status: 'cancelled'
        }
        break
      case 'all':
        // All orders that have any payment proof data
        query = {
          $or: [
            { 'paymentProof.imageUrl': { $exists: true, $ne: null } },
            { 'paymentProof.imageUrl': { $ne: '' } },
            { 'paymentProof.verified': { $exists: true } }
          ]
        }
        break
    }

    console.log('📋 MongoDB Query:', JSON.stringify(query, null, 2))

    const paymentProofs = await Order.find(query)
      .sort({ createdAt: -1 })
      .select('orderNumber customerInfo totalAmount paymentMethod bankDetails paymentProof status createdAt')
      .lean()

    console.log(`✅ Found ${paymentProofs.length} payment proofs`)

    // Log each proof for debugging
    paymentProofs.forEach((proof, index) => {
      console.log(`📸 Proof ${index + 1}:`, {
        orderNumber: proof.orderNumber,
        hasPaymentProof: !!proof.paymentProof,
        imageUrl: proof.paymentProof?.imageUrl,
        verified: proof.paymentProof?.verified,
        status: proof.status
      })
    })

    return NextResponse.json({ 
      paymentProofs,
      count: paymentProofs.length,
      filter 
    })

  } catch (error: any) {
    console.error('❌ Payment proofs fetch error:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch payment proofs' }, { status: 500 })
  }
}