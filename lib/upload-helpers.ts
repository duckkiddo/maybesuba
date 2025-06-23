import { uploadToCloudinary, UploadResult, CloudinaryResourceType } from "./cloudinary"

/**
 * Determines the Cloudinary resource type from a MIME type
 * @param mimeType - The MIME type of the file
 * @returns The Cloudinary resource type
 */
export const getFileTypeFromMimeType = (mimeType: string): CloudinaryResourceType => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType === "application/pdf") return "raw"
  return "raw" // Default to raw for other file types
}

/**
 * Validates if a file size is within the allowed limit
 * @param size - The file size in bytes
 * @param maxSizeMB - The maximum allowed size in MB (default: 10)
 * @returns Boolean indicating if the file size is valid
 */
export const validateFileSize = (size: number, maxSizeMB = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}

/**
 * Validates if a file type is allowed
 * @param mimeType - The MIME type of the file
 * @param allowedTypes - Array of allowed MIME types
 * @returns Boolean indicating if the file type is allowed
 */
export const validateFileType = (mimeType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(mimeType)
}

/**
 * Uploads a file to Cloudinary
 * @param file - The file to upload
 * @param folder - The folder to upload to (default: "vargo-agro")
 * @returns Promise with upload result
 */
export const uploadFileToCloudinary = async (
  file: File, 
  folder = "vargo-agro"
): Promise<UploadResult> => {
  try {
    // Convert file to base64 data URL
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    // Determine resource type
    const resourceType = getFileTypeFromMimeType(file.type)

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      dataUrl, 
      folder, 
      resourceType, 
      file.name
    )

    return result
  } catch (error) {
    console.error("File upload error:", error)
    throw new Error("Failed to upload file")
  }
}

// Re-export types and functions from cloudinary
export { UploadResult, CloudinaryResourceType, uploadToCloudinary }
