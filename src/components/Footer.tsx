'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    if (isMounted) {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [isMounted])

  // Don't render footer on mobile
  if (!isDesktop) {
    return null
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-700" role="contentinfo" aria-label="Website footer">
      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4" aria-label="Yafrican Home">
              <div className="relative w-32 h-10 lg:w-40 lg:h-12">
                <Image
                  src="/logo.png"
                  alt="Yafrican Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            
            <p className="text-gray-300 mb-4 leading-relaxed text-xs lg:text-sm">
              Your trusted online marketplace for quality products at unbeatable prices. 
              We bring you the best shopping experience with fast delivery and excellent customer service.
            </p>
            
            <div className="flex items-center gap-2" aria-label="Social media links">
              {[
                {
                  name: 'Facebook',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )
                },
                {
                  name: 'Twitter',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )
                },
                {
                  name: 'Instagram',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.198-1.558-.75-.947-1.058-2.208-.805-3.48.252-1.272 1.061-2.349 2.22-2.96 1.159-.611 2.514-.611 3.673 0 1.159.611 1.968 1.688 2.22 2.96.253 1.272-.055 2.533-.805 3.48-.75.947-1.901 1.558-3.198 1.558zm7.718 1.622c-.472 0-.916-.118-1.305-.328-.389-.21-.705-.507-.927-.87-.222-.363-.342-.78-.342-1.224 0-.444.12-.861.342-1.224.222-.363.538-.66.927-.87.389-.21.833-.328 1.305-.328.472 0 .916.118 1.305.328.389.21.705.507.927.87.222.363.342.78.342 1.224 0 .444-.12.861-.342 1.224-.222.363-.538.66-.927.87-.389.21-.833.328-1.305.328z"/>
                    </svg>
                  )
                },
                {
                  name: 'LinkedIn',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-lg transition-all duration-200 group"
                  aria-label={`Follow us on ${social.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-bold text-base lg:text-lg mb-4 flex items-center gap-2">
              <ArrowRightIcon className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              Quick Links
            </h3>
            <ul className="space-y-2" role="list" aria-label="Quick navigation links">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'New Arrivals', href: '/products?new=true' },
                { name: 'Best Sellers', href: '/products?bestsellers=true' },
                // { name: 'Categories', href: '/categories' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group text-xs lg:text-sm"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-yellow-400 font-bold text-base lg:text-lg mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              Customer Service
            </h3>
            <ul className="space-y-2" role="list" aria-label="Customer service links">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns & Refunds', href: '/returns' },
                { name: 'FAQ', href: '/faq' },
                // { name: 'Track Order', href: '/track-order' },
                // { name: 'Size Guide', href: '/size-guide' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group text-xs lg:text-sm"
                    aria-label={`Customer service: ${link.name}`}
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-yellow-400 font-bold text-base lg:text-lg mb-4 flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              Contact Info
            </h3>
            <div className="space-y-3" role="list" aria-label="Contact information">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300 font-medium text-xs lg:text-sm">Address</p>
                  <p className="text-gray-400 text-xs">1000 Addis Ababa, Ethiopia</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300 font-medium text-xs lg:text-sm">Phone</p>
                  <a 
                    href="tel:+251911455768" 
                    className="text-gray-400 text-xs hover:text-yellow-400 transition-colors duration-200"
                    aria-label="Call us at +251 911 45 57 68"
                  >
                    +251 911 45 57 68
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300 font-medium text-xs lg:text-sm">Email</p>
                  <a 
                    href="mailto:support@yafrican.com" 
                    className="text-gray-400 text-xs hover:text-yellow-400 transition-colors duration-200"
                    aria-label="Email us at support@yafrican.com"
                  >
                    support@yafrican.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-gray-300 font-medium text-xs lg:text-sm">Live Chat</p>
                  <p className="text-gray-400 text-xs">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4" role="list" aria-label="Company trust badges">
            {[
              {
                icon: <TruckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" aria-hidden="true" />,
                title: 'Free Shipping',
                description: 'On orders over $50'
              },
              {
                icon: <ShieldCheckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" aria-hidden="true" />,
                title: 'Secure Payment',
                description: '100% Protected'
              },
              {
                icon: <CreditCardIcon className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" aria-hidden="true" />,
                title: 'Easy Returns',
                description: '30-Day Policy'
              },
              {
                icon: (
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Quality Guarantee',
                description: 'Premium Products'
              }
            ].map((badge, index) => (
              <div 
                key={index}
                className="text-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                role="listitem"
              >
                <div className="flex justify-center mb-1 lg:mb-2">
                  {badge.icon}
                </div>
                <h4 className="text-yellow-400 font-semibold text-xs mb-1">{badge.title}</h4>
                <p className="text-gray-400 text-xs">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 lg:gap-3">
            <div className="text-gray-400 text-xs text-center md:text-left order-2 md:order-1">
              <p>&copy; {currentYear} Yafrican. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 lg:gap-4 text-xs order-1 md:order-2 mb-2 md:mb-0">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'Sitemap', href: '/sitemap' }
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 whitespace-nowrap"
                  aria-label={`View ${link.name}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-gray-400 text-xs order-3" aria-label="Made by Yafrican Team">
              <span>Made with</span>
              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>by Yafrican Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}