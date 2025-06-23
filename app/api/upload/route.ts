// app/api/upload/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { uploadFileToCloudinary, validateFileSize, validateFileType, getFileTypeFromMimeType } from "@/lib/upload-helpers"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadFolder = formData.get("folder") as string || "vargo-agro" // Default folder
    const uploadType = formData.get("uploadType") as string || "general" // e.g., "document", "notice", "general"

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    let allowedTypes: string[] = []
    let maxSizeMB = 10

    switch (uploadType) {
      case "document":
        allowedTypes = [
          "image/png", "image/jpeg", "image/webp", "image/gif",
          "video/mp4", "video/webm",
          "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain"
        ]
        maxSizeMB = 10
        break
      case "notice":
        allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"]
        maxSizeMB = 5
        break
      default: // general upload
        allowedTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4", "application/pdf"]
        maxSizeMB = 10
        break
    }

    if (!validateFileType(file.type, allowedTypes)) {
      return NextResponse.json({ success: false, error: `Invalid file type for ${uploadType}.` }, { status: 400 })
    }

    if (!validateFileSize(file.size, maxSizeMB)) {
      return NextResponse.json({ success: false, error: `File too large. Max size for ${uploadType} is ${maxSizeMB}MB.` }, { status: 400 })
    }

    // Use the simplified upload helper function
    const result = await uploadFileToCloudinary(file, uploadFolder)

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      format: result.format,
      size: file.size,
      originalFilename: file.name,
      type: file.type,
      resourceType: getFileTypeFromMimeType(file.type)
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
