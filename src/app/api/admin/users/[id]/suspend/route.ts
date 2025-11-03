// src/app/api/admin/users/[id]/suspend/route.ts
import { NextRequest, NextResponse } from 'next/server' // ✅ Import NextRequest
import { verifyAdmin } from '@/lib/adminAuth'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(
  req: NextRequest, // ✅ Change from Request to NextRequest
  { params }: { params: Promise<{ id: string }> } // ✅ Add Promise wrapper
) {
  try {
    await verifyAdmin(req) // ✅ Remove 'as any' casting
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

    // Prevent suspending other admins
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot suspend other admin users' },
        { status: 403 }
      )
    }

    user.status = 'suspended'
    user.updatedAt = new Date()
    await user.save()

    return NextResponse.json({
      success: true,
      message: 'User suspended successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    })
  } catch (error: any) {
    console.error('User suspension error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' }, 
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}

// // src/app/api/admin/users/[id]/suspend/route.ts
// import { NextResponse } from 'next/server'
// import { verifyAdmin } from '@/lib/adminAuth'
// import connectMongo from '@/lib/mongodb'
// import User from '@/models/User'

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await verifyAdmin(req as any)
//     await connectMongo()

//     const user = await User.findById(params.id)
//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       )
//     }

//     // Prevent suspending other admins
//     if (user.role === 'admin') {
//       return NextResponse.json(
//         { error: 'Cannot suspend other admin users' },
//         { status: 403 }
//       )
//     }

//     user.status = 'suspended'
//     user.updatedAt = new Date()
//     await user.save()

//     return NextResponse.json({
//       success: true,
//       message: 'User suspended successfully',
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         status: user.status
//       }
//     })
//   } catch (error: any) {
//     console.error('User suspension error:', error)
//     return NextResponse.json(
//       { error: error.message || 'Server error' }, 
//       { status: error.message === 'Authentication failed' ? 401 : 500 }
//     )
//   }
// }