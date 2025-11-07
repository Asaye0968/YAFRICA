// 'use client'

// import { useRouter } from 'next/navigation'
// import { 
//   TrashIcon, 
//   PlusIcon, 
//   MinusIcon, 
//   ShoppingBagIcon,
//   ArrowLeftIcon,
//   TruckIcon,
//   ShieldCheckIcon,
//   ArrowPathIcon,
//   CreditCardIcon,
//   EyeIcon
// } from '@heroicons/react/24/outline'
// import { useCart } from '../contexts/CartContext'

// export default function CartPage() {
//   const router = useRouter()
//   const { 
//     cartItems, 
//     cartCount, 
//     removeFromCart, 
//     updateQuantity,
//     clearCart,
//     loading 
//   } = useCart()

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
//   }

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.08 // 8% tax
//   }

//   const calculateShipping = () => {
//     return calculateSubtotal() > 50 ? 0 : 9.99 // Free shipping over $50
//   }

//   const calculateTotal = () => {
//     return calculateSubtotal()  + calculateShipping()
//   }

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0)
//   }

//   // In your CartPage component, update the handleCheckout function:

// const handleCheckout = async () => {
//   if (cartItems.some(item => item.isDemo)) {
//     alert('This is a demo cart. Checkout functionality will be available with real products.')
//     return
//   }

//   // Check if user is logged in
//   try {
//     const response = await fetch('/api/auth/check', {
//       method: 'GET',
//       credentials: 'include'
//     })
    
//     const data = await response.json()
    
//     if (response.ok && data.loggedIn) {
//       // User is logged in, proceed to checkout
//       router.push('/checkout')
//     } else {
//       // User not logged in, redirect to signin with return URL
//       router.push(`/signin?returnUrl=${encodeURIComponent('/checkout')}`)
//     }
//   } catch (error) {
//     // If auth check fails, redirect to signin
//     router.push(`/signin?returnUrl=${encodeURIComponent('/checkout')}`)
//   }
// }

//   const continueShopping = () => {
//     router.push('/products')
//   }

//   const viewProduct = (product: any) => {
//     router.push(`/products/${product.slug || product.id}`)
//   }

//   const hasDemoItems = cartItems.some(item => item.isDemo)

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           {/* Header Skeleton */}
//           <div className="text-center mb-12 animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Cart Items Skeleton */}
//             <div className="flex-1 space-y-4">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
//                   <div className="flex gap-4">
//                     <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                       <div className="h-6 bg-gray-300 rounded w-1/2"></div>
//                       <div className="h-8 bg-gray-300 rounded w-32"></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary Skeleton */}
//             <div className="lg:w-96">
//               <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse space-y-4">
//                 <div className="h-6 bg-gray-300 rounded"></div>
//                 {[1, 2, 3, 4].map(i => (
//                   <div key={i} className="flex justify-between">
//                     <div className="h-4 bg-gray-300 rounded w-1/3"></div>
//                     <div className="h-4 bg-gray-300 rounded w-1/4"></div>
//                   </div>
//                 ))}
//                 <div className="h-12 bg-gray-300 rounded"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full mb-6 shadow-2xl">
//             <ShoppingBagIcon className="w-10 h-10 text-white" />
//           </div>
          
//           <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
//             Shopping Cart
//           </h1>
          
//           {hasDemoItems && (
//             <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 max-w-md mx-auto mb-6">
//               <div className="flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300">
//                 <span className="font-semibold">Demo Items in Cart</span>
//               </div>
//               <p className="text-purple-600 dark:text-purple-400 text-sm mt-1">
//                 Some items are for demonstration purposes
//               </p>
//             </div>
//           )}

//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             {cartCount === 0 
//               ? 'Your cart is empty' 
//               : `You have ${getTotalItems()} item${getTotalItems() !== 1 ? 's' : ''} in your cart`
//             }
//           </p>

