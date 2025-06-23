import { useState } from 'react'

export function useFileUpload() {
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

          const img = document.createElement("img")
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas")
              const ctx = canvas.getContext("2d")
              if (!ctx) {
                reject(new Error("Failed to get canvas context"))
                return
              }

              const maxWidth = 800
              const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
              canvas.width = img.width * ratio
              canvas.height = img.height * ratio
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
              resolve(canvas.toDataURL("image/jpeg", 0.8))
            } catch (error) {
              reject(error)
            }
          }
          img.onerror = () => reject(new Error("Failed to load image"))
          img.src = event.target.result as string
        }
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return base64
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

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return base64
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

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { url: `${file.name}`, data: base64 }
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