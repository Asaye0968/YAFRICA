// // src/lib/adminAuth.ts
// import { NextRequest } from 'next/server'
// import jwt from 'jsonwebtoken'
// import connectMongo from '@/lib/mongodb'
// import User from '@/models/User'

// const JWT_SECRET = process.env.JWT_SECRET!

// // Accept both NextRequest and regular Request
// export async function verifyAdmin(req: NextRequest | Request) {
//   try {
//     const cookieHeader = req.headers.get('cookie') || ''
    
//     // Check for both possible cookie names
//     const tokenMatch = cookieHeader.match(/token=([^;]+)/)
//     const authTokenMatch = cookieHeader.match(/authToken=([^;]+)/)
//     const token = tokenMatch ? tokenMatch[1] : (authTokenMatch ? authTokenMatch[1] : null)

//     if (!token) {
//       throw new Error('Not authenticated')
//     }

//     const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string }
    
//     await connectMongo()
//     const user = await User.findById(payload.id)
    
//     if (!user || user.role !== 'admin') {
//       throw new Error('Access denied')
//     }

//     // Remove status check or make it optional
//     // if (user.status !== 'active') {
//     //   throw new Error('Account suspended')
//     // }

//     return user
//   } catch (error: any) {
//     console.error('Admin auth error:', error.message)
//     throw new Error('Authentication failed')
//   }
// }
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export async function verifyAdmin(req: NextRequest) {
  try {
    await connectMongo()
    
    const cookieHeader = req.headers.get('cookie') || ''
    
    // Check for both possible cookie names
    const tokenMatch = cookieHeader.match(/token=([^;]+)/)
    const authTokenMatch = cookieHeader.match(/authToken=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : (authTokenMatch ? authTokenMatch[1] : null)

    if (!token) {
      throw new Error('Not authenticated')
    }

    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string }
    
    const user = await User.findById(payload.id)
    
    if (!user || user.role !== 'admin') {
      throw new Error('Access denied')
    }

    return user
  } catch (error: any) {
    console.error('Admin auth error:', error.message)
    throw new Error('Authentication failed')
  }
}