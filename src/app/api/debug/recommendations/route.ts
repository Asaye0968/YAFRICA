import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' })
    }

    return NextResponse.json({
      userId: user._id,
      searchHistory: user.searchHistory || [],
      productViews: user.productViews || [],
      searchCount: user.searchHistory?.length || 0,
      viewCount: user.productViews?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed' })
  }
}