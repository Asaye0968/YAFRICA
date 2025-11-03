// src/app/api/admin/users/[id]/activate/route.ts
import { NextRequest, NextResponse } from 'next/server' // ✅ Import NextRequest
import { verifyAdmin } from '@/lib/adminAuth'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(
  req: NextRequest, // ✅ Change from Request to NextRequest
  { params }: { params: Promise<{ id: string }> } // ✅ Add Promise wrapper
) {
  try {
    await verifyAdmin(req)
    await connectMongo()

    // ✅ FIX: Await the params in Next.js 15
    const { id } = await params

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    user.status = 'active'
    user.updatedAt = new Date()
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'User activated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })
  } catch (error: any) {
    console.error('User activation error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' }, 
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}