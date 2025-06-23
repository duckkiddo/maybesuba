// Remove Cloudinary functions and replace with local upload
export const handleFileUpload = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload-document", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload file")
  }

  const result = await response.json()
  return {
    url: result.url,
    filename: result.filename,
  }
}

export const handleImageUpload = async (file: File): Promise<string> => {
  const result = await handleFileUpload(file)
  return result.url
}

export const handleVideoUpload = async (file: File): Promise<string> => {
  const result = await handleFileUpload(file)
  return result.url
}
