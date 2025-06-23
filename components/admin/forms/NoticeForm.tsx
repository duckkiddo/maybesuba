"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ImageIcon, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Notice } from "@/types/admin"
import { uploadFileToCloudinary, getFileTypeFromMimeType } from "@/lib/upload-helpers"

interface NoticeFormProps {
  notice: Notice | null
  isOpen: boolean
  onClose: () => void
  onSave: (notice: Notice) => void
}

interface UploadedFile {
  url: string
  filename: string
  type: "image" | "pdf"
  size: number
}

export function NoticeForm({ notice, isOpen, onClose, onSave }: NoticeFormProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)

  const handleFileUpload = async (file: File) => {
    console.log("Starting notice file upload:", file.name, file.type, file.size)
    setUploading(true)
    setUploadError(null)

    try {
      console.log("Sending notice upload request to Cloudinary...")
      const result = await uploadFileToCloudinary(file)

      if (result && result.url) {
        const fileType = getFileTypeFromMimeType(file.type)
        if (!fileType) {
          throw new Error("Unsupported file type")
        }

        // For notices, we only support image and pdf
        const noticeFileType: "image" | "pdf" = fileType === "pdf" ? "pdf" : fileType === "image" ? "image" : "image"

        setUploadedFile({
          url: result.url,
          filename: file.name,
          type: noticeFileType,
          size: file.size,
        })
        setUploadError(null)
        console.log("Notice upload successful:", result)
      } else {
        console.error("Cloudinary upload failed:", result)
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Notice upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setUploadError(null)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)

      let fileUrl = notice?.fileUrl || ""
      let fileType: "image" | "pdf" | undefined = notice?.fileType
      let fileSize = notice?.fileSize
      let originalName = notice?.originalName

      // Handle file upload
      const imageUrl = formData.get("imageUrl") as string

      if (uploadedFile) {
        fileUrl = uploadedFile.url
        fileType = uploadedFile.type // Ensure this is 'pdf' for PDFs
        fileSize = uploadedFile.size
        originalName = uploadedFile.filename
      } else if (imageUrl && imageUrl.trim()) {
        fileUrl = imageUrl.trim()
        fileType = "image"
      }

      const noticeData = {
        id: notice?.id,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        fileUrl: fileUrl,
        fileType: fileType,
        fileSize: fileSize,
        originalName: originalName,
        showAsPopup: formData.get("showAsPopup") === "on",
        isActive: formData.get("isActive") !== "off",
        priority: formData.get("priority") as "low" | "medium" | "high",
      }

      console.log("Saving notice:", noticeData)

      // Save to database
      const response = await fetch("/api/notices", {
        method: notice ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      })

      console.log("API Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)

        let errorMessage = "Failed to save notice"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use the text as error message
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("API Response:", result)

      if (result.success) {
        onSave(result.notice)
        // Reset form state
        form.reset()
        setUploadedFile(null)
        setUploadError(null)
        onClose()
      } else {
        throw new Error(result.error || "Failed to save notice")
      }
    } catch (error) {
      console.error("Save error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to save notice")
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Notice file selected:", file.name, file.type, file.size)

      // Reset previous upload state
      setUploadedFile(null)
      setUploadError(null)

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB")
        return
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"]

      if (!allowedTypes.includes(file.type)) {
        setUploadError("File type not supported. Please upload images (JPEG, PNG, GIF, WebP) or PDF files.")
        return
      }

      handleFileUpload(file)
    }
  }

  const handleClose = () => {
    setUploadedFile(null)
    setUploadError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{notice ? "Edit Notice" : "Add New Notice"}</DialogTitle>
          <DialogDescription>{notice ? "Update notice information" : "Create a new notice"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Notice Title</Label>
            <Input id="title" name="title" defaultValue={notice?.title} required />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" defaultValue={notice?.content} required rows={4} />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" name="description" defaultValue={notice?.description} rows={2} />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={notice?.category || "general"}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue={notice?.priority || "medium"}>
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Notice Attachment (Optional)</Label>

            {/* Show current file if exists */}
            {notice?.fileUrl && !uploadedFile && (
              <div className="mb-3 p-3 border rounded bg-gray-50">
                {notice.fileType === "image" ? (
                  <div className="space-y-2">
                    <img
                      src={notice.fileUrl || "/placeholder.svg"}
                      alt="Current notice attachment"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Current image attachment: {notice.originalName || "Image"}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-6 h-6 text-red-600 mr-2" />
                      <span className="text-sm">PDF Document: {notice.originalName || "Document"}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show uploaded file preview */}
            {uploadedFile && (
              <div className="mb-3 p-3 border rounded bg-green-50">
                {uploadedFile.type === "image" ? (
                  <div className="space-y-2">
                    <img
                      src={uploadedFile.url || "/placeholder.svg"}
                      alt="Uploaded file preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-xs text-green-700">New image ready: {uploadedFile.filename}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <FileText className="w-6 h-6 text-red-600 mr-2" />
                    <span className="text-sm text-green-700">New PDF ready: {uploadedFile.filename}</span>
                  </div>
                )}
              </div>
            )}

            {/* File upload */}
            <div>
              <Label htmlFor="file" className="text-sm flex items-center">
                <Upload className="w-4 h-4 mr-1" />
                Upload File (Image or PDF)
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*,.pdf"
                className="cursor-pointer"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground mt-1">Supported: JPEG, PNG, GIF, WebP, PDF (Max 10MB)</p>
            </div>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            {/* Image URL input */}
            <div>
              <Label htmlFor="imageUrl" className="text-sm flex items-center">
                <ImageIcon className="w-4 h-4 mr-1" />
                Image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={notice?.fileType === "image" ? notice.fileUrl : ""}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="flex items-center p-2 bg-blue-50 rounded border border-blue-200">
              <Upload className="h-4 w-4 text-blue-600 mr-2 animate-spin" />
              <span className="text-xs text-blue-700">Uploading file...</span>
            </div>
          )}

          {/* Show upload error */}
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-2">
            <Switch id="showAsPopup" name="showAsPopup" defaultChecked={notice?.showAsPopup} />
            <Label htmlFor="showAsPopup">Show as Popup</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={notice?.isActive !== false} />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={uploading || saving}>
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : saving ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : notice ? (
                "Update Notice"
              ) : (
                "Create Notice"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
