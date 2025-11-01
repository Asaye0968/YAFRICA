'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  EyeIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlist } from '../contexts/WishlistContext'
import { getCategoryConfig, getAllCategories, getSubcategories } from '@/lib/categories'
import { useCart } from '../contexts/CartContext'

type Product = {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  slug?: string
  category?: string
  subcategory?: string
  description?: string
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
  stock?: number
  inStock?: boolean
  status?: string
  specifications?: {
    [key: string]: string | number | boolean
  }
  seller?: {
    name: string
    rating: number
  }
  createdAt?: string
  isDemo?: boolean
}

// Price range options like Jiji
const priceRanges = [
  { label: 'Under 1,000 Br', min: 0, max: 1000, count: 1277 },
  { label: '1,000 - 5,000 Br', min: 1000, max: 5000, count: 5108 },
  { label: '5,000 - 10,000 Br', min: 5000, max: 10000, count: 8514 },
  { label: '10,000 - 50,000 Br', min: 10000, max: 50000, count: 5321 },
  { label: 'More than 50,000 Br', min: 50000, max: 10000000, count: 1064 }
]

// Generate popular filters dynamically based on category and specifications
const generatePopularFilters = (category: string, subcategory: string) => {
  const config = getCategoryConfig(category, subcategory)
  if (!config) return []

  const popularFilters = []

  // Add common filters for all categories
  popularFilters.push(
    { label: 'New Items', field: 'condition', value: 'New', count: Math.floor(Math.random() * 1000) + 500 },
    { label: 'Like New', field: 'condition', value: 'Used - Like New', count: Math.floor(Math.random() * 800) + 300 }
  )

  // Add category-specific popular filters - COMPLETE FOR ALL CATEGORIES
  if (category === 'Electronics') {
    if (subcategory === 'Phones') {
      popularFilters.push(
        { label: 'Samsung', field: 'brand', value: 'Samsung', count: 4890 },
        { label: 'Apple', field: 'brand', value: 'Apple', count: 5678 },
        { label: 'Tecno', field: 'brand', value: 'Tecno', count: 6789 },
        { label: '6GB RAM', field: 'ram', value: '6GB', count: 4890 },
        { label: '8GB RAM', field: 'ram', value: '8GB', count: 5678 },
        { label: '128GB Storage', field: 'storage', value: '128GB', count: 6789 },
        { label: '256GB Storage', field: 'storage', value: '256GB', count: 3456 },
        { label: '6-7 inches', field: 'screenSize', value: '6-7"', count: 7890 },
        { label: 'Dual SIM', field: 'simType', value: 'Dual SIM', count: 6088 },
        { label: '5G Network', field: 'network', value: '5G', count: 4231 }
      )
    } else if (subcategory === 'Computers') {
      popularFilters.push(
        { label: 'Dell', field: 'brand', value: 'Dell', count: 4567 },
        { label: 'HP', field: 'brand', value: 'HP', count: 2345 },
        { label: '8GB RAM', field: 'ram', value: '8GB', count: 4567 },
        { label: '16GB RAM', field: 'ram', value: '16GB', count: 2345 },
        { label: '512GB Storage', field: 'storage', value: '512GB', count: 3456 },
        { label: '1TB Storage', field: 'storage', value: '1TB', count: 1234 },
        { label: 'Intel Core i5', field: 'processor', value: 'Intel Core i5', count: 5678 },
        { label: '15 inch Screen', field: 'screenSize', value: '15"', count: 4567 }
      )
    } else if (subcategory === 'TV & Audio') {
      popularFilters.push(
        { label: 'Samsung', field: 'brand', value: 'Samsung', count: 3456 },
        { label: 'LG', field: 'brand', value: 'LG', count: 2345 },
        { label: '55 inch', field: 'screenSize', value: '55"', count: 5678 },
        { label: '65 inch', field: 'screenSize', value: '65"', count: 3456 },
        { label: '4K UHD', field: 'displayType', value: '4K UHD', count: 7890 },
        { label: 'Smart TV', field: 'smartTV', value: 'Yes', count: 6789 }
      )
    } else if (subcategory === 'Cameras') {
      popularFilters.push(
        { label: 'DSLR', field: 'cameraType', value: 'DSLR', count: 2345 },
        { label: 'Mirrorless', field: 'cameraType', value: 'Mirrorless', count: 1890 },
        { label: 'Full Frame', field: 'sensorSize', value: 'Full Frame', count: 1567 }
      )
    } else if (subcategory === 'Gaming') {
      popularFilters.push(
        { label: 'PlayStation', field: 'consoleType', value: 'PlayStation', count: 3456 },
        { label: 'Xbox', field: 'consoleType', value: 'Xbox', count: 2789 },
        { label: '1TB Storage', field: 'storage', value: '1TB', count: 1890 }
      )
    }
  // Update the Clothing section in generatePopularFilters function - FIXED VERSION
} else if (category === 'Clothing') {
  // NO BRAND FILTERS FOR CLOTHING - only clothing specific filters
  if (subcategory === 'Men') {
    popularFilters.push(
      { label: 'Men T-Shirts', field: 'Men-clothingType', value: 'T-Shirt', count: 2456 }, // Fixed: use 'Men-clothingType'
      { label: 'Men Shirts', field: 'Men-clothingType', value: 'Shirt', count: 1890 }, // Fixed: use 'Men-clothingType'
      { label: 'Men Jeans', field: 'Men-clothingType', value: 'Jeans', count: 1678 }, // Fixed: use 'Men-clothingType'
      { label: 'Men Size M', field: 'Men-size', value: 'M', count: 3123 }, // Fixed: use 'Men-size'
      { label: 'Men Size L', field: 'Men-size', value: 'L', count: 2789 }, // Fixed: use 'Men-size'
      { label: 'Cotton Material', field: 'material', value: 'Cotton', count: 4521 },
      { label: 'Black Color', field: 'color', value: 'Black', count: 3890 }
    )
  } else if (subcategory === 'Women') {
    popularFilters.push(
      { label: 'Women Dresses', field: 'Women-clothingType', value: 'Dress', count: 3456 }, // Fixed: use 'Women-clothingType'
      { label: 'Women Blouses', field: 'Women-clothingType', value: 'Blouse', count: 2345 }, // Fixed: use 'Women-clothingType'
      { label: 'Women Skirts', field: 'Women-clothingType', value: 'Skirt', count: 1890 }, // Fixed: use 'Women-clothingType'
      { label: 'Women Size M', field: 'Women-size', value: 'M', count: 2987 }, // Fixed: use 'Women-size'
      { label: 'Women Size L', field: 'Women-size', value: 'L', count: 2456 }, // Fixed: use 'Women-size'
      { label: 'Silk Material', field: 'material', value: 'Silk', count: 1678 },
      { label: 'Red Color', field: 'color', value: 'Red', count: 2123 }
    )
  } else if (subcategory === 'Kids') {
    popularFilters.push(
      { label: 'Kids T-Shirts', field: 'Kids-clothingType', value: 'T-Shirt', count: 1890 }, // Fixed: use 'Kids-clothingType'
      { label: 'Kids Dresses', field: 'Kids-clothingType', value: 'Dress', count: 1567 }, // Fixed: use 'Kids-clothingType'
      { label: 'Kids Size 3-4Y', field: 'Kids-size', value: '3-4Y', count: 2345 }, // Fixed: use 'Kids-size'
      { label: 'Kids Size 5-6Y', field: 'Kids-size', value: '5-6Y', count: 1987 }, // Fixed: use 'Kids-size'
      { label: 'Cotton Material', field: 'material', value: 'Cotton', count: 3123 },
      { label: 'Blue Color', field: 'color', value: 'Blue', count: 1789 }
    )
  } else if (subcategory === 'Shoes') {
    popularFilters.push(
      { label: 'Sneakers', field: 'Shoes-type', value: 'Sneakers', count: 3456 }, // Fixed: use 'Shoes-type'
      { label: 'Sports Shoes', field: 'Shoes-type', value: 'Sports', count: 2789 }, // Fixed: use 'Shoes-type'
      { label: 'Formal Shoes', field: 'Shoes-type', value: 'Formal', count: 1890 }, // Fixed: use 'Shoes-type'
      { label: 'Size 40', field: 'Shoes-size', value: '40', count: 2345 }, // Fixed: use 'Shoes-size'
      { label: 'Size 42', field: 'Shoes-size', value: '42', count: 1987 }, // Fixed: use 'Shoes-size'
      { label: 'Leather Material', field: 'material', value: 'Leather', count: 2678 },
      { label: 'Black Color', field: 'color', value: 'Black', count: 3123 }
    )
  } else {
    // Generic clothing filters when no specific subcategory is selected
    popularFilters.push(
      { label: 'Cotton Material', field: 'material', value: 'Cotton', count: 4521 },
      { label: 'Size M', field: 'size', value: 'M', count: 3890 },
      { label: 'Size L', field: 'size', value: 'L', count: 3567 },
      { label: 'Black Color', field: 'color', value: 'Black', count: 5123 },
      { label: 'T-Shirt', field: 'clothingType', value: 'T-Shirt', count: 4231 },
      { label: 'Jeans', field: 'clothingType', value: 'Jeans', count: 3890 }
    )
  }

  } else if (category === 'Beauty & Health') {
    if (subcategory === 'Skincare') {
      popularFilters.push(
        { label: 'For Oily Skin', field: 'skinType', value: 'Oily', count: 2345 },
        { label: 'For Dry Skin', field: 'skinType', value: 'Dry', count: 1890 },
        { label: 'Moisturizer', field: 'productType', value: 'Moisturizer', count: 1567 }
      )
    } else if (subcategory === 'Makeup') {
      popularFilters.push(
        { label: 'Lipstick', field: 'makeupType', value: 'Lipstick', count: 2345 },
        { label: 'Foundation', field: 'makeupType', value: 'Foundation', count: 1890 }
      )
    } else if (subcategory === 'Hair Care') {
      popularFilters.push(
        { label: 'Shampoo', field: 'productType', value: 'Shampoo', count: 2345 },
        { label: 'For Curly Hair', field: 'hairType', value: 'Curly', count: 1890 }
      )
    }
  } else if (category === 'Home & Garden') {
    popularFilters.push(
      { label: 'Wood Material', field: 'material', value: 'Wood', count: 2345 },
      { label: 'Furniture', field: 'itemType', value: 'Furniture', count: 1890 },
      { label: 'Decor', field: 'itemType', value: 'Decor', count: 1567 }
    )
  } else if (category === 'Sports & Outdoors') {
    if (subcategory === 'Football') {
      popularFilters.push(
        { label: 'Football Shoes', field: 'equipmentType', value: 'Shoes', count: 2345 },
        { label: 'Jerseys', field: 'equipmentType', value: 'Jersey', count: 1890 },
        { label: 'Size M', field: 'size', value: 'M', count: 1567 }
      )
    } else if (subcategory === 'Basketball') {
      popularFilters.push(
        { label: 'Basketball Shoes', field: 'equipmentType', value: 'Shoes', count: 2123 },
        { label: 'Size L', field: 'size', value: 'L', count: 1789 }
      )
    } else if (subcategory === 'Fitness') {
      popularFilters.push(
        { label: 'Weights', field: 'equipmentType', value: 'Weights', count: 2345 },
        { label: 'Yoga Mats', field: 'equipmentType', value: 'Mats', count: 1890 }
      )
    }
  } else if (category === 'Toys & Games') {
    popularFilters.push(
      { label: '3-5 years', field: 'ageRange', value: '3-5 years', count: 2345 },
      { label: '6-8 years', field: 'ageRange', value: '6-8 years', count: 1890 },
      { label: 'Educational', field: 'toyType', value: 'Educational', count: 1567 },
      { label: 'Action Figures', field: 'toyType', value: 'Action Figures', count: 1456 }
    )
  } else if (category === 'Automotive') {
    popularFilters.push(
      { label: 'Toyota', field: 'brand', value: 'Toyota', count: 3456 },
      { label: 'Honda', field: 'brand', value: 'Honda', count: 2789 },
      { label: 'Petrol', field: 'fuelType', value: 'Petrol', count: 4567 },
      { label: 'Automatic', field: 'transmission', value: 'Automatic', count: 3345 },
      { label: 'SUV', field: 'vehicleType', value: 'SUV', count: 2890 }
    )
  } else if (category === 'Books & Media') {
    popularFilters.push(
      { label: 'Fiction', field: 'genre', value: 'Fiction', count: 2345 },
      { label: 'Educational', field: 'genre', value: 'Educational', count: 1890 },
      { label: 'Paperback', field: 'format', value: 'Paperback', count: 1567 },
      { label: 'Children Books', field: 'genre', value: 'Children', count: 1456 }
    )
  } else if (category === 'Jewelry & Accessories') {
    popularFilters.push(
      { label: 'Gold', field: 'material', value: 'Gold', count: 1234 },
      { label: 'Silver', field: 'material', value: 'Silver', count: 2345 },
      { label: 'Watches', field: 'itemType', value: 'Watch', count: 1890 },
      { label: 'Necklaces', field: 'itemType', value: 'Necklace', count: 1678 }
    )
  } else if (category === 'Food & Beverages') {
    popularFilters.push(
      { label: 'Snacks', field: 'productType', value: 'Snacks', count: 3456 },
      { label: 'Beverages', field: 'productType', value: 'Beverages', count: 2789 },
      { label: 'Local Brand', field: 'brand', value: 'Local Brand', count: 4567 },
      { label: 'Family Size', field: 'packageSize', value: 'Family Size', count: 2345 }
    )
  }

  return popularFilters
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name: A to Z' }
]

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { addToCart, cartItems, cartCount } = useCart() // Add this line

  // State for search and filters
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [usingDemoData, setUsingDemoData] = useState(false)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('')
  const [sortBy, setSortBy] = useState('relevance')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Advanced filter states - dynamically managed
  const [availableFilters, setAvailableFilters] = useState<{[key: string]: string[]}>({})
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({})
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  
  // Recommendation states
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [userId, setUserId] = useState<string>('')
  
  const [categorySpecifications, setCategorySpecifications] = useState<any>(null)
  const [openFilterSections, setOpenFilterSections] = useState<{[key: string]: boolean}>({
    price: true,
    popular: true,
    category: true
  })

  // Track previous category to detect changes
  const prevCategoryRef = useRef<string>('All Categories')

  // Debounce search to prevent too many requests
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }

  // Get all categories for dropdown
  const allCategories = getAllCategories()
  
  // Get subcategories for selected category
  const categorySubcategories = selectedCategory !== 'All Categories' 
    ? getSubcategories(selectedCategory)
    : []

  // Generate or get user ID for tracking
  useEffect(() => {
    const storedUserId = localStorage.getItem('recommendationUserId')
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('recommendationUserId', newUserId)
      setUserId(newUserId)
    }
  }, [])

  // Get initial search parameters from URL - FIXED: No reload on typing
  useEffect(() => {
    const query = searchParams?.get('q') || ''
    const category = searchParams?.get('category') || 'All Categories'
    const subcategory = searchParams?.get('subcategory') || ''
    
    setSearchQuery(query)
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    prevCategoryRef.current = category
    
    // Set search input value without causing reload
    if (searchInputRef.current) {
      searchInputRef.current.value = query
    }
  }, [searchParams])

  // Update category specifications when category changes - FIXED: Don't reset on subcategory change
  useEffect(() => {
    const currentCategory = selectedCategory
    const currentSubcategory = selectedSubcategory
    
    if (currentCategory && currentCategory !== 'All Categories') {
      const config = getCategoryConfig(currentCategory, currentSubcategory)
      setCategorySpecifications(config)
      
      // Only reset filters when main category changes, not subcategory
      if (prevCategoryRef.current !== currentCategory) {
        resetAllFilters()
        prevCategoryRef.current = currentCategory
      }
      
      // Initialize filter sections based on category
      initializeFilterSections(config)
    } else {
      setCategorySpecifications(null)
      resetAllFilters()
      setOpenFilterSections({ price: true, popular: true, category: true })
      prevCategoryRef.current = 'All Categories'
    }
  }, [selectedCategory, selectedSubcategory])

  // Handle category change - FIXED: Reset subcategory when main category changes
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    // Reset subcategory when main category changes
    if (newCategory !== selectedCategory) {
      setSelectedSubcategory('')
    }
  }

  // Handle subcategory change - FIXED: Don't trigger category reset
  const handleSubcategoryChange = (newSubcategory: string) => {
    setSelectedSubcategory(newSubcategory)
    // Update category specifications without resetting filters
    if (selectedCategory && selectedCategory !== 'All Categories') {
      const config = getCategoryConfig(selectedCategory, newSubcategory)
      setCategorySpecifications(config)
      initializeFilterSections(config)
    }
  }

  // Autocomplete search function
  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        setSuggestionLoading(true)
        const res = await fetch(`/api/products/autocomplete?q=${encodeURIComponent(query)}`)
        
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        } else {
          // Fallback suggestions if API fails
          const fallbackSuggestions = [
            'iPhone 15', 'Samsung Galaxy', 'Laptop', 'Smart TV', 'Running Shoes',
            'Winter Jacket', 'Makeup Kit', 'Football', 'Toy Car', 'Books'
          ].filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 6)
          
          setSuggestions(fallbackSuggestions)
          setShowSuggestions(true)
        }
      } catch (error) {
        console.log('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setSuggestionLoading(false)
      }
    }, 300),
    []
  )

  // Initialize filter sections based on category configuration
  const initializeFilterSections = (config: any) => {
    const sections: {[key: string]: boolean} = { 
      price: true, 
      popular: true, 
      category: true 
    }
    
    if (config?.filters) {
      config.filters.forEach((filter: any) => {
        sections[filter.fieldName] = false // Collapse by default
      })
    }
    
    setOpenFilterSections(sections)
  }

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedFilters({})
    setSelectedPriceRange('')
    setPriceRange({ min: 0, max: 10000 })
    setSelectedSubcategory('')
  }

  // Toggle filter section
  const toggleFilterSection = (section: string) => {
    setOpenFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Handle price range selection
  const handlePriceRangeSelect = (range: typeof priceRanges[0]) => {
    setSelectedPriceRange(range.label)
    setPriceRange({ min: range.min, max: range.max })
  }

  // Handle filter toggle - generic function for all filters
  const toggleFilter = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType] || []
      const newValues = currentValues.includes(value) 
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [filterType]: newValues
      }
    })
  }

  // Handle popular filter toggle
  const togglePopularFilter = (filter: any) => {
    toggleFilter(filter.field, filter.value)
  }

 // In your search page component - update the trackUserBehavior function
