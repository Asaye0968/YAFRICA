import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET!

async function verifyAdmin(req: NextRequest) {
  try {
    await connectMongo()
    
    const cookieHeader = req.headers.get('cookie') || ''
    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : null

    if (!token) {
      throw new Error('No token provided')
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await User.findById(decoded.id)
    
    if (!user || user.role !== 'admin') {
      throw new Error('Access denied')
    }

    return user
  } catch (error) {
    throw new Error('Authentication failed')
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyAdmin(req)
    const { name, email, username, phone } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: user._id } 
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already taken' }, { status: 400 })
    }

    const updateData: any = {
      name,
      email,
      phone: phone || '',
      updatedAt: new Date()
    }

    if (username) {
      updateData.username = username
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true }
    )

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role
      },
      message: 'Profile updated successfully'
    })

  } catch (error: any) {
    if (error.message.includes('Authentication failed')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}