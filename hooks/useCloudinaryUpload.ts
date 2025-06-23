import { useState } from 'react'

export function useCloudinaryUpload() {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImage(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (!event.target?.result) {
            reject(new Error("Failed to read file"))
            return
          }
          resolve(event.target.result as string)
        }
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          folder: 'vargo-agro/images',
          resourceType: 'image'
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error("Image upload error:", error)
      throw new Error("Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleVideoUpload = async (file: File): Promise<string> => {
    setUploadingVideo(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (!event.target?.result) {
            reject(new Error("Failed to read file"))
            return
          }
          resolve(event.target.result as string)
        }
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          folder: 'vargo-agro/videos',
          resourceType: 'video'
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return result.url
    } catch (error) {
      console.error("Video upload error:", error)
      throw new Error("Failed to upload video. Please try again.")
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleFileUpload = async (file: File): Promise<{ url: string; data: string }> => {
    setUploadingFile(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (!event.target?.result) {
            reject(new Error("Failed to read file"))
            return
          }
          resolve(event.target.result as string)
        }
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64,
          folder: 'vargo-agro/documents',
          resourceType: 'raw'
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return { url: result.url, data: result.url }
    } catch (error) {
      console.error("File upload error:", error)
      throw new Error("Failed to upload file. Please try again.")
    } finally {
      setUploadingFile(false)
    }
  }

  return {
    uploadingImage,
    uploadingFile,
    uploadingVideo,
    handleImageUpload,
    handleVideoUpload,
    handleFileUpload
  }
}