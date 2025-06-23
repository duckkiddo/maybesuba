import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/database"

// GET - Fetch all products
export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/products - Received data:", body)

    const { name, description, price, category, subcategory, image, inStock, whatsappPhone } = body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, description, price, category" },
        { status: 400 },
      )
    }

    // Validate data types
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof price !== "string" ||
      typeof category !== "string"
    ) {
      return NextResponse.json({ success: false, error: "Invalid data types for required fields" }, { status: 400 })
    }

    // Validate category
    const validCategories = ["Manasuli Premium Rice", "Surayadaya Premium Rice", "Local Chamal", "Bhus", "Kanika"]

    if (!validCategories.includes(category)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 })
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      category,
      subcategory: subcategory || undefined,
      image: image || undefined,
      inStock: Boolean(inStock),
      whatsappPhone: whatsappPhone || undefined,
    }

    const product = await createProduct(productData)

    console.log("Product created successfully:", product)
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("PUT /api/products - Received data:", body)

    const { id, name, description, price, category, subcategory, image, inStock, whatsappPhone } = body

    // Validate required fields
    if (!id || !name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, name, description, price, category" },
        { status: 400 },
      )
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 })
    }

    // Validate category
    const validCategories = ["Manasuli Premium Rice", "Surayadaya Premium Rice", "Local Chamal", "Bhus", "Kanika"]

    if (!validCategories.includes(category)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 })
    }

    const updateData = {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      category,
      subcategory: subcategory || undefined,
      image: image || undefined,
      inStock: Boolean(inStock),
      whatsappPhone: whatsappPhone || undefined,
    }

    const product = await updateProduct(id, updateData)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    console.log("Product updated successfully:", product)
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("PUT /api/products error:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid product ID format" }, { status: 400 })
    }

    const deleted = await deleteProduct(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    console.log("Product deleted successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/products error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
