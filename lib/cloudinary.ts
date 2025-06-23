"use server"
import { v2 as cloudinary } from "cloudinary"

// Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// Type for the upload result
export type UploadResult = {
  url: string
  publicId: string
  resourceType: string
  format: string
  bytes: number
  originalFilename?: string
}

// Extend resourceType to include "auto"
export type CloudinaryResourceType = "image" | "video" | "raw" | "auto"

/**
 * Uploads a file to Cloudinary
 * @param file - The file to upload (base64 string or Buffer)
 * @param folder - The folder to upload to (default: "vargo-agro")
 * @param resourceType - The resource type (default: "image")
 * @param originalFilename - The original filename (optional)
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: File | string | Buffer,
  folder = "vargo-agro",
  resourceType: CloudinaryResourceType = "image",
  originalFilename?: string
): Promise<UploadResult> => {
  try {
    // Convert Buffer to base64 string if needed
  const uploadFile = file instanceof File
    ? `data:application/octet-stream;base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`
    : Buffer.isBuffer(file)
      ? `data:application/octet-stream;base64,${file.toString("base64")}`
      : file

    const result = await cloudinary.uploader.upload(uploadFile, {
      folder,
      resource_type: resourceType,
      quality: "auto",
      fetch_format: "auto",
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      originalFilename,
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Failed to upload to Cloudinary: ${errorMessage}`)
  }
}

/**
 * Deletes a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @param resourceType - The resource type (default: "image")
 * @returns Promise<void>
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    throw new Error(`Failed to delete from Cloudinary: ${errorMessage}`)
  }
}
