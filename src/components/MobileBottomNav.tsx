// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { 
//   HomeIcon, 
//   MagnifyingGlassIcon, 
//   ShoppingBagIcon, 
//   UserIcon,
//   HeartIcon 
// } from '@heroicons/react/24/outline'
// import { useWishlist } from '../app/contexts/WishlistContext'
//  import { useCart } from '../app/contexts/CartContext' // Fixed import path

// export default function MobileBottomNav() {
//   const pathname = usePathname()
//   const { cartCount } = useCart()
//   const { wishlistCount } = useWishlist()

//   const navItems = [
//     {
//       href: '/',
//       icon: HomeIcon,
//       label: 'Home',
//       active: pathname === '/'
//     },
//     {
//       href: '/search',
//       icon: MagnifyingGlassIcon,
//       label: 'Search',
//       active: pathname === '/search'
//     },
//     {
//       href: '/wishlist',
//       icon: HeartIcon,
//       label: 'Wishlist',
//       badge: wishlistCount,
//       active: pathname === '/wishlist'
//     },
//     {
//       href: '/cart',
//       icon: ShoppingBagIcon,
//       label: 'Cart',
//       badge: cartCount,
//       active: pathname === '/cart'
//     },
//     {
//       href: '/profile',
//       icon: UserIcon,
//       label: 'Profile',
//       active: pathname === '/profile'
//     }
//   ]

//   return (
//     <>
//       {/* Spacer to prevent content from being hidden behind bottom nav */}
//       <div className="md:hidden h-16" />
      
//       {/* Bottom Navigation */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-50 pb-safe">
//         <div className="flex justify-around items-center py-2">
//           {navItems.map((item) => {
//             const Icon = item.icon
//             const isActive = item.active
            
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 mx-1 ${
//                   isActive 
//                     ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' 
//                     : 'text-gray-500 hover:text-yellow-500 dark:text-gray-400'
//                 }`}
//               >
//                 <div className="relative">
//                   <Icon className="w-6 h-6" />
//                   {item.badge > 0 && (
//                     <span className={`absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${
//                       item.href === '/cart' 
//                         ? 'bg-yellow-500 text-gray-900' 
//                         : 'bg-red-500 text-white'
//                     }`}>
//                       {item.badge > 9 ? '9+' : item.badge}
//                     </span>
//                   )}
//                 </div>
//                 <span className="text-xs mt-1 font-medium">{item.label}</span>
//               </Link>
//             )
//           })}
//         </div>
//       </div>
//     </>
//   )
// }