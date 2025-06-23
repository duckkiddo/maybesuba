import { type NextRequest, NextResponse } from "next/server"
import { getNotices, createNotice, updateNotice, deleteNotice } from "@/lib/database"

// GET - Fetch all notices
export async function GET() {
  try {
    const notices = await getNotices()
    return NextResponse.json({ success: true, notices })
  } catch (error) {
    console.error("GET /api/notices error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notices" }, { status: 500 })
  }
}

// POST - Create new notice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/notices - Received data:", body)

    const {
      title,
      content,
      description,
      category,
      fileUrl,
      fileType,
      fileSize,
      originalName,
      showAsPopup,
      isActive,
      priority,
    } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 })
    }

    // Validate data types
    if (typeof title !== "string" || typeof content !== "string") {
      return NextResponse.json({ success: false, error: "Title and content must be strings" }, { status: 400 })
    }

    // Validate fileType if provided
    if (fileType && !["image", "pdf"].includes(fileType)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Must be 'image' or 'pdf'" },
        { status: 400 },
      )
    }

    const noticeData = {
      title: title.trim(),
      content: content.trim(),
      description: description?.trim() || "",
      category: category || "general",
      fileUrl: fileUrl || "",
      fileType: fileType || undefined,
      fileSize: fileSize || undefined,
      originalName: originalName || undefined,
      showAsPopup: Boolean(showAsPopup),
      isActive: isActive !== false,
      priority: priority || "medium",
    }

    const notice = await createNotice(noticeData)

    console.log("Notice created successfully:", notice)
    return NextResponse.json({ success: true, notice })
  } catch (error) {
    console.error("POST /api/notices error:", error)
    return NextResponse.json({ success: false, error: "Failed to create notice" }, { status: 500 })
  }
}

// PUT - Update existing notice
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("PUT /api/notices - Received data:", body)

    const {
      id,
      title,
      content,
      description,
      category,
      fileUrl,
      fileType,
      fileSize,
      originalName,
      showAsPopup,
      isActive,
      priority,
    } = body

    // Validate required fields
    if (!id || !title || !content) {
      return NextResponse.json({ success: false, error: "ID, title, and content are required" }, { status: 400 })
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid notice ID format" }, { status: 400 })
    }

    // Validate fileType if provided
    if (fileType && !["image", "pdf"].includes(fileType)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Must be 'image' or 'pdf'" },
        { status: 400 },
      )
    }

    const updateData = {
      title: title.trim(),
      content: content.trim(),
      description: description?.trim() || "",
      category: category || "general",
      fileUrl: fileUrl || "",
      fileType: fileType || undefined,
      fileSize: fileSize || undefined,
      originalName: originalName || undefined,
      showAsPopup: Boolean(showAsPopup),
      isActive: isActive !== false,
      priority: priority || "medium",
    }

    const notice = await updateNotice(id, updateData)

    if (!notice) {
      return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 })
    }

    console.log("Notice updated successfully:", notice)
    return NextResponse.json({ success: true, notice })
  } catch (error) {
    console.error("PUT /api/notices error:", error)
    return NextResponse.json({ success: false, error: "Failed to update notice" }, { status: 500 })
  }
}

// DELETE - Delete notice
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Notice ID is required" }, { status: 400 })
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ success: false, error: "Invalid notice ID format" }, { status: 400 })
    }

    const deleted = await deleteNotice(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Notice not found" }, { status: 404 })
    }

    console.log("Notice deleted successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/notices error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete notice" }, { status: 500 })
  }
}
