import { type NextRequest, NextResponse } from "next/server"
import { getDocuments, createDocument, updateDocument, deleteDocument } from "@/lib/database"

// GET - Fetch all documents
export async function GET() {
  try {
    const documents = await getDocuments()
    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error("GET /api/documents error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch documents" }, { status: 500 })
  }
}

// POST - Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/documents - Received data:", body)

    const { name, description, fileType, category, fileUrl, fileSize, originalName } = body

    // Validate required fields
    if (!name || !description || !fileType || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, description, fileType, category" },
        { status: 400 },
      )
    }

    // Validate data types
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof fileType !== "string" ||
      typeof category !== "string"
    ) {
      return NextResponse.json({ success: false, error: "Invalid data types for required fields" }, { status: 400 })
    }

    const documentData = {
      name: name.trim(),
      description: description.trim(),
      fileType,
      category,
      uploadDate: new Date().toISOString(),
      fileUrl: fileUrl || "",
      fileSize: fileSize || undefined,
      originalName: originalName || undefined,
    }

    console.log("Document data before creation:", documentData)
    const document = await createDocument(documentData)

    console.log("Document created successfully:", document)
    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("POST /api/documents error:", error)
    return NextResponse.json({ success: false, error: "Failed to create document" }, { status: 500 })
  }
}

// PUT - Update existing document
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("PUT /api/documents - Received data:", body)

    const { id, name, description, fileType, category, fileUrl, fileSize, originalName } = body

    // Validate required fields
    if (!id || !name || !description || !fileType || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, name, description, fileType, category" },
        { status: 400 },
      )
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid document ID format" }, { status: 400 })
    }

    const updateData = {
      name: name.trim(),
      description: description.trim(),
      fileType,
      category,
      fileUrl: fileUrl || "",
      fileSize: fileSize || undefined,
      originalName: originalName || undefined,
    }

    const document = await updateDocument(id, updateData)

    if (!document) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 })
    }

    console.log("Document updated successfully:", document)
    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("PUT /api/documents error:", error)
    return NextResponse.json({ success: false, error: "Failed to update document" }, { status: 500 })
  }
}

// DELETE - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Document ID is required" }, { status: 400 })
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid document ID format" }, { status: 400 })
    }

    const deleted = await deleteDocument(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 })
    }

    console.log("Document deleted successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/documents error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete document" }, { status: 500 })
  }
}
