import { NextResponse } from 'next/server';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const uploadsPath = join(process.cwd(), 'public', 'uploads', 'payment-proofs');
    const exists = existsSync(uploadsPath);
    
    if (!exists) {
      return NextResponse.json({ 
        error: 'Uploads directory does not exist',
        path: uploadsPath 
      });
    }

    const files = readdirSync(uploadsPath);
    
    return NextResponse.json({
      uploadsPath,
      fileCount: files.length,
      files: files.slice(0, 20) // Show first 20 files
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to read directory',
      details: error 
    });
  }
}