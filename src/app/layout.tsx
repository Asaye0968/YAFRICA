// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'
import { WishlistProvider } from './contexts/WishlistContext'
import { CartProvider } from './contexts/CartContext'
import Footer from '@/components/Footer'
import ToastProvider from '@/components/ToastProvider'

export const metadata: Metadata = {
  title: 'Yafrican | Local Marketplace for Ethiopia',
  description: 'Discover and shop from local sellers in Ethiopia. Yafrican makes it easy to connect buyers and sellers.',
  keywords: 'ethiopia, marketplace, shopping, local sellers, online store',
  authors: [{ name: 'Yafrican Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-gray-900 antialiased w-full">
        <CartProvider>
          <WishlistProvider>
            {/* Navbar - Visible on all devices */}
            <Navbar />

            {/* Main Content */}
            <main className="w-full flex justify-center min-h-screen">
              <div className="w-full">
                {children}
              </div>
            </main>

            {/* Mobile Bottom Navigation - Only on mobile */}
            <MobileBottomNav />

            {/* Footer - Visible on all devices */}
            <Footer />
            <ToastProvider />

          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}