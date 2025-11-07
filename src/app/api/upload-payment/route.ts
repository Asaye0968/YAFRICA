// src/app/api/upload-payment/route.ts
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import Order from '@/models/Order'
import connectMongo from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('paymentProof') as File
    const orderNumber = formData.get('orderNumber') as string

    if (!file || !orderNumber) {
      return NextResponse.json({ error: 'File and order number are required' }, { status: 400 })
    }

    // Connect to database
    await connectMongo()

    // Check if order exists
    const existingOrder = await Order.findOne({ orderNumber })
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'payment-proofs')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'png'
    const filename = `${orderNumber}_${timestamp}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Create public URL for the image
    const imageUrl = `/uploads/payment-proofs/${filename}`

    // Update order with payment proof
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber },
      {
        $set: {
          'paymentProof.imageUrl': imageUrl,
          'paymentProof.uploadedAt': new Date(),
          'paymentProof.verified': false,
          status: 'pending'
        }
      },
      { new: true }
    )

    console.log('✅ Payment proof uploaded:', {
      orderNumber,
      imageUrl,
      fileSize: buffer.length
    })

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Payment proof uploaded successfully' 
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload payment proof' }, { status: 500 })
  }
}