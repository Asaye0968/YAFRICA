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

// ✅ FIXED: Add proper type for params with Promise
interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single product (seller-owned)
export async function GET(
  req: Request,
  { params }: RouteParams
) {
  try {
    // ✅ FIXED: Await the params
    const { id } = await params
    const payload = verifyToken(req)
    await connectMongo()

    const product = await Product.findOne({ _id: id, seller: payload.id })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory || '',
        images: product.images || [],
        description: product.description || '',
        status: product.status || 'pending',
        inStock: product.inStock,
        stock: product.stock || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })
  } catch (error: any) {
    const message = error.message || "Server error"
    const status = message === "Not authenticated" ? 401 : message === "Access denied" ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  try {
    // ✅ FIXED: Await the params
    const { id } = await params
    const payload = verifyToken(req)
    await connectMongo()

    const product = await Product.findOne({ 
      _id: id, 
      seller: payload.id 
    })

    if (!product) {
      return NextResponse.json({ 
        error: "Product not found" 
      }, { status: 404 })
    }

    await Product.findByIdAndDelete(id)

    return NextResponse.json({ 
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error: any) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ 
      error: error.message || "Server error" 
    }, { status: 500 })
  }
}

// PATCH update product fields (seller-owned)
export async function PATCH(
  req: Request,
  { params }: RouteParams
) {
  try {
    // ✅ FIXED: Await the params
    const { id } = await params
    const payload = verifyToken(req)
    await connectMongo()

    const body = await req.json()
    const update: any = { updatedAt: new Date() }

    if (typeof body.name === 'string') update.name = body.name.trim()
    if (body.price !== undefined) update.price = parseFloat(body.price)
    if (typeof body.category === 'string') update.category = body.category.trim()
    if (typeof body.subcategory === 'string') update.subcategory = body.subcategory.trim()
    if (typeof body.description === 'string') update.description = body.description.trim()
    if (body.stock !== undefined) {
      const stockVal = parseInt(body.stock)
      update.stock = stockVal
      if (body.inStock === undefined) update.inStock = stockVal > 0
    }
    if (body.inStock !== undefined) update.inStock = Boolean(body.inStock)

    const updated = await Product.findOneAndUpdate(
      { _id: id, seller: payload.id },
      update,
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: {
        _id: updated._id,
        name: updated.name,
        price: updated.price,
        category: updated.category,
        subcategory: updated.subcategory || '',
        images: updated.images || [],
        description: updated.description || '',
        status: updated.status || 'pending',
        inStock: updated.inStock,
        stock: updated.stock || 0,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      }
    })
  } catch (error: any) {
    const message = error.message || 'Server error'
    const status = message === 'Not authenticated' ? 401 : message === 'Access denied' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}