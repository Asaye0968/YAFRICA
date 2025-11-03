// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server' // ✅ Import NextRequest
import { verifyAdmin } from '@/lib/adminAuth'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'
import Product from '@/models/Product'

export async function DELETE(
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

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete other admin users' },
        { status: 403 }
      )
    }

    // If user is a seller, handle their products
    if (user.role === 'seller') {
      // Option 1: Delete all seller's products
      await Product.deleteMany({ sellerId: user._id })
      
      // Option 2: Orphan the products (set sellerId to null)
      // await Product.updateMany({ sellerId: user._id }, { sellerId: null })
    }

    await User.findByIdAndDelete(id) // ✅ Use the awaited id

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('User deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' }, 
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}
// // src/app/api/admin/users/[id]/route.ts
// import { NextResponse } from 'next/server'
// import { verifyAdmin } from '@/lib/adminAuth'
// import connectMongo from '@/lib/mongodb'
// import User from '@/models/User'
// import Product from '@/models/Product'

// export async function DELETE(
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

//     // Prevent deleting other admins
//     if (user.role === 'admin') {
//       return NextResponse.json(
//         { error: 'Cannot delete other admin users' },
//         { status: 403 }
//       )
//     }

//     // If user is a seller, handle their products
//     if (user.role === 'seller') {
//       // Option 1: Delete all seller's products
//       await Product.deleteMany({ sellerId: user._id })
      
//       // Option 2: Orphan the products (set sellerId to null)
//       // await Product.updateMany({ sellerId: user._id }, { sellerId: null })
//     }

//     await User.findByIdAndDelete(params.id)

//     return NextResponse.json({
//       success: true,
//       message: 'User deleted successfully'
//     })
//   } catch (error: any) {
//     console.error('User deletion error:', error)
//     return NextResponse.json(
//       { error: error.message || 'Server error' }, 
//       { status: error.message === 'Authentication failed' ? 401 : 500 }
//     )
//   }
// }