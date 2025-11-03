'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWishlist } from '../app/contexts/WishlistContext'
import { useCart } from '../app/contexts/CartContext'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
// Remove this import since we're not using notifications in this component
// import { useNotification } from '@/app/contexts/NotificationContext'

interface NavItem {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  badge?: number
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()

  const navItems: NavItem[] = [
    {
      href: '/',
      icon: HomeIcon,
      label: 'Home',
      active: pathname === '/'
    },
    {
      href: '/search',
      icon: MagnifyingGlassIcon,
      label: 'Search',
      active: pathname.startsWith('/search')
    },
    {
      href: '/wishlist',
      icon: HeartIcon,
      label: 'Wishlist',
      badge: wishlistCount,
      active: pathname === '/wishlist'
    },
    {
      href: '/cart',
      icon: ShoppingBagIcon,
      label: 'Cart',
      badge: cartCount,
      active: pathname === '/cart'
    },
    {
      href: '/profile',
      icon: UserIcon,
      label: 'Profile',
      active: pathname === '/profile'
    }
  ]

  // REMOVED THE PROBLEMATIC CODE:
  // You were calling addNotification() directly in the component body
  // This would cause infinite re-renders and errors
  // Notifications should be triggered by user actions, not automatically

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 lg:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-4 flex-1 min-w-0 transition-colors duration-200 ${
                item.active 
                  ? 'text-yellow-400 bg-gray-800' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {/* Fixed: Check if badge exists AND is greater than 0 */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${
                    item.href === '/cart' 
                      ? 'bg-yellow-500 text-gray-900' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium truncate max-w-full">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}