//           {/* Stats */}
//           {cartCount > 0 && (
//             <div className="flex justify-center items-center gap-6 mt-6">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
//                   {getTotalItems()}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Items</div>
//               </div>
//               <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {calculateTotal().toFixed(2)} Br
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         {cartCount > 0 && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={continueShopping}
//               className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
//             >
//               <ArrowLeftIcon className="w-4 h-4" />
//               Continue Shopping
//             </button>

//             <button
//               onClick={clearCart}
//               className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <TrashIcon className="w-5 h-5" />
//               Clear Cart
//             </button>
//           </div>
//         )}

//         {cartCount === 0 ? (
//           // Empty State
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
//               </div>
              
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Your Cart is Empty
//               </h2>
              
//               <p className="text-gray-600 dark:text-gray-400 mb-8">
//                 Looks like you haven't added any items to your cart yet.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={continueShopping}
//                   className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   <ShoppingBagIcon className="w-5 h-5" />
//                   Explore Products
//                 </button>
                
//                 <button
//                   onClick={() => router.push('/products')}
//                   className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 px-8 py-4 rounded-xl transition-all duration-200 font-medium"
//                 >
//                   <EyeIcon className="w-5 h-5" />
//                   View All Products
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Cart Items */}
//             <div className="flex-1">
//               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//                 {/* Cart Header */}
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                       Cart Items ({getTotalItems()})
//                     </h2>
//                     <button
//                       onClick={continueShopping}
//                       className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium"
//                     >
//                       <ArrowLeftIcon className="w-4 h-4" />
//                       Continue Shopping
//                     </button>
//                   </div>
//                 </div>

//                 {/* Cart Items List */}
//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {cartItems.map((item) => {
//                     const isOutOfStock = item.stock === 0
//                     const canIncrease = item.quantity < item.stock

//                     return (
//                       <div key={item.id} className="p-6">
//                         <div className="flex flex-col sm:flex-row gap-4">
//                           {/* Product Image */}
//                           <div className="flex-shrink-0">
//                             <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer"
//                                  onClick={() => viewProduct(item)}>
//                               <img
//                                 src={item.image}
//                                 alt={item.name}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           </div>

//                           {/* Product Details */}
//                           <div className="flex-1 min-w-0">
//                             <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                               <div className="flex-1">
//                                 <h3 
//                                   className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-yellow-600 dark:hover:text-yellow-400"
//                                   onClick={() => viewProduct(item)}
//                                 >
//                                   {item.name}
//                                 </h3>
//                                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//                                   {item.category}
//                                 </p>
//                                 <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
//                                   ${item.price.toFixed(2)}
//                                 </p>
                                
