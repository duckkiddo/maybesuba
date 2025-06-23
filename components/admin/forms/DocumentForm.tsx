"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Document } from "@/types/admin"
import { uploadToCloudinary, getFileTypeFromMimeType } from "@/lib/upload-helpers"


interface DocumentFormProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
  onSave: (document: Document) => void
}

interface UploadedFile {
  url: string
  filename: string
  type: string
  fileType: string
  size: number
}

export function DocumentForm({ document, isOpen, onClose, onSave }: DocumentFormProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)

  const handleFileUpload = async (file: File) => {
    console.log("Starting file upload:", file.name, file.type, file.size)
    setUploading(true)
    setUploadError(null)

    try {
      const result = await uploadToCloudinary(file)

      if (result && result.url) {
        const fileType = getFileTypeFromMimeType(file.type)

        setUploadedFile({
          url: result.url,
          filename: file.name,
          type: file.type,
          fileType,
          size: file.size,
        })
        setUploadError(null)
        console.log("Upload successful:", result)
      } else {
        throw new Error("Upload failed - no URL returned")
      }
    } catch (error) {
      console.error("Upload error:", error)
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

      const fileUrl = uploadedFile?.url || document?.fileUrl || ""
      const fileSize = uploadedFile?.size || document?.fileSize
      const originalName = uploadedFile?.filename || document?.originalName

      let fileType = "PDF"
      if (uploadedFile?.fileType) {
        fileType = uploadedFile.fileType
      } else if (document?.fileType) {
        fileType = document.fileType
      }

      if (!document && !uploadedFile) {
        setUploadError("Please upload a file before saving the document.")
        setSaving(false)
        return
      }

      const documentData = {
        id: document?.id,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        fileType,
        category: formData.get("category") as string,
        fileUrl,
        fileSize,
        originalName,
      }

      console.log("Saving document:", documentData)
      console.log("File URL:", fileUrl)
      console.log("File Size:", fileSize)
      console.log("Original Name:", originalName)
      console.log("File Type:", fileType)

      const response = await fetch("/api/documents", {
        method: document ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save document")
      }

      const result = await response.json()

      if (result.success) {
        onSave(result.document)
        form.reset()
        setUploadedFile(null)
        setUploadError(null)
        onClose()
      } else {
        throw new Error(result.error || "Failed to save document")
      }
    } catch (error) {
      console.error("Save error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to save document")
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name, file.type, file.size)

    setUploadedFile(null)
    setUploadError(null)

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB")
      return
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setUploadError("File type not supported. Please upload PDF, Word, Excel, Text, or Image files.")
      return
    }

    handleFileUpload(file)
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
          <DialogTitle>{document ? "Edit Document" : "Add New Document"}</DialogTitle>
          <DialogDescription>{document ? "Update document information" : "Upload a new document"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={document?.name}
              required
              placeholder="Enter document name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={document?.description}
              required
              placeholder="Enter document description"
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={document?.category || "Legal"}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Tax">Tax</SelectItem>
                <SelectItem value="Quality">Quality</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Environmental">Environmental</SelectItem>
                <SelectItem value="Export">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="documentFile">Upload Document</Label>
            <Input
              id="documentFile"
              name="documentFile"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.gif,.webp"
              className="cursor-pointer mt-1"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supported formats: PDF, Word, Excel, Text, Images (Max 10MB)
            </p>

            {/* Current file indicator */}
            {document?.fileUrl && !uploadedFile && (
              <div className="flex items-center mt-2 p-2 bg-green-50 rounded border border-green-200">
                <FileText className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-xs text-green-700">Current file: {document.originalName || document.name}</span>
              </div>
            )}

            {/* Upload progress */}
            {uploading && (
              <div className="flex items-center mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <Upload className="h-4 w-4 text-blue-600 mr-2 animate-spin" />
                <span className="text-xs text-blue-700">Uploading file...</span>
              </div>
            )}

            {/* Successful upload */}
            {uploadedFile && (
              <div className="flex items-center mt-2 p-2 bg-green-50 rounded border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-xs text-green-700">New file uploaded: {uploadedFile.filename}</span>
              </div>
            )}
          </div>

          {/* Error display */}
          {uploadError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          {/* Form buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={uploading || saving || (!document && !uploadedFile)}>
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
              ) : document ? (
                "Update Document"
              ) : (
                "Add Document"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
