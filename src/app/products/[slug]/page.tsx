'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import {
  PhoneIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ShoppingCartIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

type Product = {
  _id: string
  name: string
  description?: string
  price: number
  images: string[]
  slug: string
  category?: string
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
  stock?: number
  specifications?: Record<string, string>
  brand?: string
  sku?: string
  image?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist: checkWishlist } = useWishlist()
  
  const productSlug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const isInWishlist = product ? checkWishlist(product._id) : false

  // WhatsApp and Telegram utility functions
  const shareOnWhatsApp = (product: Product, phone: string, quantity: number, displayPrice: number) => {
    const message = `Hello! I would like to order:\n\n📦 *${product.name}*\n💰 Price: ${(displayPrice * quantity).toFixed(2)} Br\n🔢 Quantity: ${quantity}\n📞 My Phone: ${phone}\n\nPlease confirm my order. Thank you!`
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/251912610850?text=${encodedMessage}`
  }

  const shareOnTelegram = (product: Product, phone: string, quantity: number, displayPrice: number) => {
    const message = `Hello! I would like to order:\n\n📦 *${product.name}*\n💰 Price: ${(displayPrice * quantity).toFixed(2)} Br\n🔢 Quantity: ${quantity}\n📞 My Phone: ${phone}\n\nPlease confirm my order. Thank you!`
    const encodedMessage = encodeURIComponent(message)
    return `https://t.me/YafricanStore?text=${encodedMessage}`
  }

  // Product conversion functions for context compatibility
  const getCartProduct = (product: Product) => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    salePrice: product.salePrice,
    image: product.images?.[0] || product.image || '',
    stock: product.stock || 10,
    category: product.category || 'General',
  })

  const getWishlistProduct = (product: Product) => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.images?.[0] || product.image || '',
    slug: product.slug,
    category: product.category,
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    salePrice: product.salePrice,
    stock: product.stock,
  })

  useEffect(() => {
    if (!productSlug) {
      setError('No product specified in URL')
      setLoading(false)
      return
    }

    async function fetchProduct() {
      try {
        setLoading(true)
        setError('')
        
        const res = await fetch(`/api/products/${productSlug}`)
        
        if (res.ok) {
          const data = await res.json()
          const processedProduct: Product = {
            ...data,
            image: data.images?.[0] || '',
          }
          setProduct(processedProduct)
          
          // ✅ FIXED: Using toast instead of addNotification
          toast.success(`Product "${processedProduct.name}" loaded successfully!`)
        } else {
          throw new Error(`Product not found (${res.status})`)
        }
      } catch (err: any) {
        setError('Product not found. Please check the URL and try again.')
        // ✅ FIXED: Using toast instead of addNotification
        toast.error('Product not found. Please check the URL and try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productSlug]) // ✅ REMOVED: addNotification from dependencies

  // Recommendations tracking
  useEffect(() => {
    if (product) {
      // Track product view
      fetch('/api/products/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug: product.slug,
          action: 'view'
        }),
      }).catch(console.error)
    }
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    const cartProduct = getCartProduct(product)
    addToCart(cartProduct)
    toast.success(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleWishlistToggle = () => {
    if (!product) return
    if (isInWishlist) {
      removeFromWishlist(product._id)
      toast.info(`Removed ${product.name} from wishlist`)
    } else {
      const wishlistProduct = getWishlistProduct(product)
      addToWishlist(wishlistProduct)
      toast.success(`Added ${product.name} to wishlist!`)
    }
  }

  const handleOrderAction = () => {
    if (!product) return
    toast.success(`Order for ${product.name} received! We'll contact you at ${phone}.`)
  }

  const handlePhoneRequired = () => {
    toast.warning('Please enter your phone number to place an order')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1">
                <div className="w-full h-96 lg:h-[500px] bg-gray-300 rounded-2xl mb-4"></div>
                <div className="flex gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-20 h-20 bg-gray-300 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
              <p className="text-red-600 mb-6">The product you're looking for doesn't exist.</p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
  const isOutOfStock = product.stock === 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Products
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Image Gallery - MOBILE FIRST */}
          <div className="flex-1">
            {/* Main Image */}
            <div className="w-full h-80 sm:h-96 lg:h-[500px] bg-white rounded-2xl overflow-hidden flex justify-center items-center mb-4 border border-gray-200 shadow-sm">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg'
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-xl overflow-hidden transition-all ${
                      selectedImage === idx 
                        ? 'border-yellow-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-thumbnail.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info - MOBILE FIRST */}
          <div className="flex-1 space-y-6">
            {/* Product Header */}
            <div className="space-y-3">
              {product.category && (
                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
              )}
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    NEW
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    SALE
                  </span>
                )}
                {isOutOfStock && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    OUT OF STOCK
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {displayPrice.toFixed(2)} Br
                </span>
                {product.isOnSale && product.salePrice && (
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    {product.price.toFixed(2)} Br
                  </span>
                )}
              </div>
              {product.isOnSale && (
                <div className="text-green-600 font-semibold text-sm sm:text-base">
                  Save {(product.price - product.salePrice!).toFixed(2)} Br!
                </div>
              )}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className={`text-sm font-medium ${
                product.stock === 0 
                  ? 'text-red-600' 
                  : product.stock < 10 
                    ? 'text-orange-600' 
                    : 'text-green-600'
              }`}>
                {product.stock === 0 
                  ? 'Out of Stock' 
                  : product.stock < 10 
                    ? `Only ${product.stock} left in stock` 
                    : 'In Stock'
                }
              </div>
            )}

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {product.description}
              </p>
            </div>

            {/* Action Buttons - MOBILE OPTIMIZED */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      -
                    </button>
                    <span className="px-4 sm:px-6 py-2 border-x border-gray-300 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Action Buttons - MOBILE: ICONS, DESKTOP: TEXT */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isOutOfStock ? (
                  <>
                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Add to Cart"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">
                        Add to Cart - {(displayPrice * quantity).toFixed(2)} Br
                      </span>
                      <span className="sm:hidden">
                        Cart - {(displayPrice * quantity).toFixed(2)} Br
                      </span>
                    </button>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={handleWishlistToggle}
                      className="flex items-center justify-center gap-2 sm:gap-3 border-2 border-gray-300 hover:border-yellow-500 text-gray-700 hover:text-yellow-600 px-4 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-200 font-semibold hover:shadow-lg"
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isInWishlist ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                      <span className="hidden sm:inline">Wishlist</span>
                    </button>
                  </>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-4 sm:p-6 text-center">
                    <p className="text-gray-600 font-medium text-base sm:text-lg">
                      This product is currently out of stock
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">
                      Check back later or contact us for availability
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="font-medium text-sm sm:text-base">Free Shipping</span>
                <span className="text-xs sm:text-sm">Over 500 Br</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="font-medium text-sm sm:text-base">Warranty</span>
                <span className="text-xs sm:text-sm">2 Years</span>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Order Directly
              </h3>
              
              {/* Call Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleOrderAction}
                  className="flex items-center justify-center gap-2 sm:gap-3 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Call 0912 61 08 50</span>
                  <span className="sm:hidden">Call: 0912 61 08 50</span>
                </button>
                <button
                  onClick={handleOrderAction}
                  className="flex items-center justify-center gap-2 sm:gap-3 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Call 0929 92 22 89</span>
                  <span className="sm:hidden">Call: 0929 92 22 89</span>
                </button>
              </div>

              {/* Messaging Apps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => {
                    if (!phone) {
                      handlePhoneRequired()
                      return
                    }
                    window.open(shareOnTelegram(product, phone, quantity, displayPrice), '_blank')
                  }}
                  className="flex items-center justify-center gap-2 sm:gap-3 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Order on Telegram</span>
                  <span className="sm:hidden">Telegram</span>
                </button>
                <button
                  onClick={() => {
                    if (!phone) {
                      handlePhoneRequired()
                      return
                    }
                    window.open(shareOnWhatsApp(product, phone, quantity, displayPrice), '_blank')
                  }}
                  className="flex items-center justify-center gap-2 sm:gap-3 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Order on WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </button>
              </div>

              {/* Phone Order Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleOrderAction()
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-lg"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-colors whitespace-nowrap text-sm sm:text-lg"
                >
                  <span className="hidden sm:inline">Order by Phone</span>
                  <span className="sm:hidden">Phone Order</span>
                </button>
              </form>

              {/* Checkout Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    const cartProduct = getCartProduct(product)
                    addToCart(cartProduct)
                    router.push('/checkout')
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-lg shadow-lg hover:shadow-xl"
                >
                  <span className="hidden sm:inline">🛒 Proceed to Secure Checkout</span>
                  <span className="sm:hidden">🛒 Secure Checkout</span>
                </button>
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-3">
                  Secure payment • Multiple payment options • Fast delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Product Info Tabs */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
              {['description', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 sm:py-6 px-3 sm:px-4 border-b-2 font-semibold text-sm sm:text-lg capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'description' ? 'Description' : 'Specifications'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-8">
            {activeTab === 'description' && (
              <div className="prose prose-sm sm:prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 sm:py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-600 text-sm sm:text-base">{key}</span>
                    <span className="text-gray-900 text-right text-sm sm:text-base">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}