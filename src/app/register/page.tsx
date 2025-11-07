'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaEye, FaEyeSlash, FaCheck, FaUser, FaStore } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '', // Only for sellers
    address: '',   // Only for sellers
    paymentMethod: '' // Only for sellers
  })
    const router = useRouter()

  const [role, setRole] = useState<'customer' | 'seller'>('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.name) {
      toast.error('Name is required')
      return setError('Name is required')
    }
    if (!formData.email) {
      toast.error('Email is required')
      return setError('Email is required')
    }
    if (!formData.phone) {
      toast.error('Phone number is required')
      return setError('Phone number is required')
    }
    if (!formData.password) {
      toast.error('Password is required')
      return setError('Password is required')
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return setError('Password must be at least 6 characters')
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return setError('Passwords do not match')
    }

    // Seller-specific validation
    if (role === 'seller') {
      if (!formData.storeName) {
        toast.error('Store name is required for sellers')
        return setError('Store name is required for sellers')
      }
      if (!formData.address) {
        toast.error('Address is required for sellers')
        return setError('Address is required for sellers')
      }
    }

    setLoading(true)
    
    // Show loading toast
    const loadingToast = toast.loading('Creating your account...')

    try {
      // Prepare data for API - only send relevant fields based on role
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role
      }

      // Add seller-specific fields only if role is seller
      if (role === 'seller') {
        Object.assign(submitData, {
          storeName: formData.storeName,
          address: formData.address,
          paymentMethod: formData.paymentMethod
        })
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        // Update loading toast to error
        toast.update(loadingToast, {
          render: data.error || 'Registration failed',
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        setError(data.error || 'Registration failed')
      } else {
        // Update loading toast to success
        toast.update(loadingToast, {
          render: `🎉 Successfully registered as ${role}!`,
          type: 'success',
          isLoading: false,
          autoClose: 5000
        })
        
        // Show additional success message
        toast.success(`Welcome to Yafrican! ${role === 'seller' ? 'Your seller account is ready.' : 'Start shopping now!'}`)
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          storeName: '',
          address: '',
          paymentMethod: ''
        })
        setRole('customer')
            router.push('/signin')

      }
      
    } catch (error) {
      console.error('Registration error:', error)
      // Update loading toast to error
      toast.update(loadingToast, {
        render: 'Something went wrong. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
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

  const sellerFieldsVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
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
              Join Ethiopia's Fastest Growing Marketplace
            </h2>
            <p className="text-lg text-amber-100 mb-8 leading-relaxed">
              Connect with millions of customers, grow your business, and be part of the e-commerce revolution in Ethiopia.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCheck className="text-yellow-400" />
                <span>Zero setup fees</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-yellow-400" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-yellow-400" />
                <span>24/7 customer support</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex space-x-8 text-center"
          >
            <div className='mb-16'>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-yellow-400">Active Sellers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-yellow-400">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-yellow-400">Success Rate</div>
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
              Join Ethiopia's fastest growing marketplace
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Join thousands of users on Yafrican
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                      role === 'customer'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 shadow-md scale-105'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-yellow-300'
                    }`}
                  >
                    <FaUser className={`mb-2 text-lg ${role === 'customer' ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className="font-semibold">Shop</span>
                    <p className="text-xs mt-1 opacity-75">As Customer</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('seller')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                      role === 'seller'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 shadow-md scale-105'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-yellow-300'
                    }`}
                  >
                    <FaStore className={`mb-2 text-lg ${role === 'seller' ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className="font-semibold">Sell</span>
                    <p className="text-xs mt-1 opacity-75">As Seller</p>
                  </button>
                </div>
              </motion.div>

              {/* Common Fields */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="+251 912 345 678"
                  required
                />
              </motion.div>

              {/* Seller-specific Fields with Smooth Animation */}
              <AnimatePresence>
                {role === 'seller' && (
                  <motion.div
                    key="seller-fields"
                    variants={sellerFieldsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6 overflow-hidden"
                  >
                    <motion.div variants={itemVariants}>
                      <label htmlFor="storeName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Store Name *
                      </label>
                      <input
                        id="storeName"
                        name="storeName"
                        type="text"
                        value={formData.storeName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Your store name"
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Business Address *
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Your business address"
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Payment Method
                      </label>
                      <input
                        id="paymentMethod"
                        name="paymentMethod"
                        type="text"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Bank transfer, Mobile money, etc."
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Fields */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  `Create ${role === 'seller' ? 'Seller' : 'Customer'} Account`
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
            {/* <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => toast.info('Google login coming soon!')}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
              </button>
              <button
                type="button"
                onClick={() => toast.info('Facebook login coming soon!')}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 text-blue-600 dark:text-blue-400"
              >
                <FaFacebook className="w-5 h-5" />
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </motion.div> */}

            {/* Sign In Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link href="/signin" className="text-yellow-500 font-semibold hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}