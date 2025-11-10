// app/api/debug/users/route.ts
import { NextResponse } from 'next/server'
import connectMongo from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    await connectMongo()
    const users = await User.find({}).select('_id email name role createdAt')
    
    return NextResponse.json({ 
      success: true, 
      users: users.map(user => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }))
    })
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}