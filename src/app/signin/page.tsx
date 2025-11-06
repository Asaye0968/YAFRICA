'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon 
} from '@heroicons/react/24/outline'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaShieldAlt, FaRocket } from 'react-icons/fa'
import 'react-toastify/dist/ReactToastify.css'

// Move the main content to a separate component that uses useSearchParams
function SignInContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/'

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.loggedIn) {
        // User is already logged in, redirect to returnUrl or home
        window.location.href = returnUrl
      }
    } catch (error) {
      console.log('Auth check failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Clear any existing toasts
    toast.dismiss()

    try {
      console.log('🔐 Attempting login for:', email)
      console.log('🔐 Return URL:', returnUrl)
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
        credentials: 'include'
      })

      console.log('🔐 Login response status:', res.status)
      const data = await res.json()
      console.log('🔐 Login response data:', data)

      if (!res.ok) {
        // Show error toast
        toast.error(data.error || 'Login failed. Please check your credentials.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        setLoading(false)
        return
      }

      // Show success toast
      toast.success(`Welcome back, ${data.user.name || data.user.email}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

      console.log('✅ Login successful, user:', data.user)
      console.log('✅ Redirecting to:', returnUrl)
      
      // Small delay to show success message before redirect
      setTimeout(() => {
        // If there's a specific returnUrl, use it
        if (returnUrl && returnUrl !== '/') {
          window.location.href = returnUrl
        } else {
          // Otherwise use role-based redirect
          switch (data.user.role) {
            case 'admin':
              window.location.href = '/admin/dashboard'
              break
            case 'seller':
              window.location.href = '/seller/dashboard'
              break
            case 'customer':
            default:
              window.location.href = '/'
              break
          }
        }
      }, 1500)

    } catch (err: any) {
      console.error('❌ Login fetch error:', err)
      
      // Show network error toast
      toast.error('Network error. Please check your connection and try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    toast.info('Google login coming soon!', {
      position: "top-right",
      autoClose: 3000,
    })
  }

  const handleFacebookLogin = () => {
    toast.info('Facebook login coming soon!', {
      position: "top-right",
      autoClose: 3000,
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ marginTop: '60px' }} // Push down below any fixed headers
      />
      
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
          }}
        />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="text-3xl font-bold text-yellow-400 mb-8 inline-block">
              Yafrican
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md"
          >
            <h2 className="text-4xl font-bold mb-6">
              Welcome Back to Ethiopia's Marketplace
            </h2>
            <p className="text-lg text-amber-100 mb-8 leading-relaxed">
              Continue your journey with thousands of buyers and sellers. Access your personalized dashboard and manage your account.
            </p>
            
            {/* Show redirect notice if going to checkout */}
            {returnUrl === '/checkout' && (
              <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg">
                <p className="text-yellow-200 font-semibold">
                  🔄 After signing in, you'll be redirected to checkout to complete your purchase.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="text-yellow-400" />
                <span>Secure & encrypted login</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaRocket className="text-yellow-400" />
                <span>Fast access to your account</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserIcon className="w-5 h-5 text-yellow-400" />
                <span>Personalized experience</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex space-x-8 text-center"
          >
            <div>
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-yellow-400">Happy Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-yellow-400">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-yellow-400">Support</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form Section */}
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
              Welcome back to Ethiopia's marketplace
            </p>
            {/* Show redirect notice for mobile */}
            {returnUrl === '/checkout' && (
              <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-700 text-sm font-semibold">
                  🔄 After signing in, you'll be redirected to checkout
                </p>
              </div>
            )}
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to your Yafrican account
              </p>
              {/* Show redirect notice in form */}
              {returnUrl === '/checkout' && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Complete your purchase after signing in
                  </p>
                </div>
              )}
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <div className="flex items-center justify-between">
                <motion.div variants={itemVariants} className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium">
                    Forgot password?
                  </Link>
                </motion.div>
              </div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  returnUrl === '/checkout' ? 'Sign In & Continue to Checkout' : 'Sign In to Your Account'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">Or continue with</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 text-blue-600 dark:text-blue-400"
              >
                <FaFacebook className="w-5 h-5" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link 
                  href={returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register'} 
                  className="text-yellow-500 font-semibold hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                >
                  Create account
                </Link>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 underline">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Floating decorative elements for mobile */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="lg:hidden flex justify-center space-x-4 mt-8"
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}