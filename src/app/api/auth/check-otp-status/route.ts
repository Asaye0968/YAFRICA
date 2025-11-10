// app/api/auth/check-otp-status/route.ts
import { NextResponse } from 'next/server'
import { OTPService } from '@/lib/otpService'

export async function POST(req: Request) {
  try {
    const { email, type = 'registration' } = await req.json()

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 })
    }

    const status = await OTPService.getOTPStatus(email, type)
    
    return NextResponse.json(status)

  } catch (error) {
    console.error('OTP status check error:', error)
    return NextResponse.json({ 
      exists: false,
      error: 'Failed to check OTP status' 
    }, { status: 500 })
  }
}