// src/app/api/payment-images/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await the params first
    const { path } = await params
    const filename = path[path.length - 1]
    
    // Security check - validate filename
    if (!filename || !/^[a-zA-Z0-9._-]+$/.test(filename)) {
      return new NextResponse('Invalid filename', { status: 400 })
    }

    // Construct the full file path
    const filePath = join(process.cwd(), 'public', 'uploads', 'payment-proofs', filename)
    
    try {
      // Read the image file
      const imageBuffer = readFileSync(filePath)
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase()
      const contentType = getContentType(ext)
      
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      })
    } catch (error) {
      console.error('File not found:', filePath)
      return new NextResponse('Image not found', { status: 404 })
    }
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

function getContentType(ext: string | undefined): string {
  const types: { [key: string]: string } = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }
  return types[ext || ''] || 'application/octet-stream'
}