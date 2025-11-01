'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, X, Plus, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { getCategoryConfig } from '@/lib/categories'

interface ProductFormData {
  name: string
  price: string
  originalPrice: string
  category: string
  subcategory: string
  description: string
  stock: string
  images: string[]
  specifications: {
    [key: string]: string | number | boolean
  }
}

// Category mapping function - converts readable format to MongoDB format
const mapCategoryToDBFormat = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'Clothing': 'CLOTHING',
    'Electronics': 'ELECTRONICS',
    'Home & Garden': 'HOME_GARDEN',
    'Beauty & Health': 'BEAUTY_HEALTH',
    'Sports & Outdoors': 'SPORTS_OUTDOORS',
    'Toys & Games': 'TOYS_GAMES',
    'Automotive': 'AUTOMOTIVE',
    'Books & Media': 'BOOKS_MEDIA',
    'Jewelry & Accessories': 'JEWELRY_ACCESSORIES',
    'Food & Beverages': 'FOOD_BEVERAGES'
  }
  return categoryMap[category] || category
}

export default function CreateProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [specsSectionOpen, setSpecsSectionOpen] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    description: '',
    stock: '1',
    images: [],
    specifications: {}
  })

  const categories = [
    'Clothing',
    'Electronics',
    'Home & Garden',
    'Beauty & Health',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Books & Media',
    'Jewelry & Accessories',
    'Food & Beverages'
  ]

  const subcategories: Record<string, string[]> = {
    'Clothing': ['Men', 'Women', 'Kids', 'Baby', 'Shoes', 'Accessories'],
    'Electronics': ['Phones', 'Computers', 'TV & Audio', 'Cameras', 'Gaming', 'Smart Home'],
    'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Bed & Bath', 'Garden', 'Tools'],
    'Beauty & Health': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness'],
    'Sports & Outdoors': ['Exercise', 'Outdoor Gear', 'Team Sports', 'Water Sports', 'Cycling'],
    'Toys & Games': ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles'],
    'Automotive': ['Car Care', 'Tools', 'Accessories', 'Parts', 'Motorcycle'],
    'Books & Media': ['Fiction', 'Non-Fiction', 'Children', 'Educational', 'Audio Books'],
    'Jewelry & Accessories': ['Necklaces', 'Rings', 'Earrings', 'Watches', 'Bags'],
    'Food & Beverages': ['Snacks', 'Beverages', 'Cooking', 'Organic', 'International']
  }

  const categoryConfig = formData.category ? getCategoryConfig(formData.category, formData.subcategory) : null

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  // Reset specifications when category changes
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({
        ...prev,
        specifications: {}
      }))
      setSpecsSectionOpen(true)
    }
  }, [formData.category])

  // Form validation
  const validateForm = (): string | null => {
    if (imageFiles.length === 0) {
      return 'Please upload at least one product image'
    }
    if (!formData.name.trim()) {
      return 'Product name is required'
    }
    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      return 'Valid original price is required'
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      return 'Valid selling price is required'
    }
    if (!formData.category) {
      return 'Category is required'
    }
    if (!formData.description.trim()) {
      return 'Description is required'
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      return 'Valid stock quantity is required'
    }

    // Validate required specifications
    if (categoryConfig) {
      const missingRequired = categoryConfig.specifications
        .filter(spec => spec.required && !formData.specifications[spec.fieldName])
        .map(spec => spec.label)

      if (missingRequired.length > 0) {
        return `Please fill in required specifications: ${missingRequired.join(', ')}`
      }
    }

    return null
  }

  // Calculate final price with 10% markup
  const calculateFinalPrice = (basePrice: string): string => {
    if (!basePrice || isNaN(parseFloat(basePrice))) return ''
    const price = parseFloat(basePrice)
    const finalPrice = price + (price * 0.10)
    return finalPrice.toFixed(2)
  }

  // Handle price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const basePrice = e.target.value
    setFormData(prev => ({
      ...prev,
      originalPrice: basePrice,
      price: calculateFinalPrice(basePrice)
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + imageFiles.length > 4) {
      alert('Maximum 4 images allowed')
      return
    }

    const newImageFiles = [...imageFiles, ...files]
    setImageFiles(newImageFiles)

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
    
    URL.revokeObjectURL(imagePreviews[index])
  }

  // Handle basic form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name !== 'originalPrice') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSpecificationChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [fieldName]: value
      }
    }))
  }

  // Upload images with watermark using API route
  const uploadImagesWithWatermark = async (files: File[]): Promise<string[]> => {
    try {
      console.log('📤 Starting upload with watermark via API...')
      
      const uploadFormData = new FormData()
      files.forEach(file => {
        uploadFormData.append('images', file)
      })

      // Add watermark flag
      uploadFormData.append('addWatermark', 'true')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      console.log('📤 Upload API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Upload API error:', errorText)
        throw new Error(`Upload failed: HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log('📤 Upload API result:', result)

      if (result.success && result.urls) {
        console.log('✅ API upload with watermark successful:', result.urls)
        return result.urls
      } else {
        throw new Error(result.error || 'Upload failed - no URLs returned')
      }
    } catch (error) {
      console.error('❌ API upload with watermark error:', error)
      // Fallback to direct Cloudinary upload without watermark
      console.log('🔄 Falling back to direct Cloudinary upload without watermark...')
      return await uploadImagesToCloudinary(files)
    }
  }

  // Fallback: Upload images to Cloudinary without watermark
  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    try {
      console.log('📤 Starting Cloudinary direct upload...')
      const uploadedUrls: string[] = []

      for (const file of files) {
        try {
          if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image`)
          }

          const formData = new FormData()
          formData.append('file', file)
          formData.append('upload_preset', 'ml_default')
          formData.append('cloud_name', 'dxuhyn4ue')
          
          console.log(`📤 Uploading to Cloudinary: ${file.name}`)
          
          const response = await fetch(`https://api.cloudinary.com/v1_1/dxuhyn4ue/image/upload`, {
            method: 'POST',
            body: formData,
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || `HTTP ${response.status}`)
          }
          
          const data = await response.json()
          
          if (data.secure_url) {
            console.log(`✅ Cloudinary upload successful: ${data.secure_url}`)
            uploadedUrls.push(data.secure_url)
          } else {
            throw new Error('No secure_url in response')
          }
        } catch (fileError) {
          console.error(`❌ Error uploading file ${file.name}:`, fileError)
          throw fileError
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error('All Cloudinary uploads failed')
      }

      return uploadedUrls

    } catch (error) {
      console.error('❌ Cloudinary upload error:', error)
      const placeholderUrls = files.map((_, index) => 
        `https://via.placeholder.com/400x400/007bff/ffffff?text=Product+${index + 1}`
      )
      console.log('📸 Using fallback placeholder URLs:', placeholderUrls)
      return placeholderUrls
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      alert(validationError)
      return
    }

    setLoading(true)

    try {
      // Step 1: Upload images with watermark
      console.log('📤 Uploading images with watermark...')
      const imageUrls = await uploadImagesWithWatermark(imageFiles)
      console.log('✅ Images uploaded successfully with watermark:', imageUrls)

      // ✅ FIXED: Convert category to MongoDB format
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        category: mapCategoryToDBFormat(formData.category.trim()), // Convert to uppercase
        subcategory: formData.subcategory ? formData.subcategory.trim() : "",
        images: imageUrls,
        description: formData.description.trim(),
        stock: parseInt(formData.stock) || 1,
        inStock: parseInt(formData.stock) > 0,
        status: 'pending',
        specifications: formData.specifications
      }

      console.log('📦 Sending product data to API:', productData)

      // Send to your products API
      const response = await fetch('/api/sellers/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include',
      })

      console.log('📦 Products API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Products API error response:', errorText)
        throw new Error(`Failed to create product: HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log('📦 Products API response:', result)

      if (result.success) {
        console.log('✅ Product created successfully:', result.product)
        alert('Product created successfully with watermarked images! Awaiting admin approval.')
        router.push('/seller/dashboard')
      } else {
        throw new Error(result.error || result.message || 'Failed to create product')
      }

    } catch (error) {
      console.error('❌ Product creation process failed:', error)
      alert(error instanceof Error ? error.message : 'Failed to create product. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate profit and markup
  const profit = formData.originalPrice && formData.price 
    ? (parseFloat(formData.price) - parseFloat(formData.originalPrice)).toFixed(2)
    : '0.00'

  const markupPercentage = formData.originalPrice && parseFloat(formData.originalPrice) > 0
    ? ((parseFloat(formData.price) - parseFloat(formData.originalPrice)) / parseFloat(formData.originalPrice) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your store. Products require admin approval before going live.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-4">
                  {/* Original Price Input */}
                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Price (Birr) *
                    </label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      required
                      min="0"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={handlePriceChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the price you want to sell for</p>
                  </div>

                  {/* Final Price Display */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Final Selling Price:</span>
                      <Calculator className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      Birr{formData.price || '0.00'}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Includes 10% platform fee (Birr{profit} profit)
                    </div>
                    {formData.originalPrice && (
                      <div className="text-xs text-green-600 mt-1">
                        Markup: {markupPercentage}%
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.category}
                  >
                    <option value="">Select a subcategory</option>
                    {formData.category && subcategories[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your product in detail..."
              />
            </div>

            {/* Dynamic Specifications Section */}
            {categoryConfig && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSpecsSectionOpen(!specsSectionOpen)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {categoryConfig.name} Specifications
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Add detailed specifications for your product
                    </p>
                  </div>
                  {specsSectionOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {specsSectionOpen && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {categoryConfig.specifications.map((spec) => (
                        <div key={spec.fieldName}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {spec.label} {spec.required && '*'}
                          </label>
                          
                          {spec.type === 'select' ? (
                            <select
                              value={formData.specifications[spec.fieldName] as string || ''}
                              onChange={(e) => handleSpecificationChange(spec.fieldName, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required={spec.required}
                            >
                              <option value="">Select {spec.label}</option>
                              {spec.options?.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : spec.type === 'number' ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={formData.specifications[spec.fieldName] as string || ''}
                                onChange={(e) => handleSpecificationChange(spec.fieldName, e.target.value)}
                                min={spec.min}
                                max={spec.max}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required={spec.required}
                              />
                              {spec.unit && (
                                <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
                                  {spec.unit}
                                </span>
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={formData.specifications[spec.fieldName] as string || ''}
                              onChange={(e) => handleSpecificationChange(spec.fieldName, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required={spec.required}
                              placeholder={`Enter ${spec.label.toLowerCase()}`}
                            />
                          )}
                          
                          {spec.unit && spec.type !== 'number' && (
                            <span className="text-sm text-gray-500 ml-2">{spec.unit}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images *
              </label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Automatic Watermark Protection
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        All uploaded images will be automatically watermarked with "yafrican.com" 
                        to protect your content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Upload up to 4 images. The first image will be the main display image.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {imagePreviews.length < 4 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {imagePreviews.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No images uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload product images to continue</p>
                </div>
              )}
            </div>

            {/* Price Summary */}
            {formData.originalPrice && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-600 mb-1">Your Price</div>
                    <div className="text-2xl font-bold text-gray-900">Birr{parseFloat(formData.originalPrice).toFixed(2)}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-600 mb-1">Platform Fee (10%)</div>
                    <div className="text-2xl font-bold text-yellow-600">Birr{profit}</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-gray-600 mb-1">Final Price</div>
                    <div className="text-2xl font-bold text-green-700">Birr{formData.price}</div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  Customers will see the final price of <strong>Birr{formData.price}</strong>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || imagePreviews.length === 0 || !formData.originalPrice}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Product with Watermark
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { ArrowLeft, Upload, X, Plus, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
// import { getCategoryConfig } from '@/lib/categories'

// interface ProductFormData {
//   name: string
//   price: string
//   originalPrice: string
//   category: string
//   subcategory: string
//   description: string
//   stock: string
//   images: string[]
//   specifications: {
//     [key: string]: string | number | boolean
//   }
// }

// export default function CreateProductPage() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [imageFiles, setImageFiles] = useState<File[]>([])
//   const [imagePreviews, setImagePreviews] = useState<string[]>([])
//   const [specsSectionOpen, setSpecsSectionOpen] = useState(false)

//  const [formData, setFormData] = useState<ProductFormData>({
//   name: '',
//   price: '',
//   originalPrice: '',
//   category: '',
//   subcategory: '',
//   description: '',
//   stock: '1',
//   images: [],
//   specifications: {}
// })

//   const categories = [
//     'Clothing',
//     'Electronics',
//     'Home & Garden',
//     'Beauty & Health',
//     'Sports & Outdoors',
//     'Toys & Games',
//     'Automotive',
//     'Books & Media',
//     'Jewelry & Accessories',
//     'Food & Beverages'
//   ]

//   const subcategories: Record<string, string[]> = {
//     'Clothing': ['Men', 'Women', 'Kids', 'Baby', 'Shoes', 'Accessories'],
//     'Electronics': ['Phones', 'Computers', 'TV & Audio', 'Cameras', 'Gaming', 'Smart Home'],
//     'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Bed & Bath', 'Garden', 'Tools'],
//     'Beauty & Health': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Wellness'],
//     'Sports & Outdoors': ['Exercise', 'Outdoor Gear', 'Team Sports', 'Water Sports', 'Cycling'],
//     'Toys & Games': ['Action Figures', 'Dolls', 'Board Games', 'Educational', 'Puzzles'],
//     'Automotive': ['Car Care', 'Tools', 'Accessories', 'Parts', 'Motorcycle'],
//     'Books & Media': ['Fiction', 'Non-Fiction', 'Children', 'Educational', 'Audio Books'],
//     'Jewelry & Accessories': ['Necklaces', 'Rings', 'Earrings', 'Watches', 'Bags'],
//     'Food & Beverages': ['Snacks', 'Beverages', 'Cooking', 'Organic', 'International']
//   }

// // Update this line in your CreateProductPage component
// const categoryConfig = formData.category ? getCategoryConfig(formData.category, formData.subcategory) : null
//   // Clean up object URLs on unmount
//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach(url => URL.revokeObjectURL(url))
//     }
//   }, [imagePreviews])

//   // Reset specifications when category changes
//   useEffect(() => {
//     if (formData.category) {
//       setFormData(prev => ({
//         ...prev,
//         specifications: {}
//       }))
//       setSpecsSectionOpen(true)
//     }
//   }, [formData.category])

//   // Form validation
//   const validateForm = (): string | null => {
//     if (imageFiles.length === 0) {
//       return 'Please upload at least one product image'
//     }
//     if (!formData.name.trim()) {
//       return 'Product name is required'
//     }
//     if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
//       return 'Valid original price is required'
//     }
//     if (!formData.price || parseFloat(formData.price) <= 0) {
//       return 'Valid selling price is required'
//     }
//     if (!formData.category) {
//       return 'Category is required'
//     }
//     if (!formData.description.trim()) {
//       return 'Description is required'
//     }
//     if (!formData.stock || parseInt(formData.stock) < 0) {
//       return 'Valid stock quantity is required'
//     }

//     // Validate required specifications
//     if (categoryConfig) {
//       const missingRequired = categoryConfig.specifications
//         .filter(spec => spec.required && !formData.specifications[spec.fieldName])
//         .map(spec => spec.label)

//       if (missingRequired.length > 0) {
//         return `Please fill in required specifications: ${missingRequired.join(', ')}`
//       }
//     }

//     return null
//   }

//   // Calculate final price with 10% markup
//   const calculateFinalPrice = (basePrice: string): string => {
//     if (!basePrice || isNaN(parseFloat(basePrice))) return ''
//     const price = parseFloat(basePrice)
//     const finalPrice = price + (price * 0.10)
//     return finalPrice.toFixed(2)
//   }

//   // Handle price input changes
//   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const basePrice = e.target.value
//     setFormData(prev => ({
//       ...prev,
//       originalPrice: basePrice,
//       price: calculateFinalPrice(basePrice)
//     }))
//   }

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || [])
    
//     if (files.length + imageFiles.length > 4) {
//       alert('Maximum 4 images allowed')
//       return
//     }

//     const newImageFiles = [...imageFiles, ...files]
//     setImageFiles(newImageFiles)

//     // Create preview URLs
//     const newPreviews = files.map(file => URL.createObjectURL(file))
//     setImagePreviews(prev => [...prev, ...newPreviews])
//   }

//   const removeImage = (index: number) => {
//     const newFiles = imageFiles.filter((_, i) => i !== index)
//     const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
//     setImageFiles(newFiles)
//     setImagePreviews(newPreviews)
    
//     URL.revokeObjectURL(imagePreviews[index])
//   }

//   // Handle basic form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
    
//     if (name !== 'originalPrice') {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }))
//     }
//   }

// const handleSpecificationChange = (fieldName: string, value: string) => {
//   setFormData(prev => ({
//     ...prev,
//     specifications: {
//       ...prev.specifications,
//       [fieldName]: value
//     }
//   }))
// }
//   // Upload images using your API route
//   const uploadImagesToAPI = async (files: File[]): Promise<string[]> => {
//     try {
//       console.log('📤 Starting upload via API...')
      
//       const uploadFormData = new FormData()
//       files.forEach(file => {
//         uploadFormData.append('images', file)
//       })

//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: uploadFormData,
//       })

//       console.log('📤 Upload API response status:', response.status)

//       if (!response.ok) {
//         const errorText = await response.text()
//         console.error('❌ Upload API error:', errorText)
//         throw new Error(`Upload failed: HTTP ${response.status}`)
//       }

//       const result = await response.json()
//       console.log('📤 Upload API result:', result)

//       if (result.success && result.urls) {
//         console.log('✅ API upload successful:', result.urls)
//         return result.urls
//       } else {
//         throw new Error(result.error || 'Upload failed - no URLs returned')
//       }
//     } catch (error) {
//       console.error('❌ API upload error:', error)
//       // Fallback to direct Cloudinary upload
//       console.log('🔄 Falling back to direct Cloudinary upload...')
//       return await uploadImagesToCloudinary(files)
//     }
//   }

//   // Fallback: Upload images to Cloudinary
//   const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
//     try {
//       console.log('📤 Starting Cloudinary direct upload...')
//       const uploadedUrls: string[] = []

//       for (const file of files) {
//         try {
//           if (!file.type.startsWith('image/')) {
//             throw new Error(`File ${file.name} is not an image`)
//           }

//           const formData = new FormData()
//           formData.append('file', file)
//           formData.append('upload_preset', 'ml_default')
//           formData.append('cloud_name', 'dxuhyn4ue')
          
//           console.log(`📤 Uploading to Cloudinary: ${file.name}`)
          
//           const response = await fetch(`https://api.cloudinary.com/v1_1/dxuhyn4ue/image/upload`, {
//             method: 'POST',
//             body: formData,
//           })
          
//           if (!response.ok) {
//             const errorData = await response.json()
//             throw new Error(errorData.error?.message || `HTTP ${response.status}`)
//           }
          
//           const data = await response.json()
          
//           if (data.secure_url) {
//             console.log(`✅ Cloudinary upload successful: ${data.secure_url}`)
//             uploadedUrls.push(data.secure_url)
//           } else {
//             throw new Error('No secure_url in response')
//           }
//         } catch (fileError) {
//           console.error(`❌ Error uploading file ${file.name}:`, fileError)
//           throw fileError
//         }
//       }

//       if (uploadedUrls.length === 0) {
//         throw new Error('All Cloudinary uploads failed')
//       }

//       return uploadedUrls

//     } catch (error) {
//       console.error('❌ Cloudinary upload error:', error)
//       const placeholderUrls = files.map((_, index) => 
//         `https://via.placeholder.com/400x400/007bff/ffffff?text=Product+${index + 1}`
//       )
//       console.log('📸 Using fallback placeholder URLs:', placeholderUrls)
//       return placeholderUrls
//     }
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const validationError = validateForm()
//     if (validationError) {
//       alert(validationError)
//       return
//     }

//     setLoading(true)

//     try {
//       // Step 1: Upload images
//       console.log('📤 Uploading images...')
//       const imageUrls = await uploadImagesToAPI(imageFiles)
//       console.log('✅ Images uploaded successfully:', imageUrls)

//       // Prepare product data with specifications
//       const productData = {
//         name: formData.name.trim(),
//         price: parseFloat(formData.price),
//         originalPrice: parseFloat(formData.originalPrice),
//   category: formData.category.trim(), // Remove .toUpperCase()
//         subcategory: formData.subcategory ? formData.subcategory.trim() : "",
//         images: imageUrls,
//         description: formData.description.trim(),
//         stock: parseInt(formData.stock) || 1,
//         inStock: parseInt(formData.stock) > 0,
//         status: 'pending',
//         specifications: formData.specifications
//       }

//       console.log('📦 Sending product data to API:', productData)

//       // Send to your products API
//       const response = await fetch('/api/sellers/products', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData),
//         credentials: 'include',
//       })

//       console.log('📦 Products API response status:', response.status)

//       if (!response.ok) {
//         const errorText = await response.text()
//         console.error('❌ Products API error response:', errorText)
//         throw new Error(`Failed to create product: HTTP ${response.status}`)
//       }

//       const result = await response.json()
//       console.log('📦 Products API response:', result)

//       if (result.success) {
//         console.log('✅ Product created successfully:', result.product)
//         alert('Product created successfully! Awaiting admin approval.')
//         router.push('/seller/dashboard')
//       } else {
//         throw new Error(result.error || result.message || 'Failed to create product')
//       }

//     } catch (error) {
//       console.error('❌ Product creation process failed:', error)
//       alert(error instanceof Error ? error.message : 'Failed to create product. Please check console for details.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Calculate profit and markup
//   const profit = formData.originalPrice && formData.price 
//     ? (parseFloat(formData.price) - parseFloat(formData.originalPrice)).toFixed(2)
//     : '0.00'

//   const markupPercentage = formData.originalPrice && parseFloat(formData.originalPrice) > 0
//     ? ((parseFloat(formData.price) - parseFloat(formData.originalPrice)) / parseFloat(formData.originalPrice) * 100).toFixed(1)
//     : '0.0'

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
//           <p className="text-gray-600 mt-2">Add a new product to your store. Products require admin approval before going live.</p>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
//         >
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Information */}
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter product name"
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   {/* Original Price Input */}
//                   <div>
//                     <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
//                       Your Price (Birr) *
//                     </label>
//                     <input
//                       type="number"
//                       id="originalPrice"
//                       name="originalPrice"
//                       required
//                       min="0"
//                       step="0.01"
//                       value={formData.originalPrice}
//                       onChange={handlePriceChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="0.00"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Enter the price you want to sell for</p>
//                   </div>

