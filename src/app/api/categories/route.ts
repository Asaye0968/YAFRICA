import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import Category from '@/models/Category'

const categories = [
  { name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Cameras'] },
  { name: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  { name: 'Toys', subcategories: ['Action Figures', 'Puzzles', 'Board Games'] },
  { name: 'Home & Kitchen', subcategories: ['Furniture', 'Appliances', 'Decor'] },
  { name: 'Beauty', subcategories: ['Makeup', 'Skincare', 'Hair Care'] },
  { name: 'Sports', subcategories: ['Outdoor', 'Gym', 'Team Sports'] },
  { name: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Children'] },
]

export async function GET() {
  try {
    await connectMongo()

    // Optional: Clear old data
    await Category.deleteMany({})
    await Category.insertMany(categories)

    return NextResponse.json({
      message: 'Categories created successfully.',
      categories,
    })
  } catch (error: any) {
    console.error('❌ Failed to create categories:', error)
    return NextResponse.json(
      { error: 'Failed to create categories', detail: error.message },
      { status: 500 }
    )
  }
}
