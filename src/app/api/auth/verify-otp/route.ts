// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server'
import { OTPService } from '@/lib/otpService'

export async function POST(req: Request) {
  try {
    const { email, otp, type = 'registration' } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ 
        error: 'Email and OTP are required' 
      }, { status: 400 })
    }

    // Basic OTP format validation
    const otpRegex = /^\d{6}$/
    if (!otpRegex.test(otp)) {
      return NextResponse.json({ 
        error: 'OTP must be a 6-digit number' 
      }, { status: 400 })
    }

    // Verify OTP but don't delete it (deleteAfterVerify: false)
    try {
      await OTPService.verifyOTP(email, otp, type, false)
      
      return NextResponse.json({ 
        success: true,
        message: 'Email verified successfully!',
        verified: true
      })

    } catch (otpError: any) {
      console.error('OTP verification failed:', otpError.message)
      
      // Return specific error messages
      let errorMessage = 'Invalid OTP'
      if (otpError.message.includes('expired')) {
        errorMessage = 'OTP has expired. Please request a new one.'
      } else if (otpError.message.includes('attempts')) {
        errorMessage = 'Too many failed attempts. Please request a new OTP.'
      } else if (otpError.message.includes('not found')) {
        errorMessage = 'OTP not found. Please request a new OTP.'
      }
      
      return NextResponse.json({ 
        error: errorMessage 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json({ 
      error: 'Failed to verify OTP. Please try again.' 
    }, { status: 500 })
  }
}