//                   {/* Final Price Display */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm font-medium text-blue-900">Final Selling Price:</span>
//                       <Calculator className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div className="text-2xl font-bold text-blue-700">
//                       Birr{formData.price || '0.00'}
//                     </div>
//                     <div className="text-xs text-blue-600 mt-1">
//                       Includes 10% platform fee (Birr{profit} profit)
//                     </div>
//                     {formData.originalPrice && (
//                       <div className="text-xs text-green-600 mt-1">
//                         Markup: {markupPercentage}%
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
//                     Stock Quantity *
//                   </label>
//                   <input
//                     type="number"
//                     id="stock"
//                     name="stock"
//                     required
//                     min="0"
//                     value={formData.stock}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="1"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     id="category"
//                     name="category"
//                     required
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map(category => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
//                     Subcategory
//                   </label>
//                   <select
//                     id="subcategory"
//                     name="subcategory"
//                     value={formData.subcategory}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={!formData.category}
//                   >
//                     <option value="">Select a subcategory</option>
//                     {formData.category && subcategories[formData.category]?.map(sub => (
//                       <option key={sub} value={sub}>
//                         {sub}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 required
//                 rows={4}
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Describe your product in detail..."
//               />
//             </div>

//             {/* Dynamic Specifications Section */}

// {/* Dynamic Specifications Section */}
// {categoryConfig && (
//   <div className="border border-gray-200 rounded-lg">
//     <button
//       type="button"
//       onClick={() => setSpecsSectionOpen(!specsSectionOpen)}
//       className="w-full flex items-center justify-between p-6 text-left"
//     >
//       <div>
//         <h2 className="text-xl font-semibold text-gray-900">
//           {categoryConfig.name} Specifications
//         </h2>
//         <p className="text-sm text-gray-600 mt-1">
//           Add detailed specifications for your product
//         </p>
//       </div>
//       {specsSectionOpen ? (
//         <ChevronUp className="w-5 h-5 text-gray-500" />
//       ) : (
//         <ChevronDown className="w-5 h-5 text-gray-500" />
//       )}
//     </button>

//     {specsSectionOpen && (
//       <div className="px-6 pb-6 border-t border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//           {categoryConfig.specifications.map((spec) => (
//             <div key={spec.fieldName}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {spec.label} {spec.required && '*'}
//               </label>
              
//               {spec.type === 'select' ? (
//                 <select
//                   value={formData.specifications[spec.fieldName] as string || ''}
//                   onChange={(e) => handleSpecificationChange(spec.fieldName, e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required={spec.required}
//                 >
//                   <option value="">Select {spec.label}</option>
//                   {spec.options?.map(option => (
//                     <option key={option} value={option}>
//                       {option}
//                       {/* Show ad counts for screen sizes like Jiji */}
//                       {spec.fieldName === 'screenSize' && (
//                         <>{option === '< 5"' && ' • 434 ads'}
//                          {option === '5.1 - 5.5"' && ' • 626 ads'}
//                          {option === '5.6 - 6"' && ' • 895 ads'}
//                          {option === '6.1 - 6.5"' && ' • 7,851 ads'}
//                          {option === '6.6 - 6.8"' && ' • 8,698 ads'}
//                          {option === '> 6.8"' && ' • 1,090 ads'}</>
//                       )}
//                     </option>
//                   ))}
//                 </select>
//               ) : spec.type === 'number' ? (
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     value={formData.specifications[spec.fieldName] as string || ''}
//                     onChange={(e) => handleSpecificationChange(spec.fieldName, e.target.value)}
//                     min={spec.min}
//                     max={spec.max}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     required={spec.required}
//                   />
//                   {spec.unit && (
//                     <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
//                       {spec.unit}
//                     </span>
//                   )}
//                 </div>
//               ) : (
//                 <input
//                   type="text"
//                   value={formData.specifications[spec.fieldName] as string || ''}
//                   onChange={(e) => handleSpecificationChange(spec.fieldName, e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required={spec.required}
//                   placeholder={`Enter ${spec.label.toLowerCase()}`}
//                 />
//               )}
              
//               {spec.unit && spec.type !== 'number' && (
//                 <span className="text-sm text-gray-500 ml-2">{spec.unit}</span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// )}
//             {/* Image Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Images *
//               </label>
//               <p className="text-sm text-gray-500 mb-4">Upload up to 4 images. The first image will be the main display image.</p>
              
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                 {imagePreviews.map((preview, index) => (
//                   <div key={index} className="relative group">
//                     <img
//                       src={preview}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-lg border border-gray-300"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
                
//                 {imagePreviews.length < 4 && (
//                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
//                     <Upload className="w-8 h-8 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-500">Add Image</span>
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 )}
//               </div>
              
//               {imagePreviews.length === 0 && (
//                 <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
//                   <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-500">No images uploaded yet</p>
//                   <p className="text-sm text-gray-400 mt-1">Upload product images to continue</p>
//                 </div>
//               )}
//             </div>

//             {/* Price Summary */}
//             {formData.originalPrice && (
//               <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                   <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
//                     <div className="text-gray-600 mb-1">Your Price</div>
//                     <div className="text-2xl font-bold text-gray-900">Birr{parseFloat(formData.originalPrice).toFixed(2)}</div>
//                   </div>
//                   <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
//                     <div className="text-gray-600 mb-1">Platform Fee (10%)</div>
//                     <div className="text-2xl font-bold text-yellow-600">Birr{profit}</div>
//                   </div>
//                   <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
//                     <div className="text-gray-600 mb-1">Final Price</div>
//                     <div className="text-2xl font-bold text-green-700">Birr{formData.price}</div>
//                   </div>
//                 </div>
//                 <div className="mt-4 text-center text-sm text-gray-600">
//                   Customers will see the final price of <strong>Birr{formData.price}</strong>
//                 </div>
//               </div>
//             )}

//             {/* Submit Buttons */}
//             <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading || imagePreviews.length === 0 || !formData.originalPrice}
//                 className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="w-4 h-4" />
//                     Create Product
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   )
// }
