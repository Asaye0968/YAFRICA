// app/register/verify-otp/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaEnvelope, FaArrowLeft, FaCheck, FaSpinner, FaRedo } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Create a separate component for the main content that uses useSearchParams
function VerifyOTPContent() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [email, setEmail] = useState('')
  const [registrationData, setRegistrationData] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Get email from URL params and registration data from sessionStorage
  useEffect(() => {
    const userEmail = searchParams.get('email')
    if (!userEmail) {
      toast.error('Invalid verification link')
      router.push('/register')
      return
    }
    setEmail(userEmail)
    
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData')
    if (!storedData) {
      toast.error('Registration data not found. Please start over.')
      router.push('/register')
      return
    }
    
    setRegistrationData(JSON.parse(storedData))
    setCountdown(60) // 1 minute cooldown for resend
  }, [searchParams, router])

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    if (!registrationData) {
      toast.error('Registration data missing')
      return
    }

    setLoading(true)
    try {
      // Call register API directly - it will handle OTP verification internally
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registrationData,
          otp: otp,
          email: email
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('🎉 Registration completed successfully!')
        
        // Clear stored data
        sessionStorage.removeItem('registrationData')
        
        // Redirect to signin
        setTimeout(() => {
          router.push(`/signin?verified=true&email=${encodeURIComponent(email)}`)
        }, 1500)
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to complete registration. Please try again.')
    }
    setLoading(false)
  }

  const resendOTP = async () => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown} seconds before resending`)
      return
    }

    setResendLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          name: registrationData?.name,
          role: registrationData?.role 
        })
      })

      const data = await res.json()

      if (res.ok) {
        setCountdown(60) // 1 minute cooldown for resend
        toast.success('📧 OTP resent to your email!')
      } else {
        toast.error(data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    }
    setResendLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:flex-1 relative bg-linear-to-br from-gray-900 via-gray-800 to-amber-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
          }}
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="text-2xl font-bold text-yellow-400 inline-block">
              Yafrican
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 mt-0">
              Complete Your Registration
            </h2>
            <p className="text-lg text-amber-100 mb-8 leading-relaxed">
              Verify your email address to create your {registrationData?.role === 'seller' ? 'seller' : 'customer'} account and start using Yafrican.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCheck className="text-yellow-400" />
                <span>Secure account verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-yellow-400" />
                <span>Instant access after verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-yellow-400" />
                <span>Protection against unauthorized access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-yellow-500">
              Yafrican
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Complete your registration
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            {/* Back Button */}
            <button
              onClick={() => router.push('/register')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 mb-6 transition-colors duration-300"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to registration</span>
            </button>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FaEnvelope className="w-8 h-8 text-yellow-500" />
              </motion.div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                We sent a verification code to
              </p>
              <p className="text-yellow-500 font-semibold text-lg break-all">{email}</p>
              
              {registrationData && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Registering as: <strong>{registrationData.role}</strong>
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Name: {registrationData.name}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleVerifyAndRegister} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Enter Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-lg font-mono tracking-widest"
                  placeholder="123456"
                  required
                  autoFocus
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Verify Button */}
              <motion.button
                type="submit"
                disabled={loading || otp.length !== 6}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-linear-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Completing Registration...</span>
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </motion.button>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={resendOTP}
                disabled={countdown > 0 || resendLoading}
                className="flex items-center justify-center space-x-2 mx-auto px-6 py-2 text-yellow-500 font-semibold hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-500 hover:border-yellow-600 rounded-lg"
              >
                {resendLoading ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaRedo className="w-4 h-4" />
                )}
                <span>
                  {countdown > 0 ? `Resend in ${formatTime(countdown)}` : 'Resend OTP'}
                </span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                💡 <strong>Tip:</strong> OTPs are valid for 10 minutes. Check spam folder if not in inbox.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function VerifyOTPLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading verification page...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<VerifyOTPLoading />}>
      <VerifyOTPContent />
    </Suspense>
  )
}