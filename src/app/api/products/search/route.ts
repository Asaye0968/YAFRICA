// app/api/products/search/route.ts - COMPLETE VERSION
import { NextRequest, NextResponse } from 'next/server'
import Product from '@/models/Product'
import connectMongo from '@/lib/mongodb'
import { getCategoryConfig } from '@/lib/categories'

export async function GET(request: NextRequest) {
  try {
    await connectMongo()
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const subcategory = searchParams.get('subcategory') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    
    // Dynamic filters - will vary by category
    const condition = searchParams.get('condition')
    const brand = searchParams.get('brand')
    const screenSize = searchParams.get('screenSize')
    const ram = searchParams.get('ram')
    const storage = searchParams.get('storage')
    const size = searchParams.get('size')
    const gender = searchParams.get('gender')
    const material = searchParams.get('material')
    const color = searchParams.get('color')
    const sportType = searchParams.get('sportType')
    const ageRange = searchParams.get('ageRange')
    const vehicleType = searchParams.get('vehicleType')
    const fuelType = searchParams.get('fuelType')
    const transmission = searchParams.get('transmission')
    const propertyType = searchParams.get('propertyType')
    const bedrooms = searchParams.get('bedrooms')
    const productType = searchParams.get('productType')
    
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build filter object
    const filter: any = { status: 'approved' }

    // Text search across multiple fields
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'specifications.model': { $regex: query, $options: 'i' } },
        { 'specifications.brand': { $regex: query, $options: 'i' } }
      ]
    }
//added

//end
    // Category filter
    if (category) {
      filter.category = category.toUpperCase()
    }

    // Subcategory filter
    if (subcategory) {
      filter.subcategory = { $regex: subcategory, $options: 'i' }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    // Dynamic specification filters based on category
    const specificationFilters: any = {}
    
    // Common filters for all categories
    if (condition) specificationFilters['specifications.condition'] = condition
    if (brand) specificationFilters['specifications.brand'] = brand
    if (color) specificationFilters['specifications.color'] = color
    
    // Electronics-specific filters
    if (screenSize) specificationFilters['specifications.screenSize'] = screenSize
    if (ram) specificationFilters['specifications.ram'] = ram
    if (storage) specificationFilters['specifications.storage'] = storage
    
    // Clothing-specific filters
    if (size) specificationFilters['specifications.size'] = size
    if (gender) specificationFilters['specifications.gender'] = gender
    if (material) specificationFilters['specifications.material'] = material
    
    // Sports-specific filters
    if (sportType) specificationFilters['specifications.sportType'] = sportType
    
    // Toys-specific filters
    if (ageRange) specificationFilters['specifications.ageRange'] = ageRange
    
    // Automotive-specific filters
    if (vehicleType) specificationFilters['specifications.vehicleType'] = vehicleType
    if (fuelType) specificationFilters['specifications.fuelType'] = fuelType
    if (transmission) specificationFilters['specifications.transmission'] = transmission
    
    // Real Estate/Home-specific filters
    if (propertyType) specificationFilters['specifications.propertyType'] = propertyType
    if (bedrooms) specificationFilters['specifications.bedrooms'] = bedrooms
    
    // Beauty/General-specific filters
    if (productType) specificationFilters['specifications.productType'] = productType

    // Add specification filters to main filter
    if (Object.keys(specificationFilters).length > 0) {
      Object.assign(filter, specificationFilters)
    }

    // Build sort object
    const sort: any = {}
    switch (sortBy) {
      case 'price':
        sort.price = sortOrder === 'asc' ? 1 : -1
        break
      case 'name':
        sort.name = sortOrder === 'asc' ? 1 : -1
        break
      case 'rating':
        sort.rating = sortOrder === 'asc' ? 1 : -1
        break
      default:
        sort.createdAt = -1
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('seller', 'name rating')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Product.countDocuments(filter)

    // Get available filters for the current results
    const availableFilters = await getAvailableFilters(filter, category)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: availableFilters,
      appliedFilters: {
        query,
        category,
        subcategory,
        minPrice,
        maxPrice,
        condition,
        brand,
        screenSize,
        ram,
        storage,
        size,
        gender,
        material,
        color,
        sportType,
        ageRange,
        vehicleType,
        fuelType,
        transmission,
        propertyType,
        bedrooms,
        productType
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Enhanced filter function with category-specific filters
async function getAvailableFilters(baseFilter: any, category: string) {
  const categoryConfig = getCategoryConfig(category)
  
  const filters: any = {
    // Common filters for all categories
    priceRanges: [
      { label: 'Under 1,000 Br', min: 0, max: 1000, count: 0 },
      { label: '1,000 - 5,000 Br', min: 1000, max: 5000, count: 0 },
      { label: '5,000 - 10,000 Br', min: 5000, max: 10000, count: 0 },
      { label: '10,000 - 50,000 Br', min: 10000, max: 50000, count: 0 },
      { label: 'More than 50,000 Br', min: 50000, max: 10000000, count: 0 }
    ],
    
    // Dynamic filters based on category
    brands: [] as Array<{ name: string; count: number }>,
    conditions: [] as Array<{ name: string; count: number }>,
    colors: [] as Array<{ name: string; count: number }>,
    
    // Category-specific filters
    priceStats: { min: 0, max: 0 }
  }

  try {
    // Get price statistics
    const priceStats = await Product.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ])
    
    if (priceStats.length > 0) {
      filters.priceStats = {
        min: Math.floor(priceStats[0].minPrice),
        max: Math.ceil(priceStats[0].maxPrice)
      }
    }

    // Common filters for all categories
    const [brands, conditions, colors] = await Promise.all([
      getFilterWithCounts('specifications.brand', baseFilter),
      getFilterWithCounts('specifications.condition', baseFilter),
      getFilterWithCounts('specifications.color', baseFilter)
    ])
    
    filters.brands = brands
    filters.conditions = conditions
    filters.colors = colors

    // Category-specific filters
    if (categoryConfig) {
      for (const spec of categoryConfig.specifications) {
        if (spec.type === 'select' && spec.options) {
          const fieldData = await getFilterWithCounts(`specifications.${spec.fieldName}`, baseFilter)
          filters[spec.fieldName] = fieldData
        }
      }
    }

    // Calculate price range counts
    for (const range of filters.priceRanges) {
      const count = await Product.countDocuments({
        ...baseFilter,
        price: { $gte: range.min, $lte: range.max }
      })
      range.count = count
    }

  } catch (error) {
    console.error('Error getting available filters:', error)
  }

  return filters
}

// Helper function to get filter options with counts
async function getFilterWithCounts(field: string, baseFilter: any) {
  try {
    const results = await Product.aggregate([
      { $match: { ...baseFilter, [field]: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    return results.map(item => ({
      name: item._id,
      count: item.count
    }))
  } catch (error) {
    console.error(`Error getting ${field} filters:`, error)
    return []
  }
}