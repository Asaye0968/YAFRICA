import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectMongo from "@/lib/mongodb"
import Product from "@/models/Product"

const JWT_SECRET = process.env.JWT_SECRET!

function verifyToken(req: Request) {
  const cookieHeader = req.headers.get("cookie") || ""
  const match = cookieHeader.match(/token=([^;]+)/)
  const token = match ? match[1] : null

  if (!token) throw new Error("Not authenticated")
  
  const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string }
  if (payload.role !== "seller") throw new Error("Access denied")
  
  return payload
}

// ✅ FIXED: Proper type for Next.js 15
interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH update product stock
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    // ✅ FIXED: Properly await params
    const { id } = await params
    
    const payload = verifyToken(request)
    await connectMongo()

    const { inStock, stock } = await request.json()

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Product ID is required"
      }, { status: 400 })
    }

    console.log('🔧 Updating product stock:', { id, inStock, stock })

    const product = await Product.findOne({
      _id: id,
      seller: payload.id
    })

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found or access denied"
      }, { status: 404 })
    }

    // Build update object
    const update: any = { updatedAt: new Date() }
    
    if (inStock !== undefined) {
      update.inStock = Boolean(inStock)
    }
    
    if (stock !== undefined) {
      const stockValue = parseInt(stock)
      update.stock = stockValue
      // Auto-update inStock based on stock quantity if not explicitly set
      if (inStock === undefined) {
        update.inStock = stockValue > 0
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: "Failed to update product"
      }, { status: 500 })
    }

    // Return normalized product data with specifications
    const formattedProduct = {
      _id: updatedProduct._id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      originalPrice: updatedProduct.originalPrice,
      category: updatedProduct.category.toUpperCase(),
      subcategory: updatedProduct.subcategory,
      images: updatedProduct.images,
      description: updatedProduct.description,
      status: updatedProduct.status,
      inStock: updatedProduct.inStock,
      stock: updatedProduct.stock,
      seller: updatedProduct.seller,
      specifications: updatedProduct.specifications || {},
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    }

    console.log('✅ Product stock updated successfully:', {
      id: formattedProduct._id,
      name: formattedProduct.name,
      inStock: formattedProduct.inStock,
      stock: formattedProduct.stock
    })

    return NextResponse.json({
      success: true,
      product: formattedProduct,
      message: "Product stock updated successfully"
    })

  } catch (error: any) {
    console.error("❌ Product stock update error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}

// GET product stock
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // ✅ FIXED: Properly await params
    const { id } = await params
    
    const payload = verifyToken(request)
    await connectMongo()

    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Product ID is required"
      }, { status: 400 })
    }

    const product = await Product.findOne({
      _id: id,
      seller: payload.id
    })

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found or access denied"
      }, { status: 404 })
    }

    const formattedProduct = {
      _id: product._id,
      name: product.name,
      inStock: product.inStock,
      stock: product.stock,
      status: product.status
    }

    return NextResponse.json({
      success: true,
      product: formattedProduct
    })

  } catch (error: any) {
    console.error("❌ Product stock fetch error:", error)
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error"
    }, { status: 500 })
  }
}
// import { NextResponse } from "next/server"
// import jwt from "jsonwebtoken"
// import connectMongo from "@/lib/mongodb"
// import Product from "@/models/Product"

// const JWT_SECRET = process.env.JWT_SECRET!

// function verifyToken(req: Request) {
//   const cookieHeader = req.headers.get("cookie") || ""
//   // Use same cookie name as other seller routes
//   const match = cookieHeader.match(/token=([^;]+)/)
//   const token = match ? match[1] : null

//   if (!token) throw new Error("Not authenticated")
  
//   const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string }
//   if (payload.role !== "seller") throw new Error("Access denied")
  
//   return payload
// }

// // PATCH update stock status
// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const payload = verifyToken(req)
//     await connectMongo()

//     const { inStock } = await req.json()

//     // ✅ FIXED: Use 'seller' field instead of 'sellerId'
//     const product = await Product.findOne({ 
//       _id: params.id, 
//       seller: payload.id 
//     })

//     if (!product) {
//       return NextResponse.json({ 
//         error: "Product not found" 
//       }, { status: 404 })
//     }

//     // When marking out of stock, also zero stock so public listing reflects it.
//     // When marking back to in stock and stock is 0, set to 1 as a minimal placeholder.
//     const update: any = { inStock, updatedAt: new Date() }
//     if (inStock === false) {
//       update.stock = 0
//     } else if (inStock === true && (product.stock === 0 || product.stock === undefined || product.stock === null)) {
//       update.stock = 1
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       params.id,
//       update,
//       { new: true }
//     )

//     return NextResponse.json({ 
//       success: true, 
//       product: updatedProduct 
//     })
//   } catch (error: any) {
//     console.error("Stock update error:", error)
//     const message = error.message || "Server error"
//     const status = message === "Not authenticated" ? 401
//       : message === "Access denied" ? 403
//       : 500
//     return NextResponse.json({ 
//       error: message 
//     }, { status })
//   }
// }