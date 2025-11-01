import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
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
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await User.findByIdAndUpdate(user._id, {
      passwordHash: hashedPassword,
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully'
    })

  } catch (error: any) {
    if (error.message.includes('Authentication failed')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}