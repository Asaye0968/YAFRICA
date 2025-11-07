// 'use client'

// import { useRouter } from 'next/navigation'
// import { 
//   HeartIcon, 
//   ShoppingCartIcon, 
//   EyeIcon, 
//   TrashIcon,
//   ArrowLeftIcon,
//   ShoppingBagIcon
// } from '@heroicons/react/24/outline'
// import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
// import { useWishlist } from '../contexts/WishlistContext'

// export default function WishlistPage() {
//   const router = useRouter()
//   const { 
//     wishlistItems, 
//     wishlistCount, 
//     removeFromWishlist, 
//     clearWishlist,
//     moveToCart,
//     loading 
//   } = useWishlist()

//   const viewProduct = (product: any) => {
//     router.push(`/products/${product.slug || product._id}`)
//   }
//  const handleMoveToCart = (product: any) => {
//     moveToCart(product)
//     // Redirect to cart page after moving
//     router.push('/cart')
//   }
//   const totalValue = wishlistItems.reduce((sum, item) => {
//     const price = item.isOnSale && item.salePrice ? item.salePrice : item.price
//     return sum + price
//   }, 0)

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
//         <div className="max-w-8xl mx-auto px-4">
//           {/* Header Skeleton */}
//           <div className="text-center mb-12 animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
//           </div>

//           {/* Products Grid Skeleton */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
//                 <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>
//                 <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//                 <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
//                 <div className="h-10 bg-gray-300 rounded w-full"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
//       <div className="max-w-8xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-6 shadow-2xl">
//             <HeartSolidIcon className="w-10 h-10 text-white" />
//           </div>
          
//           <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
//             My Wishlist
//           </h1>
          
//           <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
//             {wishlistCount > 0 
//               ? `You have ${wishlistCount} item${wishlistCount > 1 ? 's' : ''} saved for later`
//               : 'Your wishlist is waiting to be filled with amazing products'
//             }
//           </p>

