'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon 
} from '@heroicons/react/24/outline'
import {
  FaMobileAlt,
  FaTshirt,
  FaGamepad,
  FaHome,
  FaSmile,
  FaFutbol,
  FaBook
} from 'react-icons/fa'

const categories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty',
  'Sports',
  'Books',
  'Toys'
]

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'Electronics': FaMobileAlt,
  'Clothing': FaTshirt,
  'Toys': FaGamepad,
  'Home & Kitchen': FaHome,
  'Beauty': FaSmile,
  'Sports': FaFutbol,
  'Books': FaBook
}

const trendingSearches = [
  'Smartphones',
  'Wireless Earbuds',
  'Gaming Laptops',
  'Fitness Trackers',
  '4K TVs',
  'Bluetooth Speakers',
  'Smart Watches',
  'Action Figures',
]

interface MobileSearchSheetProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSearchSheet({ isOpen, onClose }: MobileSearchSheetProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      document.body.classList.add('search-open')
    } else {
      document.body.classList.remove('search-open')
    }

    return () => {
      document.body.classList.remove('search-open')
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams({
        q: searchTerm,
        category: selectedCategory === 'All Categories' ? '' : selectedCategory
      })
      window.location.href = `/search?${searchParams.toString()}`
    }
  }

  const handleQuickSearch = (term: string) => {
    const searchParams = new URLSearchParams({
      q: term,
      category: selectedCategory === 'All Categories' ? '' : selectedCategory
    })
    window.location.href = `/search?${searchParams.toString()}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Search Sheet */}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <div className="flex-1 mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </form>
          </div>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {/* Category Selection */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category]
                const isSelected = selectedCategory === category
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {category === 'All Categories' ? 'All' : category}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Trending Searches */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Trending Searches</h3>
            <div className="grid grid-cols-2 gap-2">
              {trendingSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => handleQuickSearch(item)}
                  className="text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches (you can implement this later) */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Searches</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent searches
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}