// lib/otpService.ts
import Otp from '@/models/Otp'
import connectMongo from './mongodb'

export class OTPService {
  static async generateOTP(email: string, type: string = 'registration') {
    await connectMongo()
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    // Delete any existing OTP for this email
    await Otp.deleteMany({ email, type })
    
    // Create new OTP
    const otpRecord = await Otp.create({
      email,
      otp,
      type,
      expiresAt,
      attempts: 0,
      verified: false // Add verified flag
    })
    
    console.log(`📱 OTP generated for ${email}: ${otp}, expires at: ${expiresAt}`)
    return otp
  }

  static async verifyOTP(email: string, otp: string, type: string = 'registration', deleteAfterVerify: boolean = true) {
    await connectMongo()
    
    const otpRecord = await Otp.findOne({ 
      email, 
      type,
      expiresAt: { $gt: new Date() }
    })
    
    if (!otpRecord) {
      console.log(`❌ OTP not found or expired for ${email}`)
      throw new Error('OTP not found or expired')
    }
    
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id })
      console.log(`❌ Too many attempts for ${email}`)
      throw new Error('Too many failed attempts')
    }
    
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1
      await otpRecord.save()
      console.log(`❌ Invalid OTP attempt for ${email}, attempts: ${otpRecord.attempts}`)
      throw new Error('Invalid OTP')
    }
    
    // Mark as verified instead of deleting immediately
    otpRecord.verified = true
    await otpRecord.save()
    
    console.log(`✅ OTP verified successfully for ${email}`)
    
    // Only delete if explicitly requested
    if (deleteAfterVerify) {
      await Otp.deleteOne({ _id: otpRecord._id })
      console.log(`🗑️ OTP deleted for ${email}`)
    }
    
    return true
  }

  static async cleanupExpiredOTPs() {
    await connectMongo()
    await Otp.deleteMany({ expiresAt: { $lt: new Date() } })
  }

  // Check if OTP exists and get remaining time
  static async getOTPStatus(email: string, type: string = 'registration') {
    await connectMongo()
    const otpRecord = await Otp.findOne({ 
      email, 
      type,
      expiresAt: { $gt: new Date() }
    })
    
    if (!otpRecord) {
      return { exists: false }
    }
    
    const remainingTime = otpRecord.expiresAt.getTime() - Date.now()
    const remainingMinutes = Math.ceil(remainingTime / (1000 * 60))
    
    return {
      exists: true,
      attempts: otpRecord.attempts,
      verified: otpRecord.verified,
      expiresAt: otpRecord.expiresAt,
      remainingMinutes,
      remainingSeconds: Math.ceil(remainingTime / 1000)
    }
  }

  // Delete OTP explicitly
  static async deleteOTP(email: string, type: string = 'registration') {
    await connectMongo()
    await Otp.deleteMany({ email, type })
    console.log(`🗑️ OTP deleted for ${email}`)
  }
}