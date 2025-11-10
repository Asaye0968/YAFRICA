// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { OTPService } from '@/lib/otpService'

export async function POST(req: Request) {
  try {
    const { email, type = 'registration', name, role } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Generate and store OTP
    const otp = await OTPService.generateOTP(email, type)
    
    // Enhanced email template with personalized message
    const userType = role === 'seller' ? 'seller' : 'customer'
    const welcomeMessage = name 
      ? `Hi ${name}, thank you for registering as a ${userType} with Yafrican!`
      : `Thank you for registering with Yafrican!`

    // Send OTP via email
    try {
      await sendEmail({
        to: email,
        subject: 'Your Yafrican Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; background: linear-gradient(135deg, #f59e0b, #d97706); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Yafrican</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Email Verification</p>
            </div>
            
            <div style="padding: 30px 20px; text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 10px;">Verify Your Email Address</h2>
              <p style="color: #6b7280; margin-bottom: 15px; line-height: 1.6;">
                ${welcomeMessage} Use the verification code below to complete your registration:
              </p>
              
              ${role ? `<p style="color: #f59e0b; font-weight: bold; margin-bottom: 20px;">Account Type: ${role.charAt(0).toUpperCase() + role.slice(1)}</p>` : ''}
              
              <div style="background: #f8fafc; border: 2px dashed #f59e0b; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes. If you didn't request this, please ignore this email.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
              <p>Yafrican - Ethiopia's Fastest Growing Marketplace</p>
              <p>If you need help, contact our support team</p>
            </div>
          </div>
        `
      })

      console.log(`OTP sent to ${email} for ${userType} registration`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully to your email'
      })

    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 500 })
    }

  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 })
  }
}