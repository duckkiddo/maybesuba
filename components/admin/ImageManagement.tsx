import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, X, Download, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MediaItem } from '../../types/admin'
import { MediaForm } from './forms/MediaForm'
import { MediaPreviewDialog } from './MediaPreviewDialog'

interface ImageManagementProps {
  mediaItems: MediaItem[]
  onSave: (mediaItems: MediaItem[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
  adminUsername: string
}

export function ImageManagement({ mediaItems, onSave, onLogActivity, adminUsername }: ImageManagementProps) {
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>("all")
  const [homePreviewFilter, setHomePreviewFilter] = useState<"all" | "home" | "not-home">("all")

  const images = mediaItems.filter(item => item.type === "image")
  const mediaCategories = ["all", ...new Set(images.map((item) => item.category.toLowerCase()))]

  const filteredImages = images.filter((media) => {
    const categoryMatch =
      mediaCategoryFilter === "all" || media.category.toLowerCase() === mediaCategoryFilter.toLowerCase()
    const homeMatch =
      homePreviewFilter === "all" ||
      (homePreviewFilter === "home" && media.displayIn?.includes("home")) ||
      (homePreviewFilter === "not-home" && !media.displayIn?.includes("home"))

    return categoryMatch && homeMatch
  })

  const handleSave = (media: MediaItem) => {
    if (editingMedia) {
      const updatedMedia = mediaItems.map((m) => (m.id === editingMedia.id ? media : m))
      onSave(updatedMedia)
    } else {
      onSave([...mediaItems, media])
    }
    setEditingMedia(null)
    setIsDialogOpen(false)
  }

  const deleteMedia = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      onSave(mediaItems.filter((m) => m.id !== id))
    }
  }

  const toggleHomePreview = (media: MediaItem) => {
    const displayIn = media.displayIn || []
    const updatedDisplayIn = displayIn.includes("home")
      ? displayIn.filter((location) => location !== "home")
      : [...displayIn, "home"]

    const updatedMedia = { ...media, displayIn: updatedDisplayIn }
    onSave(mediaItems.map((m) => (m.id === media.id ? updatedMedia : m)))
  }

  const openMediaPreview = (media: MediaItem) => {
    setSelectedMedia(media)
    setIsPreviewOpen(true)
  }

  const clearImageData = () => {
    if (confirm("Are you sure you want to clear all image data? This action cannot be undone.")) {
      const updatedMediaItems = mediaItems.filter((media) => media.type !== "image")
      onSave(updatedMediaItems)
      onLogActivity("Clear", "Images", "Cleared all image data")
      alert("All image data has been cleared successfully.")
    }
  }

  const exportImageData = () => {
    const imageData = mediaItems.filter((media) => media.type === "image")
    const data = {
      images: imageData,
      exportDate: new Date().toISOString(),
      exportedBy: adminUsername,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vargo-agro-images-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onLogActivity("Export", "Images", "Exported all image data")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Image Management</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setEditingMedia(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button variant="outline" onClick={exportImageData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={clearImageData}>
            <Trash className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Image Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={mediaCategoryFilter} onValueChange={setMediaCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {mediaCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={homePreviewFilter}
          onValueChange={(value: "all" | "home" | "not-home") => setHomePreviewFilter(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Home preview" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Images</SelectItem>
            <SelectItem value="home">Home Preview</SelectItem>
            <SelectItem value="not-home">Not Home Preview</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="relative mb-3">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full aspect-square object-cover rounded cursor-pointer"
                  onClick={() => openMediaPreview(image)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
                {image.displayIn?.includes("home") && (
                  <Badge className="absolute top-2 right-2 bg-green-500">Home</Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm mb-1 truncate">{image.title}</h3>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="text-xs">
                  {image.category}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {new Date(image.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleHomePreview(image)}>
                  {image.displayIn?.includes("home") ? (
                    <>
                      <X className="h-3 w-3 mr-1" />
                      Remove from Home
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Home
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={() => openMediaPreview(image)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingMedia(image)
                    setIsDialogOpen(true)
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMedia(image.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MediaForm
        media={editingMedia}
        mediaType="image"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />

      <MediaPreviewDialog
        media={selectedMedia}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  )
}