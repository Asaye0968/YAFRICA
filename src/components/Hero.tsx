'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'
import { 
  FaMobileAlt, 
  FaTshirt, 
  FaGamepad, 
  FaHome, 
  FaSmile, 
  FaFutbol, 
  FaBook,
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaHeadset,
  FaTags
} from 'react-icons/fa'

const sliderImages = [
  {
    url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Summer Tech Sale',
    subtitle: 'Up to 50% Off on Electronics',
    buttonText: 'Shop Now',
    buttonLink: '/search?category=Electronics'
  },
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'New Arrivals',
    subtitle: 'Latest Gadgets & Accessories',
    buttonText: 'Explore',
    buttonLink: '/search?sort=newest'
  },
  {
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Free Shipping',
    subtitle: 'On Orders Over $50',
    buttonText: 'Learn More',
    buttonLink: '/search'
  }
]

// Define categories based on your structure - MUST match search page categories
const defaultCategories = [
  { 
    name: 'Electronics', 
    subcategories: ['Phones', 'Computers', 'Cameras', 'TV & Audio', 'Gaming'],
    icon: FaMobileAlt
  },
  { 
    name: 'Clothing', 
    subcategories: ['Men', 'Women', 'Kids', 'Shoes'],
    icon: FaTshirt
  },
  { 
    name: 'Home & Garden', 
    subcategories: ['Furniture', 'Decor', 'Kitchenware', 'Garden'],
    icon: FaHome
  },
  { 
    name: 'Beauty & Health', 
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness'],
    icon: FaSmile
  },
  { 
    name: 'Sports & Outdoors', 
    subcategories: ['Football', 'Basketball', 'Running', 'Fitness', 'Cycling', 'Swimming', 'Hiking', 'Camping'],
    icon: FaFutbol
  },
  { 
    name: 'Toys & Games', 
    subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles', 'Outdoor Toys', 'Electronic Toys'],
    icon: FaGamepad
  },
  { 
    name: 'Automotive', 
    subcategories: ['Cars', 'Motorcycles', 'Bicycles', 'Trucks', 'SUVs', 'Parts & Accessories'],
    icon: FaShippingFast
  },
  { 
    name: 'Books & Media', 
    subcategories: ['Books', 'DVDs', 'CDs', 'Video Games', 'Magazines'],
    icon: FaBook
  }
]

