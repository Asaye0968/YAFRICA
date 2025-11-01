'use client'

import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { FaSearch, FaHome, FaCompass } from 'react-icons/fa'

export default function NotFound() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const floatingVariants: Variants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const quickLinks = [
    {
      name: 'Home',
      href: '/',
      icon: FaHome,
      description: 'Return to homepage'
    },
    {
      name: 'Products',
      href: '/products',
      icon: FaCompass,
      description: 'Browse all products'
    },
    {
      name: 'Search',
      href: '/search',
      icon: FaSearch,
      description: 'Find what you need'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-200 dark:bg-yellow-900/30 rounded-full blur-3xl opacity-30"
            />
            <motion.div
              variants={floatingVariants}
              animate="float"
              transition={{ delay: 1 }}
              className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-200 dark:bg-amber-900/30 rounded-full blur-3xl opacity-30"
            />
            <motion.div
              variants={floatingVariants}
              animate="float"
              transition={{ delay: 2 }}
              className="absolute top-1/2 right-1/4 w-32 h-32 bg-gray-200 dark:bg-gray-700/50 rounded-full blur-3xl opacity-20"
            />
          </div>

          {/* Main content */}
          <div className="relative">
            {/* Animated 404 number */}
            <div className="relative mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: 0.2
                }}
                className="text-9xl sm:text-[12rem] font-black text-gray-300 dark:text-gray-700 select-none"
              >
                404
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ExclamationTriangleIcon className="w-32 h-32 text-yellow-500 dark:text-yellow-400" />
              </motion.div>
            </div>

            {/* Title and message */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Page Not Found
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Oops! The page you're looking for seems to have wandered off into the digital wilderness. 
              Let's get you back on track.
            </motion.p>

            {/* Quick action buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <Link
                href="/"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[200px]"
              >
                <HomeIcon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                Back to Homepage
                <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/50 group-hover:border-yellow-300 transition-colors duration-300" />
              </Link>

              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-500 text-gray-700 dark:text-gray-300 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[200px]"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
                Go Back
              </button>
            </motion.div>

            {/* Quick links section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Navigation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={link.href}
                        className="group block p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl mb-4 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors duration-300">
                            <IconComponent className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {link.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Search suggestion */}
            <motion.div
              variants={itemVariants}
              className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-center justify-center space-x-4">
                <FaSearch className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                  Can't find what you're looking for? Try our{' '}
                  <Link 
                    href="/search" 
                    className="underline hover:text-yellow-600 dark:hover:text-yellow-200 transition-colors"
                  >
                    advanced search
                  </Link>
                </p>
              </div>
            </motion.div>

            {/* Footer note */}
            <motion.div
              variants={itemVariants}
              className="mt-12 text-center"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                If you believe this is an error, please{' '}
                <Link 
                  href="/contact" 
                  className="text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 underline transition-colors"
                >
                  contact our support team
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}