//                                 {/* Badges */}
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   {item.isDemo && (
//                                     <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                                       DEMO
//                                     </span>
//                                   )}
//                                   {isOutOfStock ? (
//                                     <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                                       OUT OF STOCK
//                                     </span>
//                                   ) : (
//                                     <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                                       IN STOCK
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* Quantity Controls */}
//                               <div className="flex items-center gap-3">
//                                 <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
//                                   <button
//                                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                                     disabled={item.quantity <= 1}
//                                     className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                                   >
//                                     <MinusIcon className="w-4 h-4" />
//                                   </button>
                                  
//                                   <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
//                                     {item.quantity}
//                                   </span>
                                  
//                                   <button
//                                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                                     disabled={!canIncrease}
//                                     className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                                   >
//                                     <PlusIcon className="w-4 h-4" />
//                                   </button>
//                                 </div>

//                                 {/* Remove Button */}
//                                 <button
//                                   onClick={() => removeFromCart(item.id)}
//                                   className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
//                                 >
//                                   <TrashIcon className="w-5 h-5" />
//                                 </button>
//                               </div>
//                             </div>

//                             {/* Item Total */}
//                             <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                               <span className="text-gray-600 dark:text-gray-400">
//                                 Item Total:
//                               </span>
//                               <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
//                                 ${(item.price * item.quantity).toFixed(2)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>

//               {/* Trust Badges */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
//                   <TruckIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
//                   <h3 className="font-semibold text-gray-900 dark:text-white">Free Shipping</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">On orders over $50</p>
//                 </div>
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
//                   <ShieldCheckIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
//                   <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">100% protected</p>
//                 </div>
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
//                   <ArrowPathIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
//                   <h3 className="font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">30-day policy</p>
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="lg:w-96">
//               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//                   Order Summary
//                 </h2>

//                 {/* Summary Details */}
//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       ${calculateSubtotal().toFixed(2)}
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 dark:text-gray-400">Shipping</span>
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
//                     </span>
//                   </div>
                  
//                   {/* <div className="flex justify-between">
//                     <span className="text-gray-600 dark:text-gray-400">Tax</span>
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       ${calculateTax().toFixed(2)}
//                     </span>
//                   </div> */}
                  
//                   <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
//                     <div className="flex justify-between">
//                       <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
//                       <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
//                         ${calculateTotal().toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Checkout Button */}
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//                 >
//                   <CreditCardIcon className="w-5 h-5" />
//                   Proceed to Checkout
//                 </button>

//                 {/* Security Note */}
//                 <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
//                   🔒 Your payment information is secure and encrypted
//                 </p>

//                 {/* Demo Notice */}
//                 {hasDemoItems && (
//                   <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
//                     <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
//                       Demo items in cart. Checkout will be available with real products.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Promo Code */}
//               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
//                 <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//                   Have a Promo Code?
//                 </h3>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Enter promo code"
//                     className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                   />
//                   <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
//                     Apply
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
'use client'

import { useRouter } from 'next/navigation'
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingBagIcon,
  ArrowLeftIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CreditCardIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../contexts/CartContext'

export default function CartPage() {
  const router = useRouter()
  const { 
    cartItems, 
    cartCount, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    loading 
  } = useCart()

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 10 // Free shipping over 50, otherwise 10 Birr
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping()
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Helper function to format prices as whole numbers
  const formatPrice = (price: number) => {
    return Math.round(price)
  }

  const handleCheckout = async () => {
    // Check if user is logged in
    try {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok && data.loggedIn) {
        // User is logged in, proceed to checkout
        router.push('/checkout')
      } else {
        // User not logged in, redirect to signin with return URL
        router.push(`/signin?returnUrl=${encodeURIComponent('/checkout')}`)
      }
    } catch (error) {
      // If auth check fails, redirect to signin
      router.push(`/signin?returnUrl=${encodeURIComponent('/checkout')}`)
    }
  }

  const continueShopping = () => {
    router.push('/products')
  }

  const viewProduct = (product: any) => {
    router.push(`/products/${product.slug || product.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Skeleton */}
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Skeleton */}
            <div className="lg:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded"></div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                ))}
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full mb-6 shadow-2xl">
            <ShoppingBagIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            Shopping Cart
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {cartCount === 0 
              ? 'Your cart is empty' 
              : `You have ${getTotalItems()} item${getTotalItems() !== 1 ? 's' : ''} in your cart`
            }
          </p>

          {/* Stats */}
          {cartCount > 0 && (
            <div className="flex justify-center items-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {getTotalItems()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Items</div>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(calculateTotal())} Birr
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {cartCount > 0 && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={continueShopping}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Continue Shopping
            </button>

            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <TrashIcon className="w-5 h-5" />
              Clear Cart
            </button>
          </div>
        )}

        {cartCount === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Cart is Empty
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={continueShopping}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  Explore Products
                </button>
                
                <button
                  onClick={() => router.push('/products')}
                  className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 px-8 py-4 rounded-xl transition-all duration-200 font-medium"
                >
                  <EyeIcon className="w-5 h-5" />
                  View All Products
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Cart Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Cart Items ({getTotalItems()})
                    </h2>
                    <button
                      onClick={continueShopping}
                      className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Continue Shopping
                    </button>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => {
                    const isOutOfStock = item.stock === 0
                    const canIncrease = item.quantity < item.stock

                    return (
                      <div key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-pointer"
                                 onClick={() => viewProduct(item)}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                <h3 
                                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-yellow-600 dark:hover:text-yellow-400"
                                  onClick={() => viewProduct(item)}
                                >
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                  {item.category}
                                </p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                  {formatPrice(item.price)} Birr
                                </p>
                                
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {isOutOfStock ? (
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      OUT OF STOCK
                                    </span>
                                  ) : (
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      IN STOCK
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  
                                  <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                    {item.quantity}
                                  </span>
                                  
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={!canIncrease}
                                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-gray-600 dark:text-gray-400">
                                Item Total:
                              </span>
                              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                {formatPrice(item.price * item.quantity)} Birr
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
                  <TruckIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Free Shipping</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">On orders over 50 Birr</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
                  <ShieldCheckIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">100% protected</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center border border-gray-200 dark:border-gray-700">
                  <ArrowPathIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">30-day policy</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(calculateSubtotal())} Birr
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {calculateShipping() === 0 ? 'FREE' : `${calculateShipping()} Birr`}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {formatPrice(calculateTotal())} Birr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CreditCardIcon className="w-5 h-5" />
                  Proceed to Checkout
                </button>

                {/* Security Note */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>

              {/* Promo Code */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Have a Promo Code?
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}