export default function Hero() {
  const [categories, setCategories] = useState(defaultCategories)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const [openSubcategoryIndex, setOpenSubcategoryIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          if (data.categories && data.categories.length > 0) {
            // Add icons to fetched categories
            const categoriesWithIcons = data.categories.map((cat: { name: string; subcategories: string[] }) => {
              const defaultCat = defaultCategories.find(dc => 
                dc.name.toLowerCase() === cat.name.toLowerCase()
              )
              return {
                ...cat,
                icon: defaultCat?.icon || FaTags
              }
            })
            setCategories(categoriesWithIcons)
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Use default categories if fetch fails
        setCategories(defaultCategories)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  function goToSlide(index: number) {
    setCurrentSlide(index)
  }

  function toggleSubcategory(index: number) {
    setOpenSubcategoryIndex((prev) => (prev === index ? null : index))
  }

  // Updated function to generate search page URLs with proper filtering
  const getCategoryUrl = (categoryName: string, subcategoryName?: string) => {
    const params = new URLSearchParams()
    
    if (subcategoryName) {
      // Search for products in this specific subcategory
      params.set('category', categoryName)
      params.set('subcategory', subcategoryName)
    } else {
      // Show all products in this category
      params.set('category', categoryName)
    }
    
    return `/search?${params.toString()}`
  }

  // Function to handle main category clicks
  const handleCategoryClick = (categoryName: string) => {
    // Navigate to search page with category filter
    const url = getCategoryUrl(categoryName)
    window.location.href = url
  }

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar - FIXED HEIGHT */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Desktop Categories */}
            <nav className="hidden lg:block bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden h-auto max-h-[600px] overflow-y-auto">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-4 sticky top-0 z-10">
                <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                  <FaTags className="w-5 h-5" />
                  All Categories
                </h2>
              </div>
              <ul className="py-2">
                {categories.map((cat, index) => {
                  const IconComponent = cat.icon
                  return (
                    <li key={cat.name} className="border-b border-gray-700 last:border-b-0">
                      {/* Main Category - Clickable */}
                      <button
                        onClick={() => handleCategoryClick(cat.name)}
                        className="flex justify-between items-center w-full py-4 px-6 text-left transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white group"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-semibold">{cat.name}</span>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </button>
                      
                      {/* Subcategories - Toggleable */}
                      <div className="border-t border-gray-700">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSubcategory(index)
                          }}
                          className={`flex justify-between items-center w-full py-3 px-6 text-left transition-all duration-200 text-xs ${
                            openSubcategoryIndex === index
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                          }`}
                          aria-expanded={openSubcategoryIndex === index}
                          aria-controls={`subcat-${index}`}
                        >
                          <span>Browse {cat.name}</span>
                          <ChevronRightIcon 
                            className={`w-3 h-3 transition-transform duration-200 ${
                              openSubcategoryIndex === index ? 'rotate-90' : ''
                            }`} 
                          />
                        </button>
                        
                        {openSubcategoryIndex === index && (
                          <div
                            id={`subcat-${index}`}
                            className="bg-gray-900/50 px-6 pb-4 border-t border-gray-700"
                          >
                            <ul className="space-y-2 pt-2">
                              {cat.subcategories.map((subcat) => (
                                <li key={subcat}>
                                  <Link
                                    href={getCategoryUrl(cat.name, subcat)}
                                    className="block py-2 px-3 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                                    onClick={() => setOpenSubcategoryIndex(null)}
                                  >
                                    {subcat}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Mobile Categories Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileCategories(!showMobileCategories)}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                aria-expanded={showMobileCategories}
                aria-controls="mobile-categories"
              >
                <FaTags className="w-5 h-5" />
                {showMobileCategories ? 'Hide Categories' : 'Browse Categories'}
              </button>
            </div>

            {/* Mobile Categories List */}
            {showMobileCategories && (
              <nav
                id="mobile-categories"
                aria-label="Product Categories"
                className="lg:hidden bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 mt-4 overflow-hidden max-h-[70vh] overflow-y-auto"
              >
                <ul className="py-2">
                  {categories.map((cat, index) => {
                    const IconComponent = cat.icon
                    return (
                      <li key={cat.name} className="border-b border-gray-700 last:border-b-0">
                        {/* Main Category - Clickable */}
                        <button
                          onClick={() => {
                            handleCategoryClick(cat.name)
                            setShowMobileCategories(false)
                          }}
                          className="flex justify-between items-center w-full py-4 px-6 text-left transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white group"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-semibold">{cat.name}</span>
                          </div>
                          <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </button>
                        
                        {/* Subcategories - Toggleable */}
                        <div className="border-t border-gray-700">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSubcategory(index)
                            }}
                            className={`flex justify-between items-center w-full py-3 px-6 text-left transition-all duration-200 text-xs ${
                              openSubcategoryIndex === index
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                            }`}
                            aria-expanded={openSubcategoryIndex === index}
                            aria-controls={`mobile-subcat-${index}`}
                          >
                            <span>Browse {cat.name}</span>
                            <ChevronRightIcon 
                              className={`w-3 h-3 transition-transform duration-200 ${
                                openSubcategoryIndex === index ? 'rotate-90' : ''
                              }`} 
                            />
                          </button>
                          
                          {openSubcategoryIndex === index && (
                            <div
                              id={`mobile-subcat-${index}`}
                              className="bg-gray-900/50 px-6 pb-4 border-t border-gray-700"
                            >
                              <ul className="space-y-2 pt-2">
                                {cat.subcategories.map((subcat) => (
                                  <li key={subcat}>
                                    <Link
                                      href={getCategoryUrl(cat.name, subcat)}
                                      className="block py-2 px-3 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
                                      onClick={() => {
                                        setOpenSubcategoryIndex(null)
                                        setShowMobileCategories(false)
                                      }}
                                    >
                                      {subcat}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            )}
          </div>

          {/* Hero Slider - FIXED: Takes remaining space */}
          <div className="flex-1 min-w-0">
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl overflow-hidden h-[400px] lg:h-[500px]">
              {/* Slides */}
              <div className="relative h-full">
                {sliderImages.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.url})` }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="max-w-4xl mx-auto px-8 text-center lg:text-left">
                        <div className="max-w-2xl">
                          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                            {slide.title}
                          </h1>
                          <p className="text-xl lg:text-2xl text-gray-200 mb-8 animate-fade-in-up animation-delay-200">
                            {slide.subtitle}
                          </p>
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 animate-fade-in-up animation-delay-400"
                          >
                            {slide.buttonText}
                            <PlayIcon className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-yellow-500 scale-125'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Auto-play Toggle */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-200 z-10"
                aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isAutoPlaying ? '⏸️' : '▶️'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/30 transition-all duration-200">
                <FaShippingFast className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-white text-sm">Free Shipping</h3>
                <p className="text-gray-400 text-xs">Over $50</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/30 transition-all duration-200">
                <FaShieldAlt className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-white text-sm">Secure Payment</h3>
                <p className="text-gray-400 text-xs">100% Protected</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/30 transition-all duration-200">
                <FaUndo className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-white text-sm">Easy Returns</h3>
                <p className="text-gray-400 text-xs">30 Days Policy</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/30 transition-all duration-200">
                <FaHeadset className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-white text-sm">24/7 Support</h3>
                <p className="text-gray-400 text-xs">Always Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  )
}
// 'use client'

// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'
// import { 
//   FaMobileAlt, 
//   FaTshirt, 
//   FaGamepad, 
//   FaHome, 
//   FaSmile, 
//   FaFutbol, 
//   FaBook,
//   FaShippingFast,
//   FaShieldAlt,
//   FaUndo,
//   FaHeadset,
//   FaTags
// } from 'react-icons/fa'

// const sliderImages = [
//   {
//     url: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
//     title: 'Summer Tech Sale',
//     subtitle: 'Up to 50% Off on Electronics',
//     buttonText: 'Shop Now',
//     buttonLink: '/search?category=Electronics'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
//     title: 'New Arrivals',
//     subtitle: 'Latest Gadgets & Accessories',
//     buttonText: 'Explore',
//     buttonLink: '/search?sort=newest'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
//     title: 'Free Shipping',
//     subtitle: 'On Orders Over $50',
//     buttonText: 'Learn More',
//     buttonLink: '/shipping'
//   }
// ]

// // Define categories based on your structure - MUST match search page categories
// const defaultCategories = [
//   { 
//     name: 'Electronics', 
//     subcategories: ['Phones', 'Laptops', 'Cameras', 'Headphones', 'Tablets'],
//     icon: FaMobileAlt
//   },
//   { 
//     name: 'Clothing', 
//     subcategories: ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
//     icon: FaTshirt
//   },
//   { 
//     name: 'Toys', 
//     subcategories: ['Action Figures', 'Puzzles', 'Board Games', 'Educational', 'Outdoor'],
//     icon: FaGamepad
//   },
//   { 
//     name: 'Home & Kitchen', 
//     subcategories: ['Furniture', 'Appliances', 'Decor', 'Cookware', 'Bedding'],
//     icon: FaHome
//   },
//   { 
//     name: 'Beauty', 
//     subcategories: ['Makeup', 'Skincare', 'Hair Care', 'Fragrances', 'Tools'],
//     icon: FaSmile
//   },
//   { 
//     name: 'Sports', 
//     subcategories: ['Outdoor', 'Gym', 'Team Sports', 'Fitness', 'Water Sports'],
//     icon: FaFutbol
//   },
//   { 
//     name: 'Books', 
//     subcategories: ['Fiction', 'Non-Fiction', 'Children', 'Educational', 'Comics'],
//     icon: FaBook
//   }
// ]

// export default function Hero() {
//   const [categories, setCategories] = useState(defaultCategories)
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [showMobileCategories, setShowMobileCategories] = useState(false)
//   const [openSubcategoryIndex, setOpenSubcategoryIndex] = useState<number | null>(null)
//   const [isDesktop, setIsDesktop] = useState(false)
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true)

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const res = await fetch('/api/categories')
//         if (res.ok) {
//           const data = await res.json()
//           if (data.categories && data.categories.length > 0) {
//             // Add icons to fetched categories
//             const categoriesWithIcons = data.categories.map((cat: { name: string; subcategories: string[] }) => {
//               const defaultCat = defaultCategories.find(dc => 
//                 dc.name.toLowerCase() === cat.name.toLowerCase()
//               )
//               return {
//                 ...cat,
//                 icon: defaultCat?.icon || FaTags
//               }
//             })
//             setCategories(categoriesWithIcons)
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error)
//         // Use default categories if fetch fails
//         setCategories(defaultCategories)
//       }
//     }

//     fetchCategories()
//   }, [])

//   useEffect(() => {
//     function handleResize() {
//       setIsDesktop(window.innerWidth >= 1024)
//     }
//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (isAutoPlaying) {
//       interval = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
//       }, 5000)
//     }
//     return () => clearInterval(interval)
//   }, [isAutoPlaying])

//   function nextSlide() {
//     setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
//   }

//   function prevSlide() {
//     setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
//   }

//   function goToSlide(index: number) {
//     setCurrentSlide(index)
//   }

//   function toggleSubcategory(index: number) {
//     setOpenSubcategoryIndex((prev) => (prev === index ? null : index))
//   }

//   // Updated function to generate search page URLs with proper filtering
//   const getCategoryUrl = (categoryName: string, subcategoryName?: string) => {
//     const params = new URLSearchParams()
    
//     if (subcategoryName) {
//       // Search for products in this specific subcategory
//       params.set('q', subcategoryName)
//       params.set('category', categoryName)
//     } else {
//       // Show all products in this category
//       params.set('category', categoryName)
//     }
    
//     return `/search?${params.toString()}`
//   }

//   // Function to handle main category clicks
//   const handleCategoryClick = (categoryName: string) => {
//     // Navigate to search page with category filter
//     const url = getCategoryUrl(categoryName)
//     window.location.href = url
//   }

//   return (
//     <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-8">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Categories Sidebar */}
//           <div className="lg:w-64 flex-shrink-0">
//             {/* Desktop Categories */}
//             <nav className="hidden lg:block bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
//               <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-4">
//                 <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
//                   <FaTags className="w-5 h-5" />
//                   All Categories
//                 </h2>
//               </div>
//               <ul className="py-2">
//                 {categories.map((cat, index) => {
//                   const IconComponent = cat.icon
//                   return (
//                     <li key={cat.name} className="border-b border-gray-700 last:border-b-0">
//                       {/* Main Category - Clickable */}
//                       <button
//                         onClick={() => handleCategoryClick(cat.name)}
//                         className="flex justify-between items-center w-full py-4 px-6 text-left transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white group"
//                       >
//                         <div className="flex items-center gap-3">
//                           <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
//                           <span className="font-semibold">{cat.name}</span>
//                         </div>
//                         <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                       </button>
                      
//                       {/* Subcategories - Toggleable */}
//                       <div className="border-t border-gray-700">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             toggleSubcategory(index)
//                           }}
//                           className={`flex justify-between items-center w-full py-3 px-6 text-left transition-all duration-200 text-xs ${
//                             openSubcategoryIndex === index
//                               ? 'bg-yellow-500/10 text-yellow-400'
//                               : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
//                           }`}
//                           aria-expanded={openSubcategoryIndex === index}
//                           aria-controls={`subcat-${index}`}
//                         >
//                           <span>Browse {cat.name}</span>
//                           <ChevronRightIcon 
//                             className={`w-3 h-3 transition-transform duration-200 ${
//                               openSubcategoryIndex === index ? 'rotate-90' : ''
//                             }`} 
//                           />
//                         </button>
                        
//                         {openSubcategoryIndex === index && (
//                           <div
//                             id={`subcat-${index}`}
//                             className="bg-gray-900/50 px-6 pb-4 border-t border-gray-700"
//                           >
//                             <ul className="space-y-2 pt-2">
//                               {cat.subcategories.map((subcat) => (
//                                 <li key={subcat}>
//                                   <Link
//                                     href={getCategoryUrl(cat.name, subcat)}
//                                     className="block py-2 px-3 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
//                                     onClick={() => setOpenSubcategoryIndex(null)}
//                                   >
//                                     {subcat}
//                                   </Link>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     </li>
//                   )
//                 })}
//               </ul>
//             </nav>

//             {/* Mobile Categories Button */}
//             <div className="lg:hidden mb-4">
//               <button
//                 onClick={() => setShowMobileCategories(!showMobileCategories)}
//                 className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
//                 aria-expanded={showMobileCategories}
//                 aria-controls="mobile-categories"
//               >
//                 <FaTags className="w-5 h-5" />
//                 {showMobileCategories ? 'Hide Categories' : 'Browse Categories'}
//               </button>
//             </div>

//             {/* Mobile Categories List */}
//             {showMobileCategories && (
//               <nav
//                 id="mobile-categories"
//                 aria-label="Product Categories"
//                 className="lg:hidden bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 mt-4 overflow-hidden"
//               >
//                 <ul className="py-2">
//                   {categories.map((cat, index) => {
//                     const IconComponent = cat.icon
//                     return (
//                       <li key={cat.name} className="border-b border-gray-700 last:border-b-0">
//                         {/* Main Category - Clickable */}
//                         <button
//                           onClick={() => {
//                             handleCategoryClick(cat.name)
//                             setShowMobileCategories(false)
//                           }}
//                           className="flex justify-between items-center w-full py-4 px-6 text-left transition-all duration-200 text-gray-300 hover:bg-gray-700 hover:text-white group"
//                         >
//                           <div className="flex items-center gap-3">
//                             <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
//                             <span className="font-semibold">{cat.name}</span>
//                           </div>
//                           <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                         </button>
                        
//                         {/* Subcategories - Toggleable */}
//                         <div className="border-t border-gray-700">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               toggleSubcategory(index)
//                             }}
//                             className={`flex justify-between items-center w-full py-3 px-6 text-left transition-all duration-200 text-xs ${
//                               openSubcategoryIndex === index
//                                 ? 'bg-yellow-500/10 text-yellow-400'
//                                 : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
//                             }`}
//                             aria-expanded={openSubcategoryIndex === index}
//                             aria-controls={`mobile-subcat-${index}`}
//                           >
//                             <span>Browse {cat.name}</span>
//                             <ChevronRightIcon 
//                               className={`w-3 h-3 transition-transform duration-200 ${
//                                 openSubcategoryIndex === index ? 'rotate-90' : ''
//                               }`} 
//                             />
//                           </button>
                          
//                           {openSubcategoryIndex === index && (
//                             <div
//                               id={`mobile-subcat-${index}`}
//                               className="bg-gray-900/50 px-6 pb-4 border-t border-gray-700"
//                             >
//                               <ul className="space-y-2 pt-2">
//                                 {cat.subcategories.map((subcat) => (
//                                   <li key={subcat}>
//                                     <Link
//                                       href={getCategoryUrl(cat.name, subcat)}
//                                       className="block py-2 px-3 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
//                                       onClick={() => {
//                                         setOpenSubcategoryIndex(null)
//                                         setShowMobileCategories(false)
//                                       }}
//                                     >
//                                       {subcat}
//                                     </Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                         </div>
//                       </li>
//                     )
//                   })}
//                 </ul>
//               </nav>
//             )}
//           </div>

//           {/* Main Hero Content */}
//           <div className="flex-1">
//             {/* Hero Slider */}
//             <div className="relative rounded-2xl overflow-hidden shadow-2xl h-64 md:h-96 bg-gray-900 group">
//               {/* Slide Image */}
//               <div className="relative w-full h-full">
//                 <img
//                   src={sliderImages[currentSlide].url}
//                   alt={sliderImages[currentSlide].title}
//                   className="w-full h-full object-cover"
//                 />
//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                
//                 {/* Slide Content */}
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="text-white px-8 md:px-12 max-w-lg">
//                     <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
//                       {sliderImages[currentSlide].title}
//                     </h1>
//                     <p className="text-lg md:text-xl text-gray-200 mb-6">
//                       {sliderImages[currentSlide].subtitle}
//                     </p>
//                     <Link
//                       href={sliderImages[currentSlide].buttonLink}
//                       className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
//                     >
//                       {sliderImages[currentSlide].buttonText}
//                       <PlayIcon className="w-5 h-5" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>

//               {/* Navigation Arrows */}
//               <button
//                 onClick={prevSlide}
//                 aria-label="Previous Slide"
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
//               >
//                 <ChevronLeftIcon className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={nextSlide}
//                 aria-label="Next Slide"
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
//               >
//                 <ChevronRightIcon className="w-6 h-6" />
//               </button>

//               {/* Slide Indicators */}
//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                 {sliderImages.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToSlide(index)}
//                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                       index === currentSlide
//                         ? 'bg-yellow-500 w-8'
//                         : 'bg-white/50 hover:bg-white/80'
//                     }`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   />
//                 ))}
//               </div>

//               {/* Auto-play Toggle */}
//               <button
//                 onClick={() => setIsAutoPlaying(!isAutoPlaying)}
//                 className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
//                 aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
//               >
//                 {isAutoPlaying ? '⏸️' : '▶️'}
//               </button>
//             </div>

//             {/* Quick Features Bar */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//               <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/50 transition-all duration-200 group">
//                 <FaShippingFast className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
//                 <div className="text-white font-semibold text-sm mt-1">Free Shipping</div>
//                 <div className="text-gray-400 text-xs">On orders over $50</div>
//               </div>
//               <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/50 transition-all duration-200 group">
//                 <FaShieldAlt className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
//                 <div className="text-white font-semibold text-sm mt-1">Secure Payment</div>
//                 <div className="text-gray-400 text-xs">100% Protected</div>
//               </div>
//               <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/50 transition-all duration-200 group">
//                 <FaUndo className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
//                 <div className="text-white font-semibold text-sm mt-1">Easy Returns</div>
//                 <div className="text-gray-400 text-xs">30 Day Policy</div>
//               </div>
//               <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:border-yellow-500/50 transition-all duration-200 group">
//                 <FaHeadset className="w-8 h-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
//                 <div className="text-white font-semibold text-sm mt-1">24/7 Support</div>
//                 <div className="text-gray-400 text-xs">Always Here</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }