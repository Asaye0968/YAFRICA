'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FaUserPlus, 
  FaBoxOpen, 
  FaShippingFast, 
  FaCreditCard,
  FaCheckCircle,
  FaChartLine,
  FaShieldAlt,
  FaGlobeAfrica
} from 'react-icons/fa'
import { 
  HiOutlineBadgeCheck, 
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineCash
} from 'react-icons/hi'

export default function SellPage() {
  const steps = [
    {
      icon: <FaUserPlus className="text-2xl" />,
      title: "Create Seller Account",
      description: "Register your business in minutes with basic details and verification.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <HiOutlineShoppingBag className="text-2xl" />,
      title: "List Your Products",
      description: "Upload products with high-quality images and detailed descriptions.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <HiOutlineTruck className="text-2xl" />,
      title: "Manage Orders & Shipping",
      description: "Track orders and coordinate nationwide delivery across Ethiopia.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <HiOutlineCash className="text-2xl" />,
      title: "Receive Payments",
      description: "Get paid securely through multiple trusted payment methods.",
            color: "from-blue-500 to-purple-500"

      // color: "from-purple-500 to-pink-500"
    }
  ]

  const features = [
    { icon: <FaChartLine />, text: "Grow Your Business" },
    { icon: <FaShieldAlt />, text: "Secure Platform" },
    { icon: <FaGlobeAfrica />, text: "Reach All Ethiopia" },
    { icon: <FaCheckCircle />, text: "Verified Sellers" }
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-12 pb-8"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-6"
          >
            <HiOutlineBadgeCheck className="text-purple-600" />
            <span className="text-purple-700 font-medium">Trusted E-commerce Platform</span>
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Sell on{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Yafrican
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join Ethiopia's fastest-growing marketplace. Reach millions of customers, 
            grow your business, and start selling with confidence.
          </motion.p>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Steps */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  x: 10
                }}
                className="group relative"
              >
                <div className="flex items-start space-x-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300">
                  {/* Step Number */}
                  <div className="flex-shrink-0 relative">
                    <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {index + 1}
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 -z-10" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 bg-gradient-to-r ${step.color} rounded-lg text-white shadow-md`}>
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-7 top-full w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent ml-3" />
                )}
              </motion.div>
            ))}

            {/* Features Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Visual & CTA */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">10K+</div>
                  <div className="text-sm text-gray-700">Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">500K+</div>
                  <div className="text-sm text-gray-700">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-700">Success Rate</div>
                </div>
              </div>

              {/* Visual Placeholder */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3">
                      <HiOutlineShoppingBag className="text-3xl text-purple-600" />
                    </div>
                    <div className="text-sm text-gray-600">Easy Listing</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3">
                      <FaShippingFast className="text-3xl text-purple-600" />
                    </div>
                    <div className="text-sm text-gray-600">Fast Shipping</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3">
                      <FaCreditCard className="text-3xl text-purple-600" />
                    </div>
                    <div className="text-sm text-gray-600">Secure Payments</div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mb-4"
                >
                  <Link href="/register">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Selling Today
                    </button>
                  </Link>
                </motion.div>
                
                <div className="text-gray-500 text-sm space-y-1">
                  <p>✓ No setup fees</p>
                  <p>✓ Commission-based pricing</p>
                  <p>✓ 24/7 seller support</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full shadow-lg"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}