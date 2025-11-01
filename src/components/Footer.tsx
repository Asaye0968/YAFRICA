'use client'

import Link from 'next/link'
import Image from 'next/image'
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

  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <div className="relative w-40 h-12">
                <Image
                  src="/logo.png"
                  alt="Yafrican Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted online marketplace for quality products at unbeatable prices. 
              We bring you the best shopping experience with fast delivery and excellent customer service.
            </p>
            
            <div className="flex items-center gap-4">
              {/* Social Media Links */}
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-lg transition-all duration-200 group"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-lg transition-all duration-200 group"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-lg transition-all duration-200 group"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.198-1.558-.75-.947-1.058-2.208-.805-3.48.252-1.272 1.061-2.349 2.22-2.96 1.159-.611 2.514-.611 3.673 0 1.159.611 1.968 1.688 2.22 2.96.253 1.272-.055 2.533-.805 3.48-.75.947-1.901 1.558-3.198 1.558zm7.718 1.622c-.472 0-.916-.118-1.305-.328-.389-.21-.705-.507-.927-.87-.222-.363-.342-.78-.342-1.224 0-.444.12-.861.342-1.224.222-.363.538-.66.927-.87.389-.21.833-.328 1.305-.328.472 0 .916.118 1.305.328.389.21.705.507.927.87.222.363.342.78.342 1.224 0 .444-.12.861-.342 1.224-.222.363-.538.66-.927.87-.389.21-.833.328-1.305.328z"/>
                </svg>
              </a>
              
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-lg transition-all duration-200 group"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 flex items-center gap-2">
              <ArrowRightIcon className="w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'Hot Deals', href: '/deals' },
                { name: 'New Arrivals', href: '/products?new=true' },
                { name: 'Best Sellers', href: '/products?bestsellers=true' },
                { name: 'Categories', href: '/categories' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5" />
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Returns & Refunds', href: '/returns' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Track Order', href: '/track-order' },
                { name: 'Size Guide', href: '/size-guide' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-6 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Address</p>
                  <p className="text-gray-400 text-sm">1000 Addis Ababa,Ethiopia</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Phone</p>
                  <p className="text-gray-400 text-sm">+251 911 45 57 68</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Email</p>
                  <p className="text-gray-400 text-sm">support@yafrican.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <GlobeAltIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Live Chat</p>
                  <p className="text-gray-400 text-sm">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <TruckIcon className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="text-yellow-400 font-semibold text-sm mb-1">Free Shipping</h4>
              <p className="text-gray-400 text-xs">On orders over $50</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <ShieldCheckIcon className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="text-yellow-400 font-semibold text-sm mb-1">Secure Payment</h4>
              <p className="text-gray-400 text-xs">100% Protected</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <CreditCardIcon className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="text-yellow-400 font-semibold text-sm mb-1">Easy Returns</h4>
              <p className="text-gray-400 text-xs">30-Day Policy</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-yellow-400 font-semibold text-sm mb-1">Quality Guarantee</h4>
              <p className="text-gray-400 text-xs">Premium Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; {currentYear} Yafrican. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Sitemap
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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