// lib/recommendationEngine.ts
import Product from '@/models/Product'

interface UserDocument {
  searchHistory: Array<{
    query: string
    category: string
    subcategory: string
    timestamp: Date
  }>
  productViews: Array<{
    productId: any
    timestamp: Date
  }>
}

export async function getPersonalizedRecommendations(
  user: UserDocument, 
  currentQuery: string, 
  category: string, 
  limit: number = 10
) {
  const recommendations = []
  
  // Strategy 1: Similar searches from history
  if (user.searchHistory && user.searchHistory.length > 0) {
    const similarSearches = findSimilarSearches(user.searchHistory, currentQuery)
    for (const search of similarSearches.slice(0, 3)) {
      const products = await Product.find({
        $or: [
          { name: { $regex: search.query, $options: 'i' } },
          { category: search.category },
          { subcategory: search.subcategory }
        ],
        status: 'active',
        inStock: true
      })
      .limit(5)
      .sort({ createdAt: -1 })
      
      recommendations.push(...products)
    }
  }

  // Strategy 2: Based on viewed products
  if (user.productViews && user.productViews.length > 0) {
    const viewedProductIds = user.productViews.map(view => view.productId)
    
    // Find products similar to viewed ones
    const viewedProducts = await Product.find({
      _id: { $in: viewedProductIds.slice(0, 5) }
    })
    
    for (const viewedProduct of viewedProducts) {
      const similarProducts = await Product.find({
        $or: [
          { category: viewedProduct.category },
          { subcategory: viewedProduct.subcategory },
          { 
            $text: { 
              $search: extractKeywords(viewedProduct.name).join(' ') 
            } 
          }
        ],
        _id: { $ne: viewedProduct._id },
        status: 'active',
        inStock: true
      })
      .limit(3)
      .sort({ createdAt: -1 })
      
      recommendations.push(...similarProducts)
    }
  }

  // Strategy 3: Collaborative filtering based on category preferences
  const userCategories = getUserPreferredCategories(user)
  if (userCategories.length > 0) {
    const categoryProducts = await Product.find({
      category: { $in: userCategories },
      status: 'active',
      inStock: true
    })
    .limit(5)
    .sort({ isNew: -1, createdAt: -1 })
    
    recommendations.push(...categoryProducts)
  }

  // Remove duplicates and limit results
  const uniqueRecommendations = removeDuplicates(recommendations)
  return uniqueRecommendations.slice(0, limit)
}

export async function getGeneralRecommendations(currentQuery: string, category: string, limit: number = 10) {
  let query: any = { 
    status: 'active', 
    inStock: true 
  }

  if (currentQuery) {
    query.$or = [
      { name: { $regex: currentQuery, $options: 'i' } },
      { description: { $regex: currentQuery, $options: 'i' } },
      { category: { $regex: currentQuery, $options: 'i' } }
    ]
  }

  if (category && category !== 'All Categories') {
    query.category = category
  }

  // Get popular products (you might want to add a popularity score to your Product model)
  const recommendations = await Product.find(query)
    .limit(limit)
    .sort({ 
      isNew: -1, 
      isOnSale: -1, 
      createdAt: -1 
    })

  return recommendations
}

// Helper functions
function findSimilarSearches(searchHistory: any[], currentQuery: string) {
  return searchHistory
    .filter(search => 
      calculateSimilarity(search.query, currentQuery.toLowerCase()) > 0.3 ||
      search.category === currentQuery
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ')
  const words2 = str2.split(' ')
  const commonWords = words1.filter(word => words2.includes(word))
  return commonWords.length / Math.max(words1.length, words2.length)
}

function extractKeywords(text: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
  return text
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.includes(word))
}

function getUserPreferredCategories(user: UserDocument): string[] {
  if (!user.searchHistory) return []
  
  const categoryCount: { [key: string]: number } = {}
  
  user.searchHistory.forEach(search => {
    if (search.category && search.category !== 'All Categories') {
      categoryCount[search.category] = (categoryCount[search.category] || 0) + 1
    }
  })
  
  return Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category)
}

function removeDuplicates(products: any[]): any[] {
  const seen = new Set()
  return products.filter(product => {
    const duplicate = seen.has(product._id.toString())
    seen.add(product._id.toString())
    return !duplicate
  })
}