// In your search page - update the trackUserBehavior function
const trackUserBehavior = async (data: {
  searchQuery?: string
  category?: string
  subcategory?: string
  productId?: string
  action: 'search' | 'view'
}) => {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify(data),
    })
    
    // Handle both success and error responses gracefully
    if (!response.ok) {
      console.log('Tracking request failed, but continuing...')
      return
    }
    
    const result = await response.json()
    if (result.success) {
      console.log('✅ User behavior tracked')
    }
  } catch (error) {
    // Don't break the app if tracking fails
    console.log('Tracking failed, but continuing:', error)
  }
}

// Update the fetchRecommendations function
const fetchRecommendations = async () => {
  try {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'All Categories') params.set('category', selectedCategory)
    
    const res = await fetch(`/api/recommendations?${params.toString()}`, {
      headers: {
        'x-user-id': userId,
      },
    })
    
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations)
        setShowRecommendations(true)
        console.log(`✅ Loaded ${data.recommendations.length} recommendations`)
      } else {
        console.log('No recommendations available')
        setShowRecommendations(false)
      }
    }
  } catch (error) {
    console.log('Error fetching recommendations, hiding section:', error)
    setShowRecommendations(false)
  }
}
  // // Add this function to get recommendations
  // const fetchRecommendations = async () => {
  //   try {
  //     const params = new URLSearchParams()
  //     if (searchQuery) params.set('q', searchQuery)
  //     if (selectedCategory !== 'All Categories') params.set('category', selectedCategory)
      
  //     const res = await fetch(`/api/recommendations?${params.toString()}`, {
  //       headers: {
  //         'x-user-id': userId,
  //       },
  //     })
      
  //     if (res.ok) {
  //       const data = await res.json()
  //       if (data.success && data.recommendations && data.recommendations.length > 0) {
  //         setRecommendations(data.recommendations)
  //         setShowRecommendations(true)
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Error fetching recommendations:', error)
  //   }
  // }

  // Update product view tracking
  const handleProductView = (product: Product) => {
    trackUserBehavior({
      productId: product._id,
      action: 'view'
    })
    
    // Also track product view count
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

  // Update your product click handler
  const handleProductClick = (product: Product) => {
    handleProductView(product)
    const productSlug = product.slug || product._id
    router.push(`/products/${productSlug}`)
  }

  // Debounced search function - FIXED: No reload on typing
  const debouncedSearch = useCallback(
    debounce(async (searchParams: {
      searchQuery: string,
      selectedCategory: string,
      selectedSubcategory: string,
      priceRange: { min: number, max: number },
      selectedFilters: {[key: string]: string[]},
      sortBy: string
    }) => {
      try {
        setLoading(true)
        
        // Build query parameters
        const params = new URLSearchParams()
        if (searchParams.searchQuery) params.set('q', searchParams.searchQuery)
        if (searchParams.selectedCategory !== 'All Categories') params.set('category', searchParams.selectedCategory)
        if (searchParams.selectedSubcategory) params.set('subcategory', searchParams.selectedSubcategory)
        if (searchParams.priceRange.min > 0) params.set('minPrice', searchParams.priceRange.min.toString())
        if (searchParams.priceRange.max < 10000) params.set('maxPrice', searchParams.priceRange.max.toString())
        
        // Add all dynamic filters
        Object.entries(searchParams.selectedFilters).forEach(([filterType, values]) => {
          if (values.length > 0) {
            params.set(filterType, values.join(','))
          }
        })
        
        params.set('sortBy', getSortField(searchParams.sortBy))
        params.set('sortOrder', getSortOrder(searchParams.sortBy))

        console.log('🔄 Fetching products with advanced filters:', params.toString())
        
        const res = await fetch(`/api/products/search?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!res.ok) {
          console.warn(`API returned ${res.status}, using demo data`)
          throw new Error(`Failed to fetch products: ${res.status}`)
        }

        const data = await res.json()
        
        if (data.success && data.products && data.products.length > 0) {
          console.log(`✅ Loaded ${data.products.length} products with filters`)
          setProducts(data.products)
          setFilteredProducts(data.products)
          
          // Update available filters from API response
          if (data.filters) {
            const newAvailableFilters: {[key: string]: string[]} = {}
            
            Object.entries(data.filters).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                newAvailableFilters[key] = value.map((item: any) => 
                  typeof item === 'string' ? item : item.name
                )
              }
            })
            
            setAvailableFilters(newAvailableFilters)
          }
          
          setUsingDemoData(false)
        } else {
          console.log('📝 No products found with current filters')
          setProducts([])
          setFilteredProducts([])
          setUsingDemoData(false)
        }
      } catch (err: any) {
        console.log('🎭 Error fetching products:', err.message)
        setProducts([])
        setFilteredProducts([])
        setUsingDemoData(false)
      } finally {
        setLoading(false)
      }
    }, 500),
    []
  )

  // Fetch products with advanced filtering - FIXED: No reload on search input
  useEffect(() => {
    debouncedSearch({
      searchQuery,
      selectedCategory,
      selectedSubcategory,
      priceRange,
      selectedFilters,
      sortBy
    })
  }, [
    searchQuery, 
    selectedCategory, 
    selectedSubcategory, 
    priceRange, 
    selectedFilters, 
    sortBy,
    debouncedSearch
  ])

  // Update your search effect to track searches
  useEffect(() => {
    if (searchQuery && userId) {
      trackUserBehavior({
        searchQuery,
        category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
        subcategory: selectedSubcategory || undefined,
        action: 'search'
      })
      
      // Fetch recommendations after search
      setTimeout(fetchRecommendations, 1000)
    }
  }, [searchQuery, selectedCategory, selectedSubcategory, userId])

  // Helper functions for sorting
  const getSortField = (sort: string) => {
    switch (sort) {
      case 'price-low':
      case 'price-high':
        return 'price'
      case 'newest':
        return 'createdAt'
      case 'name':
        return 'name'
      default:
        return 'createdAt'
    }
  }

  const getSortOrder = (sort: string) => {
    switch (sort) {
      case 'price-low':
      case 'name':
        return 'asc'
      case 'price-high':
      case 'newest':
      case 'relevance':
      default:
        return 'desc'
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedSubcategory('')
    setPriceRange({ min: 0, max: 10000 })
    setSelectedPriceRange('')
    resetAllFilters()
    setSortBy('relevance')
    setShowSuggestions(false)
    setShowRecommendations(false)
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product)
    }
  }

  const handleProductAction = (product: Product, action: 'view' | 'cart') => {
    if (action === 'view') {
      handleProductClick(product)
    } else if (action === 'cart') {
      alert(`Added ${product.name} to cart!`)
    }
  }

  // Handle search input change - FIXED: No reload with autocomplete
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Fetch autocomplete suggestions
    fetchSuggestions(value)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    if (searchInputRef.current) {
      searchInputRef.current.value = suggestion
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calculate active filters count
  const activeFiltersCount = [
    searchQuery ? 1 : 0,
    selectedCategory !== 'All Categories' ? 1 : 0,
    selectedSubcategory ? 1 : 0,
    priceRange.min > 0 || priceRange.max < 10000 ? 1 : 0,
    ...Object.values(selectedFilters).map(filters => filters.length)
  ].reduce((a, b) => a + b, 0)

  // Filter section component
  const FilterSection = ({ 
    title, 
    sectionKey, 
    children, 
    defaultOpen = true 
  }: {
    title: string
    sectionKey: string
    children: React.ReactNode
    defaultOpen?: boolean
  }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
      <button
        onClick={() => toggleFilterSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        {openFilterSections[sectionKey] ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {openFilterSections[sectionKey] && (
        <div className="mt-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  )

  // Checkbox filter component
  const CheckboxFilter = ({
    items,
    selectedItems = [],
    onToggle,
    showCounts = false
  }: {
    items: string[]
    selectedItems?: string[]
    onToggle: (item: string) => void
    showCounts?: boolean
  }) => (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {items.map((item) => (
        <label key={item} className="flex items-center justify-between gap-3 cursor-pointer group">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => onToggle(item)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-yellow-600">
              {item}
            </span>
          </div>
          {showCounts && (
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {Math.floor(Math.random() * 1000) + 1}
            </span>
          )}
        </label>
      ))}
    </div>
  )

  // Autocomplete dropdown component
  const AutocompleteDropdown = () => {
    if (!showSuggestions || !searchQuery) return null

    return (
      <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
        {suggestionLoading ? (
          <div className="p-3 text-center text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              Loading suggestions...
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="p-3 text-center text-gray-500 dark:text-gray-400">
            No suggestions found for "{searchQuery}"
          </div>
        )}
      </div>
    )
  }

 // Render dynamic filters based on category - FIXED: Brand only shows in Electronics and unique keys
const renderDynamicFilters = () => {
  if (!categorySpecifications?.filters) return null

  // Create a Set to track unique field names
  const seenFieldNames = new Set()
  const uniqueFilters = []

  for (const filter of categorySpecifications.filters) {
    // Skip if we've already seen this field name
    if (seenFieldNames.has(filter.fieldName)) {
      continue
    }
    
    // Hide brand filter for non-electronics categories
    if (filter.fieldName === 'brand' && selectedCategory !== 'Electronics') {
      continue
    }

    const availableItems = availableFilters[filter.fieldName] || getFilterOptions(filter.fieldName, selectedCategory, selectedSubcategory)
    
    if (availableItems.length === 0) continue

    seenFieldNames.add(filter.fieldName)
    uniqueFilters.push(filter)
  }

  return uniqueFilters.map((filter: any) => {
    const availableItems = availableFilters[filter.fieldName] || getFilterOptions(filter.fieldName, selectedCategory, selectedSubcategory)
    const selectedItems = selectedFilters[filter.fieldName] || []

    return (
      <FilterSection 
        key={`${filter.fieldName}-${filter.label}`} // More unique key
        title={filter.label} 
        sectionKey={filter.fieldName}
        defaultOpen={false}
      >
        <CheckboxFilter
          items={availableItems}
          selectedItems={selectedItems}
          onToggle={(value) => toggleFilter(filter.fieldName, value)}
          showCounts={true}
        />
      </FilterSection>
    )
  })
}

  // Get filter options for specific fields - COMPLETE: All categories
  const getFilterOptions = (fieldName: string, category: string, subcategory: string): string[] => {
    const options: { [key: string]: string[] } = {
      // Electronics
      'ram': ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB'],
      'storage': ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
      'screenSize': ['< 5"', '5.1 - 5.5"', '5.6 - 6"', '6.1 - 6.5"', '6.6 - 6.8"', '> 6.8"'],
      'simType': ['Single SIM', 'Dual SIM', 'eSIM'],
      'network': ['2G', '3G', '4G', '5G'],
      'processor': ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1', 'Apple M2'],
      'displayType': ['LED', 'OLED', 'QLED', '4K UHD', '8K UHD', 'HD Ready', 'Full HD'],
      'smartTV': ['Yes', 'No'],
      'cameraType': ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera', 'Film Camera'],
      'sensorSize': ['Full Frame', 'APS-C', 'Micro Four Thirds', '1"'],
      'consoleType': ['PlayStation', 'Xbox', 'Nintendo Switch', 'Gaming PC'],
      
      // Common Electronics
      'brand': ['Samsung', 'Apple', 'Tecno', 'Infinix', 'Xiaomi', 'Oppo', 'Vivo', 'Huawei', 'Nokia', 'LG', 'Sony', 'Dell', 'HP', 'Canon', 'Nikon'],
      'condition': ['Brand New', 'Refurbished', 'Used', 'New', 'Used - Like New', 'Used - Good', 'Used - Fair'],
      'color': ['Black', 'White', 'Blue', 'Red', 'Green', 'Silver', 'Gold', 'Gray'],
      
      /// Clothing - generic (for when no subcategory is selected)
    'size': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'material': ['Cotton', 'Polyester', 'Silk', 'Wool', 'Denim', 'Linen', 'Leather'],
    'gender': ['Men', 'Women', 'Unisex', 'Kids'],
    'clothingType': ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Skirt', 'Jacket', 'Sweater'],
    'shoeType': ['Sneakers', 'Boots', 'Sandals', 'Formal', 'Sports', 'Casual'],
    
    // Clothing - prefixed versions (for subcategory-specific filtering)
    'Men-size': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Women-size': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    'Kids-size': ['Newborn', '0-3M', '3-6M', '6-12M', '1-2Y', '3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    'Shoes-size': ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    
    'Men-clothingType': ['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater', 'Underwear', 'Suit', 'Shorts'],
    'Women-clothingType': ['Dress', 'Skirt', 'Blouse', 'T-Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater'],
    'Kids-clothingType': ['T-Shirt', 'Dress', 'Pants', 'Shorts', 'Jacket', 'Sweater'],
    'Shoes-type': ['Sneakers', 'Boots', 'Sandals', 'Formal', 'Sports', 'Casual'],
      // Beauty & Health
      'skinType': ['All Skin Types', 'Dry', 'Oily', 'Combination', 'Sensitive'],
      'productType': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness', 'Personal Care'],
      'makeupType': ['Foundation', 'Lipstick', 'Eyeshadow', 'Mascara', 'Blush', 'Concealer'],
      'hairType': ['All Hair Types', 'Dry', 'Oily', 'Curly', 'Straight', 'Color-Treated'],
      'fragranceType': ['Perfume', 'Cologne', 'Body Spray', 'Essential Oil'],
      'scent': ['Floral', 'Woody', 'Fresh', 'Oriental', 'Fruity'],
      'wellnessType': ['Vitamins', 'Supplements', 'Fitness Equipment', 'Personal Care'],
      'benefit': ['Energy', 'Immunity', 'Weight Management', 'Beauty'],
      
      // Home & Garden
      'itemType': ['Furniture', 'Decor', 'Kitchenware', 'Garden Tool', 'Lighting', 'Storage'],
      'homeMaterial': ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Ceramic'],
      'furnitureType': ['Sofa', 'Bed', 'Table', 'Chair', 'Cabinet', 'Wardrobe', 'Shelf'],
      'decorType': ['Wall Art', 'Vases', 'Candles', 'Mirrors', 'Clocks', 'Rugs'],
      'style': ['Modern', 'Traditional', 'Minimalist', 'Bohemian'],
      'kitchenwareType': ['Cookware', 'Cutlery', 'Appliances', 'Storage', 'Serveware'],
      'gardenType': ['Tools', 'Plants', 'Furniture', 'Decor', 'Lighting'],
      
      // Sports & Outdoors
      'equipmentType': ['Shoes', 'Ball', 'Jersey', 'Gloves', 'Accessories', 'Clothing', 'Watches', 'Weights', 'Machines', 'Mats', 'Bicycle', 'Helmet', 'Tent', 'Sleeping Bag', 'Cooking', 'Lighting'],
      'sportType': ['Football', 'Basketball', 'Running', 'Fitness', 'Cycling', 'Swimming', 'Hiking', 'Camping'],
      'bikesType': ['Mountain', 'Road', 'Hybrid', 'Electric'],
      
      // Toys & Games
      'toyType': ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles', 'Outdoor Toys', 'Electronic Toys'],
      'ageRange': ['0-2 years', '3-5 years', '6-8 years', '9-12 years', '13+ years'],
      'dollType': ['Fashion', 'Baby', 'Action'],
      'players': ['2', '2-4', '4-6', '6+'],
      'subject': ['Math', 'Science', 'Language', 'Creative'],
      'pieces': ['< 50', '50-100', '100-500', '500-1000', '1000+'],
      'powerSource': ['Battery', 'Rechargeable', 'Solar'],
      
      // Automotive
      'vehicleType': ['Car', 'Motorcycle', 'Bicycle', 'Truck', 'SUV'],
      'fuelType': ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      'transmission': ['Manual', 'Automatic'],
      'bikeType': ['Sport', 'Cruiser', 'Off-road', 'Scooter'],
      'engineSize': ['< 125cc', '125-250cc', '250-500cc', '500-750cc', '750cc+'],
      'truckType': ['Pickup', 'Commercial', 'Heavy Duty'],
      'suvType': ['Compact', 'Mid-size', 'Full-size', 'Luxury'],
      'partType': ['Engine', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Interior'],
      
      // Books & Media
      'mediaType': ['Book', 'DVD', 'CD', 'Video Game', 'Magazine'],
      'genre': ['Fiction', 'Non-Fiction', 'Educational', 'Children', 'Science Fiction', 'Romance', 'Mystery', 'Action', 'Comedy', 'Drama', 'Horror'],
      'format': ['Paperback', 'Hardcover', 'Digital', 'Audio'],
      'musicGenre': ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Traditional'],
      'platform': ['PlayStation', 'Xbox', 'Nintendo', 'PC'],
      'category': ['News', 'Lifestyle', 'Sports', 'Entertainment', 'Educational'],
      'frequency': ['Weekly', 'Monthly', 'Quarterly'],
      'language': ['English', 'Amharic', 'French', 'Arabic', 'Other'],
      
      // Jewelry & Accessories
      'Jewelry-itemType': ['Necklace', 'Ring', 'Earrings', 'Bracelet', 'Watch', 'Bag', 'Sunglasses'],
      'Jewelry-material': ['Gold', 'Silver', 'Platinum', 'Stainless Steel', 'Leather', 'Fabric', 'Plastic', 'Titanium', 'Surgical Steel', 'Beaded'],
      'gemstone': ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'None'],
      'ringSize': ['4', '5', '6', '7', '8', '9', '10'],
      'earringType': ['Stud', 'Hoop', 'Drop', 'Huggie'],
      'braceletType': ['Chain', 'Bangle', 'Cuff', 'Charm'],
      'watchType': ['Analog', 'Digital', 'Smartwatch', 'Chronograph'],
      'bagType': ['Handbag', 'Backpack', 'Clutch', 'Tote', 'Crossbody'],
      'frameMaterial': ['Plastic', 'Metal', 'Acetate'],
      'lensType': ['Polarized', 'Mirrored', 'Gradient'],
      
      // Food & Beverages
      'productsType': ['Snacks', 'Beverages', 'Cooking Ingredients', 'Organic', 'International'],
      'snackType': ['Chips', 'Chocolate', 'Biscuits', 'Nuts', 'Dried Fruits'],
      'beverageType': ['Soft Drinks', 'Juice', 'Water', 'Energy Drinks', 'Tea', 'Coffee'],
      'ingredientType': ['Spices', 'Grains', 'Oils', 'Sauces', 'Flour'],
      'organicType': ['Fruits', 'Vegetables', 'Grains', 'Dairy'],
      'cuisine': ['Italian', 'Chinese', 'Indian', 'Mexican', 'Middle Eastern'],
      'packageSize': ['Small', 'Medium', 'Large', 'Family Size', '100g', '250g', '500g', '1kg', '5kg', '250ml', '500ml', '1L', '1.5L', '2L'],
      'storages': ['Room Temperature', 'Refrigerated', 'Frozen'],
      'certification': ['USDA', 'EU Organic', 'Local Certified']
    }
    
    return options[fieldName] || []
  }

  // Render popular filters for current category - COMPLETE: All categories
  const renderPopularFilters = () => {
    const popularFilters = generatePopularFilters(selectedCategory, selectedSubcategory)
    if (popularFilters.length === 0) return null

    return (
      <FilterSection title="Popular Filters" sectionKey="popular">
        <div className="space-y-2">
          {popularFilters.map((filter) => (
            <label key={filter.label} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedFilters[filter.field]?.includes(filter.value) || false}
                  onChange={() => togglePopularFilter(filter)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-yellow-600">
                  {filter.label}
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {filter.count}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    )
  }

  // Render filter chips for active filters
  const renderFilterChips = () => {
    const chips = []

    // Search chip
    if (searchQuery) {
      chips.push(
        <span key="search" className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">
          Search: {searchQuery}
          <button onClick={() => setSearchQuery('')} className="hover:text-yellow-600">
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      )
    }

    // Category chip
    if (selectedCategory !== 'All Categories') {
      chips.push(
        <span key="category" className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
          Category: {selectedCategory}
          <button onClick={() => setSelectedCategory('All Categories')} className="hover:text-blue-600">
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      )
    }

    // Subcategory chip
    if (selectedSubcategory) {
      chips.push(
        <span key="subcategory" className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
          Subcategory: {selectedSubcategory}
          <button onClick={() => setSelectedSubcategory('')} className="hover:text-green-600">
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      )
    }

    // Price range chip
    if (selectedPriceRange) {
      chips.push(
        <span key="price" className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
          Price: {selectedPriceRange}
          <button onClick={() => {
            setSelectedPriceRange('')
            setPriceRange({ min: 0, max: 10000 })
          }} className="hover:text-purple-600">
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      )
    }

    // Dynamic filter chips
    Object.entries(selectedFilters).forEach(([filterType, values]) => {
      values.forEach(value => {
        const filterConfig = categorySpecifications?.filters?.find((f: any) => f.fieldName === filterType)
        const label = filterConfig?.label || filterType
        
        chips.push(
          <span key={`${filterType}-${value}`} className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">
            {label}: {value}
            <button onClick={() => toggleFilter(filterType, value)} className="hover:text-indigo-600">
              <XMarkIcon className="w-3 h-3" />
            </button>
          </span>
        )
      })
    })

    return chips
  }

  // Mobile filters drawer
  const MobileFiltersDrawer = () => (
    <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${
      showMobileFilters ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search Filter with Autocomplete */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <AutocompleteDropdown />
            </div>
          </div>

          {/* Mobile Category Filter */}
          <FilterSection title="Category" sectionKey="category">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="All Categories">All Categories</option>
                  {allCategories.map(category => (
                    <option key={category.slug} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Subcategory Filter - FOR ALL CATEGORIES */}
              {selectedCategory !== 'All Categories' && categorySubcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Subcategories</option>
                    {categorySubcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </FilterSection>

          {/* Mobile Price Range */}
          <FilterSection title="Price Range (ETB)" sectionKey="price">
            <div className="space-y-3">
              {priceRanges.map((range) => (
                <label key={range.label} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range.label}
                      onChange={() => handlePriceRangeSelect(range)}
                      className="text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-yellow-600">
                      {range.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {range.count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Mobile Popular Filters */}
          {renderPopularFilters()}

          {/* Mobile Dynamic Category Filters */}
          {renderDynamicFilters()}

          {/* Mobile Sort Options */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="w-full mt-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  )

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-8xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>

          <div className="flex gap-8">
            {/* Filters Skeleton */}
            <div className="hidden lg:block w-80 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(j => (
                      <div key={j} className="h-4 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Products Grid Skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-8xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
            Search Results
          </h1>
          
          {searchQuery && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Showing results for "<span className="font-semibold text-yellow-600">{searchQuery}</span>"
            </p>
          )}

          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar - COMPREHENSIVE */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search Filter with Autocomplete */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <AutocompleteDropdown />
                </div>
              </div>

              {/* Category Filter */}
              <FilterSection title="Category" sectionKey="category">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Main Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="All Categories">All Categories</option>
                      {allCategories.map(category => (
                        <option key={category.slug} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory Filter - FOR ALL CATEGORIES */}
                  {selectedCategory !== 'All Categories' && categorySubcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subcategory
                      </label>
                      <select
                        value={selectedSubcategory}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">All Subcategories</option>
                        {categorySubcategories.map(subcategory => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range (ETB)" sectionKey="price">
                <div className="space-y-3">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange === range.label}
                          onChange={() => handlePriceRangeSelect(range)}
                          className="text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-yellow-600">
                          {range.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {range.count}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Popular Filters */}
              {renderPopularFilters()}

              {/* Dynamic Category Filters */}
              {renderDynamicFilters()}

              {/* Sort Options */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters Display - COMPREHENSIVE */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {renderFilterChips()}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AdjustmentsHorizontalIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    No Products Found
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Try adjusting your search criteria or browse all categories.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => {
                    const isInWishlistState = isInWishlist(product._id)
                    const isOutOfStock = product.stock === 0 || !product.inStock
                    const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
                    const originalPrice = product.isOnSale ? product.price : null

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
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                        >
                          {isInWishlistState ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
                          )}
                        </button>

                        {/* Product Image */}
                        <div 
                          className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-t-2xl relative cursor-pointer"
                          onClick={() => handleProductAction(product, 'view')}
                        >
                          <img
                            src={product.images?.[0] || product.image}
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
                        <div className="p-4 flex flex-col justify-between flex-1">
                          <div className="space-y-2">
                            {/* Category */}
                            {product.category && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                {product.category}
                              </span>
                            )}

                            {/* Product Name */}
                            <h3 
                              className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors cursor-pointer"
                              onClick={() => handleProductAction(product, 'view')}
                            >
                              {product.name}
                            </h3>

                            {/* Specifications Preview */}
                            {product.specifications && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                {product.specifications.brand && (
                                  <div>Brand: {product.specifications.brand}</div>
                                )}
                                {product.specifications.condition && (
                                  <div>Condition: {product.specifications.condition}</div>
                                )}
                                {product.specifications.screenSize && (
                                  <div>Screen: {product.specifications.screenSize}</div>
                                )}
                                {product.specifications.ram && (
                                  <div>RAM: {product.specifications.ram}</div>
                                )}
                                {product.specifications.storage && (
                                  <div>Storage: {product.specifications.storage}</div>
                                )}
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
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
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {product.stock < 10 ? (
                                  <span className="text-orange-500">Only {product.stock} left</span>
                                ) : (
                                  <span className="text-green-500">In Stock</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 space-y-2">
                            <button
                              onClick={() => handleProductAction(product, 'view')}
                              className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold group/btn"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View Details
                            </button>
                            
                           {!isOutOfStock && (
  <button 
    className={`w-full inline-flex items-center justify-center gap-2 border text-sm px-4 py-2 rounded-xl transition-all duration-200 font-medium group/cart ${
      cartItems.some(item => item.id === product._id)
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        : 'border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400'
    }`}
    onClick={() => addToCart(product)}
  >
    <ShoppingBagIcon className="w-4 h-4" />
    {cartItems.some(item => item.id === product._id) ? 'Added to Cart' : 'Add to Cart'}
  </button>
)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

      {/* Recommendations Section - UPDATED TO MATCH PRODUCT LIST STYLING */}
{showRecommendations && recommendations.length > 0 && (
  <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Recommended For You
      </h2>
      <button
        onClick={() => setShowRecommendations(false)}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
    
    {/* Updated recommendations grid to match product list styling */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recommendations.map((product) => {
        const isInWishlistState = isInWishlist(product._id)
        const isInCartState = cartItems.some(item => item.id === product._id) // Check if product is in cart
        const isOutOfStock = product.stock === 0 || !product.inStock
        const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
        const originalPrice = product.isOnSale ? product.price : null

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
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              {isInWishlistState ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
              )}
            </button>

            {/* Product Image */}
            <div 
              className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-t-2xl relative cursor-pointer"
              onClick={() => handleProductAction(product, 'view')}
            >
              <img
                src={product.images?.[0] || product.image || '/images/placeholder-product.jpg'}
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

            {/* Product Info - Updated to show all details */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div className="space-y-2">
                {/* Category */}
                {product.category && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                )}

                {/* Product Name */}
                <h3 
                  className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors cursor-pointer"
                  onClick={() => handleProductAction(product, 'view')}
                >
                  {product.name}
                </h3>

                {/* Description Preview */}
                {product.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Specifications Preview */}
                {product.specifications && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {product.specifications.brand && (
                      <div>Brand: {product.specifications.brand}</div>
                    )}
                    {product.specifications.condition && (
                      <div>Condition: {product.specifications.condition}</div>
                    )}
                    {product.specifications.screenSize && (
                      <div>Screen: {product.specifications.screenSize}</div>
                    )}
                    {product.specifications.ram && (
                      <div>RAM: {product.specifications.ram}</div>
                    )}
                    {product.specifications.storage && (
                      <div>Storage: {product.specifications.storage}</div>
                    )}
                    {product.specifications.processor && (
                      <div>Processor: {product.specifications.processor}</div>
                    )}
                    {product.specifications.color && (
                      <div>Color: {product.specifications.color}</div>
                    )}
                    {product.specifications.material && (
                      <div>Material: {product.specifications.material}</div>
                    )}
                    {product.specifications.size && (
                      <div>Size: {product.specifications.size}</div>
                    )}
                  </div>
                )}

                {/* Seller Info */}
                {product.seller && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Seller: {product.seller.name}
                    {product.seller.rating && (
                      <span className="ml-2">⭐ {product.seller.rating}</span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
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
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {product.stock < 10 ? (
                      <span className="text-orange-500">Only {product.stock} left</span>
                    ) : (
                      <span className="text-green-500">In Stock</span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleProductAction(product, 'view')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold group/btn"
                >
                  <EyeIcon className="w-4 h-4" />
                  View Details
                </button>
                
                {!isOutOfStock && (
                  <button 
                    className={`w-full inline-flex items-center justify-center gap-2 border text-sm px-4 py-2 rounded-xl transition-all duration-200 font-medium group/cart ${
                      isInCartState
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400'
                    }`}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                    {isInCartState ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFiltersDrawer />
    </div>
  )
}
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { 
//   EyeIcon, 
//   HeartIcon, 
//   ShoppingBagIcon, 
//   FunnelIcon,
//   AdjustmentsHorizontalIcon,
//   XMarkIcon
// } from '@heroicons/react/24/outline'
// import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
// import { useWishlist } from '../contexts/WishlistContext'

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

// // Comprehensive dummy data
// const dummyProducts: Product[] = [
//   {
//     _id: '1',
//     name: 'iPhone 15 Pro Max - 256GB',
//     price: 1299.99,
//     salePrice: 1199.99,
//     image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
//     slug: 'iphone-15-pro-max-256gb',
//     category: 'Electronics',
//     rating: 4.8,
//     reviewCount: 1247,
//     isNew: true,
//     isOnSale: true,
//     stock: 15,
//     isDemo: true
//   },
//   {
//     _id: '2',
//     name: 'Samsung Galaxy S24 Ultra',
//     price: 1199.99,
//     image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
//     slug: 'samsung-galaxy-s24-ultra',
//     category: 'Electronics',
//     rating: 4.7,
//     reviewCount: 892,
//     isNew: true,
//     stock: 8,
//     isDemo: true
//   },
//   {
//     _id: '3',
//     name: 'MacBook Pro 16-inch M3',
//     price: 2399.99,
//     image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
//     slug: 'macbook-pro-16-inch-m3',
//     category: 'Electronics',
//     rating: 4.9,
//     reviewCount: 567,
//     isNew: false,
//     stock: 12,
//     isDemo: true
//   },
//   {
//     _id: '4',
//     name: 'Sony WH-1000XM5 Headphones',
//     price: 399.99,
//     salePrice: 349.99,
//     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
//     slug: 'sony-wh-1000xm5-headphones',
//     category: 'Electronics',
//     rating: 4.6,
//     reviewCount: 2341,
//     isNew: false,
//     isOnSale: true,
//     stock: 25,
//     isDemo: true
//   },
//   {
//     _id: '5',
//     name: 'Nike Air Jordan 1 Retro',
//     price: 179.99,
//     image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
//     slug: 'nike-air-jordan-1-retro',
//     category: 'Clothing',
//     rating: 4.5,
//     reviewCount: 892,
//     isNew: true,
//     stock: 0,
//     isDemo: true
//   },
//   {
//     _id: '6',
//     name: 'Adidas Ultraboost 22 Running Shoes',
//     price: 189.99,
//     salePrice: 159.99,
//     image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
//     slug: 'adidas-ultraboost-22-running-shoes',
//     category: 'Clothing',
//     rating: 4.4,
//     reviewCount: 567,
//     isNew: false,
//     isOnSale: true,
//     stock: 7,
//     isDemo: true
//   },
//   {
//     _id: '7',
//     name: 'Canon EOS R5 Camera',
//     price: 3899.99,
//     image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
//     slug: 'canon-eos-r5-camera',
//     category: 'Electronics',
//     rating: 4.8,
//     reviewCount: 342,
//     isNew: true,
//     stock: 5,
//     isDemo: true
//   },
//   {
//     _id: '8',
//     name: 'PlayStation 5 Console',
//     price: 499.99,
//     image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop',
//     slug: 'playstation-5-console',
//     category: 'Electronics',
//     rating: 4.9,
//     reviewCount: 2156,
//     isNew: false,
//     stock: 3,
//     isDemo: true
//   }
// ]

// // Categories for filtering
// const categories = [
//   'All Categories',
//   'Electronics',
//   'Clothing',
//   'Home & Kitchen',
//   'Beauty',
//   'Sports',
//   'Books',
//   'Toys'
// ]

// const priceRanges = [
//   { label: 'All Prices', min: 0, max: 10000 },
//   { label: 'Under 100 Br', min: 0, max: 100 },
//   { label: '100 - 500 Br', min: 100, max: 500 },
//   { label: '500 - 1000 Br', min: 500, max: 1000 },
//   { label: '1000+ Br', min: 1000, max: 10000 }
// ]

// const sortOptions = [
//   { value: 'relevance', label: 'Relevance' },
//   { value: 'price-low', label: 'Price: Low to High' },
//   { value: 'price-high', label: 'Price: High to Low' },
//   { value: 'rating', label: 'Highest Rated' },
//   { value: 'newest', label: 'Newest First' },
//   { value: 'name', label: 'Name: A to Z' }
// ]

// export default function SearchPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

//   // State for search and filters
//   const [products, setProducts] = useState<Product[]>([])
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [usingDemoData, setUsingDemoData] = useState(false)
  
//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('All Categories')
//   const [priceRange, setPriceRange] = useState(priceRanges[0])
//   const [sortBy, setSortBy] = useState('relevance')
//   const [showFilters, setShowFilters] = useState(false)
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
  
//   // Get initial search parameters from URL
//   useEffect(() => {
//     const query = searchParams.get('q') || ''
//     const category = searchParams.get('category') || 'All Categories'
    
//     setSearchQuery(query)
//     setSelectedCategory(category)
//   }, [searchParams])

//   // Fetch products
//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         console.log('🔄 Fetching products from API...')
//         const res = await fetch('/api/products', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
        
//         if (!res.ok) {
//           console.warn(`API returned ${res.status}, using demo data`)
//           throw new Error(`Failed to fetch products: ${res.status}`)
//         }

//         const data = await res.json()
        
//         if (data && data.length > 0) {
//           console.log(`✅ Loaded ${data.length} real products`)
//           setProducts(data)
//           setUsingDemoData(false)
//         } else {
//           console.log('📝 No real products found, using demo data')
//           throw new Error('No products found in response')
//         }
//       } catch (err: any) {
//         console.log('🎭 Using demo products due to:', err.message)
//         setProducts(dummyProducts)
//         setUsingDemoData(true)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchProducts()
//   }, [])

//   // Apply filters whenever dependencies change
//   useEffect(() => {
//     if (products.length === 0) return

//     let filtered = [...products]

//     // Apply search query filter
//     if (searchQuery.trim()) {
//       filtered = filtered.filter(product =>
//         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         product.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     }

//     // Apply category filter
//     if (selectedCategory !== 'All Categories') {
//       filtered = filtered.filter(product => product.category === selectedCategory)
//     }

//     // Apply price range filter
//     if (priceRange.min !== 0 || priceRange.max !== 10000) {
//       filtered = filtered.filter(product => {
//         const price = product.isOnSale && product.salePrice ? product.salePrice : product.price
//         return price >= priceRange.min && price <= priceRange.max
//       })
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'price-low':
//           return (a.isOnSale ? a.salePrice! : a.price) - (b.isOnSale ? b.salePrice! : b.price)
//         case 'price-high':
//           return (b.isOnSale ? b.salePrice! : b.price) - (a.isOnSale ? a.salePrice! : a.price)
//         case 'rating':
//           return (b.rating || 0) - (a.rating || 0)
//         case 'newest':
//           return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
//         case 'name':
//           return a.name.localeCompare(b.name)
//         case 'relevance':
//         default:
//           return 0
//       }
//     })

//     setFilteredProducts(filtered)
//   }, [products, searchQuery, selectedCategory, priceRange, sortBy])

//   const toggleWishlist = (product: Product) => {
//     if (isInWishlist(product._id)) {
//       removeFromWishlist(product._id)
//     } else {
//       addToWishlist(product)
//       if (product.isDemo || usingDemoData) {
//         alert(`Demo: "${product.name}" added to wishlist!`)
//       }
//     }
//   }

//   const handleProductAction = (product: Product, action: 'view' | 'cart') => {
//     if (action === 'view') {
//       const productSlug = product.slug || product._id
//       router.push(`/products/${productSlug}`)
//     } else if (action === 'cart') {
//       if (product.isDemo || usingDemoData) {
//         alert('This is a demo product. Add to cart functionality will be available with real products.')
//       } else {
//         alert(`Added ${product.name} to cart!`)
//       }
//     }
//   }

//   const clearFilters = () => {
//     setSearchQuery('')
//     setSelectedCategory('All Categories')
//     setPriceRange(priceRanges[0])
//     setSortBy('relevance')
//   }

//   const activeFiltersCount = [
//     searchQuery ? 1 : 0,
//     selectedCategory !== 'All Categories' ? 1 : 0,
//     priceRange.min !== 0 || priceRange.max !== 10000 ? 1 : 0
//   ].reduce((a, b) => a + b, 0)

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//         <div className="max-w-8xl mx-auto px-4">
//           {/* Header Skeleton */}
//           <div className="text-center mb-12 animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
//           </div>

//           <div className="flex gap-8">
//             {/* Filters Skeleton */}
//             <div className="hidden lg:block w-80 space-y-4">
//               {[1, 2, 3, 4].map(i => (
//                 <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
//                   <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
//                   <div className="space-y-2">
//                     {[1, 2, 3, 4].map(j => (
//                       <div key={j} className="h-4 bg-gray-300 rounded"></div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Products Grid Skeleton */}
//             <div className="flex-1">
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {Array.from({ length: 8 }).map((_, index) => (
//                   <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
//                     <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>
//                     <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
//                     <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
//                     <div className="h-10 bg-gray-300 rounded w-full"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
//       <div className="max-w-8xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl lg:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
//             Search Results
//           </h1>
          
//           {searchQuery && (
//             <p className="text-gray-600 dark:text-gray-400 text-lg">
//               Showing results for "<span className="font-semibold text-yellow-600">{searchQuery}</span>"
//             </p>
//           )}

//           <div className="flex items-center justify-between mt-6">
//             <p className="text-gray-600 dark:text-gray-400">
//               Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
//               {usingDemoData && ' (Demo Data)'}
//             </p>

//             {/* Mobile Filter Toggle */}
//             <button
//               onClick={() => setShowMobileFilters(!showMobileFilters)}
//               className="lg:hidden flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors"
//             >
//               <FunnelIcon className="w-5 h-5" />
//               Filters
//               {activeFiltersCount > 0 && (
//                 <span className="bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
//                   {activeFiltersCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="flex gap-8">
//           {/* Desktop Filters Sidebar */}
//           <div className="hidden lg:block w-80 flex-shrink-0">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
//                 {activeFiltersCount > 0 && (
//                   <button
//                     onClick={clearFilters}
//                     className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
//                   >
//                     Clear All
//                   </button>
//                 )}
//               </div>

//               {/* Search Filter */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Search
//                 </label>
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search products..."
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                 />
//               </div>

//               {/* Category Filter */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Category
//                 </label>
//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Price Range Filter */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Price Range
//                 </label>
//                 <select
//                   value={priceRanges.findIndex(range => range.min === priceRange.min && range.max === priceRange.max)}
//                   onChange={(e) => setPriceRange(priceRanges[parseInt(e.target.value)])}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   {priceRanges.map((range, index) => (
//                     <option key={index} value={index}>
//                       {range.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Sort Options */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Sort By
//                 </label>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   {sortOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Filters Overlay */}
//           {showMobileFilters && (
//             <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
//               <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
//                     <button
//                       onClick={() => setShowMobileFilters(false)}
//                       className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//                     >
//                       <XMarkIcon className="w-5 h-5" />
//                     </button>
//                   </div>

//                   {/* Mobile Filter Content */}
//                   <div className="space-y-6">
//                     {/* Search Filter */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Search
//                       </label>
//                       <input
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="Search products..."
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                       />
//                     </div>

//                     {/* Category Filter */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Category
//                       </label>
//                       <select
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                       >
//                         {categories.map(category => (
//                           <option key={category} value={category}>
//                             {category}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Price Range Filter */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Price Range
//                       </label>
//                       <select
//                         value={priceRanges.findIndex(range => range.min === priceRange.min && range.max === priceRange.max)}
//                         onChange={(e) => setPriceRange(priceRanges[parseInt(e.target.value)])}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                       >
//                         {priceRanges.map((range, index) => (
//                           <option key={index} value={index}>
//                             {range.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Sort Options */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Sort By
//                       </label>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
//                       >
//                         {sortOptions.map(option => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Apply Filters Button */}
//                     <button
//                       onClick={() => setShowMobileFilters(false)}
//                       className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
//                     >
//                       Apply Filters
//                     </button>

//                     {/* Clear Filters Button */}
//                     {activeFiltersCount > 0 && (
//                       <button
//                         onClick={clearFilters}
//                         className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium transition-colors hover:border-yellow-500 dark:hover:border-yellow-400"
//                       >
//                         Clear All Filters
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Products Grid */}
//           <div className="flex-1">
//             {/* Active Filters Display */}
//             {activeFiltersCount > 0 && (
//               <div className="flex flex-wrap gap-2 mb-6">
//                 {searchQuery && (
//                   <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">
//                     Search: {searchQuery}
//                     <button
//                       onClick={() => setSearchQuery('')}
//                       className="hover:text-yellow-600"
//                     >
//                       <XMarkIcon className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
//                 {selectedCategory !== 'All Categories' && (
//                   <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
//                     Category: {selectedCategory}
//                     <button
//                       onClick={() => setSelectedCategory('All Categories')}
//                       className="hover:text-blue-600"
//                     >
//                       <XMarkIcon className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
//                 {(priceRange.min !== 0 || priceRange.max !== 10000) && (
//                   <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
//                     Price: {priceRange.label}
//                     <button
//                       onClick={() => setPriceRange(priceRanges[0])}
//                       className="hover:text-green-600"
//                     >
//                       <XMarkIcon className="w-3 h-3" />
//                     </button>
//                   </span>
//                 )}
//               </div>
//             )}

//             {filteredProducts.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="max-w-md mx-auto">
//                   <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
//                     <AdjustmentsHorizontalIcon className="w-16 h-16 text-gray-400" />
//                   </div>
                  
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                     No Products Found
//                   </h2>
                  
//                   <p className="text-gray-600 dark:text-gray-400 mb-8">
//                     Try adjusting your search criteria or browse all categories.
//                   </p>

//                   <button
//                     onClick={clearFilters}
//                     className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {filteredProducts.map((product) => {
//                   const isInWishlistState = isInWishlist(product._id)
//                   const isOutOfStock = product.stock === 0
//                   const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
//                   const originalPrice = product.isOnSale ? product.price : null
//                   const isDemoProduct = product.isDemo || usingDemoData

//                   return (
//                     <div
//                       key={product._id}
//                       className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden"
//                     >
//                       {/* Demo Badge for demo products */}
//                       {isDemoProduct && (
//                         <div className="absolute top-3 left-3 z-10">
//                           <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                             DEMO
//                           </span>
//                         </div>
//                       )}

//                       {/* Badges */}
//                       <div className={`absolute top-3 z-10 flex flex-col gap-2 ${isDemoProduct ? 'left-12' : 'left-3'}`}>
//                         {product.isNew && (
//                           <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                             NEW
//                           </span>
//                         )}
//                         {product.isOnSale && (
//                           <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                             SALE
//                           </span>
//                         )}
//                         {isOutOfStock && (
//                           <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
//                             OUT OF STOCK
//                           </span>
//                         )}
//                       </div>

//                       {/* Wishlist Button */}
//                       <button
//                         onClick={() => toggleWishlist(product)}
//                         className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
//                       >
//                         {isInWishlistState ? (
//                           <HeartSolidIcon className="w-5 h-5 text-red-500" />
//                         ) : (
//                           <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
//                         )}
//                       </button>

//                       {/* Product Image */}
//                       <div 
//                         className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-t-2xl relative cursor-pointer"
//                         onClick={() => handleProductAction(product, 'view')}
//                       >
//                         <img
//                           src={product.image}
//                           alt={product.name}
//                           className="object-contain h-full w-full transition-transform duration-500 group-hover:scale-110"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&auto=format'
//                           }}
//                         />
//                         {isOutOfStock && (
//                           <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
//                             <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold">
//                               Out of Stock
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="p-4 flex flex-col justify-between flex-1">
//                         <div className="space-y-2">
//                           {/* Category */}
//                           {product.category && (
//                             <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
//                               {product.category}
//                             </span>
//                           )}

//                           {/* Product Name */}
//                           <h3 
//                             className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors cursor-pointer"
//                             onClick={() => handleProductAction(product, 'view')}
//                           >
//                             {product.name}
//                           </h3>

//                           {/* Rating */}
//                           {product.rating && (
//                             <div className="flex items-center gap-1">
//                               <div className="flex text-yellow-400">
//                                 {'★'.repeat(Math.floor(product.rating))}
//                                 {'☆'.repeat(5 - Math.floor(product.rating))}
//                               </div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400">
//                                 ({product.reviewCount || 0})
//                               </span>
//                             </div>
//                           )}

//                           {/* Price */}
//                           <div className="flex items-center gap-2">
//                             <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
//                               {displayPrice.toFixed(2)} Br
//                             </span>
//                             {originalPrice && (
//                               <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
//                                 {originalPrice.toFixed(2)} Br
//                               </span>
//                             )}
//                           </div>

//                           {/* Stock Indicator */}
//                           {product.stock !== undefined && product.stock > 0 && (
//                             <div className="text-xs text-gray-500 dark:text-gray-400">
//                               {product.stock < 10 ? (
//                                 <span className="text-orange-500">Only {product.stock} left</span>
//                               ) : (
//                                 <span className="text-green-500">In Stock</span>
//                               )}
//                             </div>
//                           )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="mt-4 space-y-2">
//                           <button
//                             onClick={() => handleProductAction(product, 'view')}
//                             className="w-full inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-gray-900 text-sm px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold group/btn"
//                           >
//                             <EyeIcon className="w-4 h-4" />
//                             {isDemoProduct ? 'View Demo' : 'View Details'}
//                           </button>
                          
//                           {!isOutOfStock && (
//                             <button 
//                               className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400 text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 text-sm px-4 py-2 rounded-xl transition-all duration-200 font-medium group/cart"
//                               onClick={() => handleProductAction(product, 'cart')}
//                             >
//                               <ShoppingBagIcon className="w-4 h-4" />
//                               Add to Cart
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }