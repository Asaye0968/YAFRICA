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
      expiresAt
    })
    
    return otp
  }

  static async verifyOTP(email: string, otp: string, type: string = 'registration') {
    await connectMongo()
    
    const otpRecord = await Otp.findOne({ 
      email, 
      type,
      expiresAt: { $gt: new Date() }
    })
    
    if (!otpRecord) {
      throw new Error('OTP not found or expired')
    }
    
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id })
      throw new Error('Too many failed attempts')
    }
    
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1
      await otpRecord.save()
      throw new Error('Invalid OTP')
    }
    
    // OTP verified successfully - delete it
    await Otp.deleteOne({ _id: otpRecord._id })
    
    return true
  }

  static async cleanupExpiredOTPs() {
    await connectMongo()
    await Otp.deleteMany({ expiresAt: { $lt: new Date() } })
  }
}