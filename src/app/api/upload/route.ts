//api/upload/route.ts - FIXED
import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { Readable } from 'stream'
import { addMultipleWatermarks, addSimpleWatermark } from '@/lib/watermark'

// Helper function to convert Buffer to stream
function bufferToStream(buffer: Buffer) {
  const readable = new Readable()
  readable.push(buffer)
  readable.push(null)
  return readable
}

// Helper function to safely convert ArrayBuffer to Buffer
function arrayBufferToBuffer(arrayBuffer: ArrayBuffer): Buffer {
  return Buffer.from(new Uint8Array(arrayBuffer));
}

export async function POST(req: Request) {
  try {
    console.log('📤 Starting Cloudinary upload process with watermark...')

    const formData = await req.formData()
    const files = formData.getAll('images') as File[]
    const addWatermark = formData.get('addWatermark') === 'true'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const uploadedUrls: string[] = []
    const fileArray = files.slice(0, 4)

    console.log(`📤 Processing ${fileArray.length} files, watermark: ${addWatermark}`)

    for (const [index, file] of fileArray.entries()) {
      try {
        console.log(`📤 Processing file ${index + 1}:`, file.name, `(${file.size} bytes)`)

        // Validate file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          console.error(`❌ File too large: ${file.name} (${file.size} bytes)`)
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`)
        }

        const arrayBuffer = await file.arrayBuffer()
        let buffer = arrayBufferToBuffer(arrayBuffer)

        // Apply watermark if requested
        if (addWatermark) {
          console.log(`🎨 Adding watermark to: ${file.name}`)
          try {
            // Choose watermark method based on file type/size
            if (file.size > 2 * 1024 * 1024) {
              buffer = await addSimpleWatermark(buffer)
            } else {
              buffer = await addMultipleWatermarks(buffer)
            }
            console.log(`✅ Watermark applied successfully to: ${file.name}`)
          } catch (watermarkError) {
            console.error(`❌ Watermark failed for ${file.name}:`, watermarkError)
            buffer = arrayBufferToBuffer(arrayBuffer)
          }
        }

        const stream = bufferToStream(buffer)

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const originalName = file.name.replace(/\.[^/.]+$/, "")
        const uniqueFilename = `product_${timestamp}_${randomString}_${originalName}`

        console.log(`📤 Uploading with unique filename: ${uniqueFilename}`)

        // ✅ FIXED: Remove format: 'auto' from Cloudinary upload
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'nextjs_products',
              public_id: uniqueFilename,
              use_filename: false,
              unique_filename: true,
              overwrite: false,
              quality: 'auto:good',
              // format: 'auto', // ❌ REMOVED - This was causing the error
            },
            (error, result) => {
              if (error) {
                console.error(`❌ Cloudinary upload error for ${file.name}:`, error)
                reject(error)
              } else resolve(result)
            }
          )
          stream.pipe(uploadStream)
        })

        if (result.secure_url) {
          uploadedUrls.push(result.secure_url)
          console.log(`✅ Upload successful: ${result.secure_url}`)
        } else {
          throw new Error('No secure_url in Cloudinary response')
        }

      } catch (fileError) {
        console.error(`❌ Error uploading file ${file.name}:`, fileError)
        continue
      }
    }

    if (uploadedUrls.length === 0) {
      throw new Error('All file uploads failed')
    }

    console.log('🎉 Uploads completed successfully. URLs:', uploadedUrls)

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `Successfully uploaded ${uploadedUrls.length} file(s)${addWatermark ? ' with watermarks' : ''}`,
      watermarked: addWatermark
    })

  } catch (error) {
    console.error('❌ Upload API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Server error during upload',
      },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

// // src/app/api/upload/route.ts
// import { NextResponse } from 'next/server'
// import cloudinary from '@/lib/cloudinary'
// import { Readable } from 'stream'

// // Helper function to convert Buffer to stream
// function bufferToStream(buffer: Buffer) {
//   const readable = new Readable()
//   readable.push(buffer)
//   readable.push(null)
//   return readable
// }

// export async function POST(req: Request) {
//   try {
//     console.log('📤 Starting Cloudinary upload process...')

//     const formData = await req.formData()
//     const files = formData.getAll('images') as File[]

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
//     }

//     const uploadedUrls: string[] = []
//     const fileArray = files.slice(0, 4) // Limit to 4 files

//     console.log(`📤 Processing ${fileArray.length} files:`, fileArray.map(f => f.name))

//     for (const [index, file] of fileArray.entries()) {
//       try {
//         console.log(`📤 Processing file ${index + 1}:`, file.name, `(${file.size} bytes)`)

//         // Validate file size (max 5MB per file)
//         if (file.size > 5 * 1024 * 1024) {
//           console.error(`❌ File too large: ${file.name} (${file.size} bytes)`)
//           throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`)
//         }

//         const arrayBuffer = await file.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)
//         const stream = bufferToStream(buffer)

//         // Generate unique filename to prevent overwrites
//         const timestamp = Date.now()
//         const randomString = Math.random().toString(36).substring(2, 15)
//         const originalName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
//         const uniqueFilename = `product_${timestamp}_${randomString}_${originalName}`

//         console.log(`📤 Uploading with unique filename: ${uniqueFilename}`)

//         // Upload to Cloudinary with UNIQUE filenames
//         const result = await new Promise<any>((resolve, reject) => {
//           const uploadStream = cloudinary.uploader.upload_stream(
//             {
//               folder: 'nextjs_products',
//               public_id: uniqueFilename, // Use unique filename
//               use_filename: false,       // Don't use original filename
//               unique_filename: true,     // Generate unique names
//               overwrite: false,          // Don't overwrite existing files
//             },
//             (error, result) => {
//               if (error) reject(error)
//               else resolve(result)
//             }
//           )
//           stream.pipe(uploadStream)
//         })

//         if (result.secure_url) {
//           uploadedUrls.push(result.secure_url)
//           console.log(`✅ Upload successful: ${result.secure_url}`)
//         } else {
//           throw new Error('No secure_url in Cloudinary response')
//         }

//       } catch (fileError) {
//         console.error(`❌ Error uploading file ${file.name}:`, fileError)
//         // Continue with other files even if one fails
//         continue
//       }
//     }

//     if (uploadedUrls.length === 0) {
//       throw new Error('All file uploads failed')
//     }

//     console.log('🎉 Uploads completed successfully. URLs:', uploadedUrls)

//     return NextResponse.json({
//       success: true,
//       urls: uploadedUrls,
//       message: `Successfully uploaded ${uploadedUrls.length} file(s)`,
//     })

//   } catch (error) {
//     console.error('❌ Upload API error:', error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : 'Server error during upload',
//       },
//       { status: 500 }
//     )
//   }
// }

// // Disable body parser for file uploads
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// // src/app/api/upload/route.ts
// import { NextResponse } from 'next/server'

// const STORAGE_ZONE = 'yafricanimages'
// const BUNNY_STORAGE_PASSWORD = process.env.BUNNY_STORAGE_PASSWORD
// const BUNNY_CDN_URL = 'https://yafrican.b-cdn.net'

// export async function POST(req: Request) {
//   try {
//     console.log('📤 Starting file upload process...')
    
//     const formData = await req.formData()
//     const files = formData.getAll('images') as File[]

//     console.log(`📤 Received ${files.length} files`)

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
//     }

//     const uploadedUrls: string[] = []
//     const fileArray = files.slice(0, 4) // Limit to 4 files

//     for (const [index, file] of fileArray.entries()) {
//       try {
//         console.log(`📤 Processing file ${index + 1}:`, file.name, `(${file.size} bytes)`)

//         // Validate file size (max 5MB per file)
//         if (file.size > 5 * 1024 * 1024) {
//           console.error(`❌ File too large: ${file.name} (${file.size} bytes)`)
//           throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`)
//         }

//         const arrayBuffer = await file.arrayBuffer()
//         const buffer = Buffer.from(arrayBuffer)
        
//         // Generate unique filename
//         const timestamp = Date.now()
//         const randomString = Math.random().toString(36).substring(2, 15)
//         const cleanFileName = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.-]/g, '')
//         const filename = `product-${timestamp}-${randomString}-${cleanFileName}`

//         console.log(`📤 Uploading to BunnyCDN: ${filename}`)

//         const uploadResponse = await fetch(
//           `https://storage.bunnycdn.com/${STORAGE_ZONE}/${filename}`,
//           {
//             method: 'PUT',
//             headers: {
//               'AccessKey': BUNNY_STORAGE_PASSWORD!,
//               'Content-Type': file.type || 'application/octet-stream',
//             },
//             body: buffer,
//           }
//         )

//         if (!uploadResponse.ok) {
//           const errorText = await uploadResponse.text()
//           console.error('❌ BunnyCDN upload failed:', {
//             status: uploadResponse.status,
//             statusText: uploadResponse.statusText,
//             filename,
//             error: errorText
//           })
//           throw new Error(`Failed to upload ${file.name}`)
//         }

//         const imageUrl = `${BUNNY_CDN_URL}/${filename}`
//         uploadedUrls.push(imageUrl)
//         console.log(`✅ Upload successful: ${imageUrl}`)

//       } catch (fileError) {
//         console.error(`❌ Error processing file ${file.name}:`, fileError)
//         // Continue with other files even if one fails
//         continue
//       }
//     }

//     if (uploadedUrls.length === 0) {
//       throw new Error('All file uploads failed')
//     }

//     console.log('🎉 Uploads completed successfully:', uploadedUrls)
    
//     return NextResponse.json({ 
//       success: true,
//       urls: uploadedUrls,
//       message: `Successfully uploaded ${uploadedUrls.length} file(s)`
//     })

//   } catch (error) {
//     console.error('❌ Upload API error:', error)
//     return NextResponse.json({ 
//       success: false,
//       error: error instanceof Error ? error.message : 'Server error during upload'
//     }, { status: 500 })
//   }
// }

// // Add this to handle large file sizes
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }