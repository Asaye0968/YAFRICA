// 'use client'

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// type Product = {
//   _id: string
//   name: string
//   price: number
//   image: string
//   slug?: string
//   category?: string
//   rating?: number
//   reviewCount?: number
//   isNew?: boolean
//   isOnSale?: boolean
//   salePrice?: number
//   stock?: number
//   isDemo?: boolean
// }

// interface WishlistContextType {
//   wishlistItems: Product[]
//   wishlistCount: number
//   addToWishlist: (product: Product) => void
//   removeFromWishlist: (productId: string) => void
//   isInWishlist: (productId: string) => boolean
//   clearWishlist: () => void
//   moveToCart: (product: Product) => void
//   loading: boolean
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// export function WishlistProvider({ children }: { children: ReactNode }) {
//   const [wishlistItems, setWishlistItems] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)

//   // Load wishlist from localStorage on mount
//   useEffect(() => {
//     const loadWishlist = () => {
//       try {
//         const savedWishlist = localStorage.getItem('wishlist')
//         if (savedWishlist) {
//           const parsedWishlist = JSON.parse(savedWishlist)
//           setWishlistItems(Array.isArray(parsedWishlist) ? parsedWishlist : [])
//         }
//       } catch (error) {
//         console.error('Error loading wishlist from localStorage:', error)
//         setWishlistItems([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadWishlist()
//   }, [])

//   // Save wishlist to localStorage whenever it changes
//   useEffect(() => {
//     if (!loading) {
//       localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
//     }
//   }, [wishlistItems, loading])

//   const addToWishlist = (product: Product) => {
//     setWishlistItems(prev => {
//       // Check if product already exists
//       if (prev.some(item => item._id === product._id)) {
//         return prev
//       }
//       return [...prev, product]
//     })
//   }

//   const removeFromWishlist = (productId: string) => {
//     setWishlistItems(prev => prev.filter(item => item._id !== productId))
//   }

//   const isInWishlist = (productId: string) => {
//     return wishlistItems.some(item => item._id === productId)
//   }

//   const clearWishlist = () => {
//     setWishlistItems([])
//   }

//   const moveToCart = (product: Product) => {
//     // This would integrate with your cart context in a real app
//     console.log('Moving to cart:', product._id)
//     removeFromWishlist(product._id)
//     // Show success message
//     alert(`Added ${product.name} to cart!`)
//   }

//   const value = {
//     wishlistItems,
//     wishlistCount: wishlistItems.length,
//     addToWishlist,
//     removeFromWishlist,
//     isInWishlist,
//     clearWishlist,
//     moveToCart,
//     loading
//   }

//   return (
//     <WishlistContext.Provider value={value}>
//       {children}
//     </WishlistContext.Provider>
//   )
// }

// export function useWishlist() {
//   const context = useContext(WishlistContext)
//   if (context === undefined) {
//     throw new Error('useWishlist must be used within a WishlistProvider')
//   }
//   return context
// }

// app/contexts/WishlistContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useCart } from './CartContext'

type Product = {
  _id: string
  name: string
  price: number
  image: string
  slug?: string
  category?: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
  stock?: number
  isDemo?: boolean
}

interface WishlistContextType {
  wishlistItems: Product[]
  wishlistCount: number
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  moveToCart: (product: Product) => void
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist')
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist)
          setWishlistItems(Array.isArray(parsedWishlist) ? parsedWishlist : [])
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
        setWishlistItems([])
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, loading])

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      // Check if product already exists
      if (prev.some(item => item._id === product._id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item._id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item._id === productId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const moveToCart = (product: Product) => {
    // Convert wishlist product format to cart product format
    const cartProduct = {
      ...product,
      // Ensure we're using the correct ID field that CartContext expects
      id: product._id, // Map _id to id for CartContext
      price: product.isOnSale && product.salePrice ? product.salePrice : product.price
    }
    
    // Add to cart using CartContext
    addToCart(cartProduct)
    
    // Remove from wishlist
    removeFromWishlist(product._id)
    
    // Show success message
    alert(`Added ${product.name} to cart!`)
  }

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    moveToCart,
    loading
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}