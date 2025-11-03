import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'
import { WishlistProvider } from './contexts/WishlistContext'
import { CartProvider } from './contexts/CartContext'
import Footer from '@/components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata: Metadata = {
  title: 'Yafrican | Local Marketplace for Ethiopia',
  description: 'Discover and shop from local sellers in Ethiopia. Yafrican makes it easy to connect buyers and sellers.',
  // ... rest of your metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased w-full">
        <CartProvider>
          <WishlistProvider>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="w-full flex justify-center">
              <div className="w-full">
                {children}
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />

            {/* Footer */}
            <Footer />

            {/* React Toastify Container */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}