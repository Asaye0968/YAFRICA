import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

function getUserIdFromToken(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const tokenMatch = cookieHeader.match(/token=([^;]+)/)
  const token = tokenMatch ? tokenMatch[1] : null

  if (!token) throw new Error('Not authenticated')
  
  const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string }
  return payload.id
}

// GET user profile
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromToken(req)
    await connectMongo()

    const user = await User.findById(userId).select('-passwordHash')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        storeName: user.storeName,
        address: user.address,
        paymentMethod: user.paymentMethod,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error: any) {
    console.error('Profile fetch error:', error)
    
    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// UPDATE user profile
export async function PUT(req: Request) {
  try {
    const userId = getUserIdFromToken(req)
    await connectMongo()

    const data = await req.json()
    
    // Fields that can be updated
    const allowedFields = ['name', 'phone', 'storeName', 'address', 'paymentMethod']
    const updateData: any = {}
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    })

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })

  } catch (error: any) {
    console.error('Profile update error:', error)
    
    if (error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}