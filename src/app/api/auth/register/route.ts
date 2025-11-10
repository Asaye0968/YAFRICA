// // src/app/api/auth/register/route.ts
// import { NextResponse } from 'next/server'
// import connectMongo from '@/lib/mongodb'
// import User from '@/models/User'
// import bcrypt from 'bcryptjs'

// export async function POST(req: Request) {
//   try {
//     await connectMongo()

//     const { name, email, password, phone, role, storeName, address, paymentMethod } = await req.json()
    
//     if (!name || !email || !password) {
//       return NextResponse.json({ 
//         error: 'Name, email, and password are required' 
//       }, { status: 400 })
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase() })
//     if (existingUser) {
//       return NextResponse.json({ 
//         error: 'User already exists with this email' 
//       }, { status: 409 })
//     }

//     // Hash password
//     const passwordHash = await bcrypt.hash(password, 12)

//     // Create user with dynamic role
//     const userData: any = {
//       name,
//       email: email.toLowerCase(),
//       passwordHash,
//       phone: phone || '',
//       role: role || 'customer', // Use role from request, default to customer
//       status: 'active'
//     }

//     // Add seller-specific fields only if role is seller
//     if (role === 'seller') {
//       userData.storeName = storeName || ''
//       userData.address = address || ''
//       userData.paymentMethod = paymentMethod || ''
//     }

//     const user = await User.create(userData)

//     return NextResponse.json({
//       success: true,
//       message: `${role === 'seller' ? 'Seller' : 'User'} registered successfully`,
//       user: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         ...(role === 'seller' && { storeName: user.storeName })
//       }
//     }, { status: 201 })

//   } catch (err: any) {
//     console.error('Registration error:', err)
//     return NextResponse.json({ 
//       error: 'Internal server error' 
//     }, { status: 500 })
//   }
// }
// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'
import { OTPService } from '@/lib/otpService'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await connectMongo()

    const { name, email, password, phone, role, storeName, address, paymentMethod, otp } = await req.json()
    
    // Enhanced validation
    if (!name || !email || !password || !otp || !phone) {
      return NextResponse.json({ 
        error: 'All fields including OTP are required' 
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 })
    }

    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json({ 
        error: 'Password must be at least 6 characters long' 
      }, { status: 400 })
    }

    // Phone validation (basic)
    if (phone.length < 10) {
      return NextResponse.json({ 
        error: 'Please enter a valid phone number' 
      }, { status: 400 })
    }

    // Verify OTP first (this will throw error if invalid)
    try {
      await OTPService.verifyOTP(email, otp, 'registration')
    } catch (otpError: any) {
      return NextResponse.json({ 
        error: otpError.message 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { phone: phone }
      ]
    })
    
    if (existingUser) {
      return NextResponse.json({ 
        error: 'User already exists with this email or phone number' 
      }, { status: 409 })
    }

    // Seller-specific validation
    if (role === 'seller') {
      if (!storeName || !address) {
        return NextResponse.json({ 
          error: 'Store name and address are required for seller accounts' 
        }, { status: 400 })
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const userData: any = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      phone: phone.trim(),
      role: role || 'customer',
      status: 'active',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add seller-specific fields
    if (role === 'seller') {
      userData.storeName = storeName.trim()
      userData.address = address.trim()
      userData.paymentMethod = paymentMethod?.trim() || ''
      userData.storeStatus = 'pending' // For admin review
    }

    const user = await User.create(userData)

    console.log(`New ${role} registered: ${email}`)

    return NextResponse.json({
      success: true,
      message: `${role === 'seller' ? 'Seller' : 'User'} registered successfully!`,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: true,
        ...(role === 'seller' && { 
          storeName: user.storeName,
          storeStatus: user.storeStatus 
        })
      }
    }, { status: 201 })

  } catch (err: any) {
    console.error('Registration error:', err)
    
    // More specific error handling
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error: any) => error.message)
      return NextResponse.json({ 
        error: `Invalid input: ${errors.join(', ')}` 
      }, { status: 400 })
    }
    
    if (err.code === 11000) {
      return NextResponse.json({ 
        error: 'User already exists with this email or phone number' 
      }, { status: 409 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 })
  }
}