//           {/* Stats */}
//           {wishlistCount > 0 && (
//             <div className="flex justify-center items-center gap-6 mt-6">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
//                   {wishlistCount}
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Items</div>
//               </div>
//               <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {totalValue.toFixed(2)} Br
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         {wishlistCount > 0 && (
//           <div className="flex justify-between items-center mb-8">
//             <button
//               onClick={() => router.push('/')}
//               className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
//             >
//               <ArrowLeftIcon className="w-4 h-4" />
//               Continue Shopping
//             </button>

//             <button
//               onClick={clearWishlist}
//               className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               <TrashIcon className="w-5 h-5" />
//               Clear All
//             </button>
//           </div>
//         )}

//         {/* Wishlist Content */}
//         {wishlistCount === 0 ? (
//           // Empty State
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <HeartIcon className="w-16 h-16 text-gray-400" />
//               </div>
              
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                 Your Wishlist is Empty
//               </h2>
              
//               <p className="text-gray-600 dark:text-gray-400 mb-8">
//                 Start exploring our products and add your favorites to the wishlist for easy access later.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <button
//                   onClick={() => router.push('/')}
//                   className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
//           // Wishlist Items Grid
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {wishlistItems.map((product) => {
//               const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
//               const originalPrice = product.isOnSale ? product.price : null
//               const isOutOfStock = product.stock === 0

//               return (
//                 <div
//                   key={product._id}
//                   className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden"
//                 >
//                   {/* Badges */}
//                   <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
//                     {product.isNew && (
//                       <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                         NEW
//                       </span>
//                     )}
//                     {product.isOnSale && (
//                       <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                         SALE
//                       </span>
//                     )}
//                     {isOutOfStock && (
//                       <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                         OUT OF STOCK
//                       </span>
//                     )}
//                     {product.isDemo && (
//                       <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                         DEMO
//                       </span>
//                     )}
//                   </div>

//                   {/* Remove Button */}
//                   <button
//                     onClick={() => removeFromWishlist(product._id)}
//                     className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20 group/remove"
//                   >
//                     <TrashIcon className="w-5 h-5 text-gray-400 group-hover/remove:text-red-500 transition-colors" />
//                   </button>

//                   {/* Product Image */}
//                   <div 
//                     className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-t-2xl relative cursor-pointer"
//                     onClick={() => viewProduct(product)}
//                   >
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="object-contain h-full w-full transition-transform duration-500 group-hover:scale-110"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format'
//                       }}
//                     />
//                     {isOutOfStock && (
//                       <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
//                         <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold">
//                           Out of Stock
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-6 flex flex-col justify-between flex-1">
//                     <div className="space-y-3">
//                       {/* Category */}
//                       {product.category && (
//                         <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
//                           {product.category}
//                         </span>
//                       )}

//                       {/* Product Name */}
//                       <h3 
//                         className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-lg leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors cursor-pointer"
//                         onClick={() => viewProduct(product)}
//                       >
//                         {product.name}
//                       </h3>

//                       {/* Rating */}
//                       {product.rating && (
//                         <div className="flex items-center gap-1">
//                           <div className="flex text-yellow-400">
//                             {'★'.repeat(Math.floor(product.rating))}
//                             {'☆'.repeat(5 - Math.floor(product.rating))}
//                           </div>
//                           <span className="text-xs text-gray-500 dark:text-gray-400">
//                             ({product.reviewCount || 0})
//                           </span>
//                         </div>
//                       )}

//                       {/* Price */}
//                       <div className="flex items-center gap-2">
//                         <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
//                           {displayPrice.toFixed(2)} Br
//                         </span>
//                         {originalPrice && (
//                           <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
//                             {originalPrice.toFixed(2)} Br
//                           </span>
//                         )}
//                       </div>

//                       {/* Stock Indicator */}
//                       {product.stock !== undefined && product.stock > 0 && (
//                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                           {product.stock < 10 ? (
//                             <span className="text-orange-500 font-medium">Only {product.stock} left</span>
//                           ) : (
//                             <span className="text-green-500 font-medium">In Stock</span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="mt-6 space-y-3">
//                       <button
//                         onClick={() => viewProduct(product)}
//                         className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold group/view"
//                       >
//                         <EyeIcon className="w-4 h-4" />
//                         View Details
//                       </button>
                      
//                      {!isOutOfStock && (
//     <button 
//       className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 px-4 py-3 rounded-xl transition-all duration-200 font-medium group/cart"
//       onClick={() => handleMoveToCart(product)}
//     >
//       <ShoppingCartIcon className="w-4 h-4" />
//       Move to Cart
//     </button>
//   )}
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}

//         {/* Additional Features */}
//         {wishlistCount > 0 && (
//           <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
//               Wishlist Features
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <HeartSolidIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Save Favorites</h4>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   Keep track of products you love and want to purchase later
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <ShoppingCartIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
//                 </div>
//                 <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Add to Cart</h4>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   Move items directly to your cart when you're ready to buy
//                 </p>
//               </div>

//               <div className="text-center">
//                 <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Price Tracking</h4>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   Monitor price changes and get notified about sales
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// app/wishlist/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon, 
  TrashIcon,
  ArrowLeftIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlist } from '../contexts/WishlistContext'

export default function WishlistPage() {
  const router = useRouter()
  const { 
    wishlistItems, 
    wishlistCount, 
    removeFromWishlist, 
    clearWishlist,
    moveToCart,
    loading 
  } = useWishlist()

  const viewProduct = (product: any) => {
    router.push(`/products/${product.slug || product._id}`)
  }

  const handleMoveToCart = (product: any) => {
    moveToCart(product)
    // Optional: Redirect to cart page after moving
    // router.push('/cart')
  }

  const totalValue = wishlistItems.reduce((sum, item) => {
    const price = item.isOnSale && item.salePrice ? item.salePrice : item.price
    return sum + price
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-8xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-8xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-6 shadow-2xl">
            <HeartSolidIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            My Wishlist
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {wishlistCount > 0 
              ? `You have ${wishlistCount} item${wishlistCount > 1 ? 's' : ''} saved for later`
              : 'Your wishlist is waiting to be filled with amazing products'
            }
          </p>

          {/* Stats */}
          {wishlistCount > 0 && (
            <div className="flex justify-center items-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {wishlistCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Items</div>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalValue.toFixed(2)} Br
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {wishlistCount > 0 && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Continue Shopping
            </button>

            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <TrashIcon className="w-5 h-5" />
              Clear All
            </button>
          </div>
        )}

        {/* Wishlist Content */}
        {wishlistCount === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-16 h-16 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Wishlist is Empty
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start exploring our products and add your favorites to the wishlist for easy access later.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
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
          // Wishlist Items Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => {
              const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
              const originalPrice = product.isOnSale ? product.price : null
              const isOutOfStock = product.stock === 0

              return (
                <div
                  key={product._id}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        NEW
                      </span>
                    )}
                    {product.isOnSale && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        SALE
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        OUT OF STOCK
                      </span>
                    )}
                    {product.isDemo && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        DEMO
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/20 group/remove"
                  >
                    <TrashIcon className="w-5 h-5 text-gray-400 group-hover/remove:text-red-500 transition-colors" />
                  </button>

                  {/* Product Image */}
                  <div 
                    className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-t-2xl relative cursor-pointer"
                    onClick={() => viewProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain h-full w-full transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format'
                      }}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                        <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-3">
                      {/* Category */}
                      {product.category && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                          {product.category}
                        </span>
                      )}

                      {/* Product Name */}
                      <h3 
                        className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-lg leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors cursor-pointer"
                        onClick={() => viewProduct(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                          {displayPrice.toFixed(2)} Br
                        </span>
                        {originalPrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {originalPrice.toFixed(2)} Br
                          </span>
                        )}
                      </div>

                      {/* Stock Indicator */}
                      {product.stock !== undefined && product.stock > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.stock < 10 ? (
                            <span className="text-orange-500 font-medium">Only {product.stock} left</span>
                          ) : (
                            <span className="text-green-500 font-medium">In Stock</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={() => viewProduct(product)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold group/view"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {!isOutOfStock && (
                        <button 
                          className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 px-4 py-3 rounded-xl transition-all duration-200 font-medium group/cart"
                          onClick={() => handleMoveToCart(product)}
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Move to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Additional Features */}
        {wishlistCount > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Wishlist Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartSolidIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Save Favorites</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Keep track of products you love and want to purchase later
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCartIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Add to Cart</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Move items directly to your cart when you're ready to buy
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <EyeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Price Tracking</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Monitor price changes and get notified about sales
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}