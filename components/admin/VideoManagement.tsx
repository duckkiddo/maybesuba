import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, X, Play, Download, Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MediaItem } from '../../types/admin'
import { MediaForm } from './forms/MediaForm'
import { MediaPreviewDialog } from './MediaPreviewDialog'

interface VideoManagementProps {
  mediaItems: MediaItem[]
  onSave: (mediaItems: MediaItem[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
  adminUsername: string
}

export function VideoManagement({ mediaItems, onSave, onLogActivity, adminUsername }: VideoManagementProps) {
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [homePreviewFilter, setHomePreviewFilter] = useState<"all" | "home" | "not-home">("all")

  const videos = mediaItems.filter(item => item.type === "video")

  const filteredVideos = videos.filter((media) => {
    const homeMatch =
      homePreviewFilter === "all" ||
      (homePreviewFilter === "home" && media.displayIn?.includes("home")) ||
      (homePreviewFilter === "not-home" && !media.displayIn?.includes("home"))

    return homeMatch
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
    if (confirm("Are you sure you want to delete this video?")) {
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

  const clearVideoData = () => {
    if (confirm("Are you sure you want to clear all video data? This action cannot be undone.")) {
      const updatedMediaItems = mediaItems.filter((media) => media.type !== "video")
      onSave(updatedMediaItems)
      onLogActivity("Clear", "Videos", "Cleared all video data")
      alert("All video data has been cleared successfully.")
    }
  }

  const exportVideoData = () => {
    const videoData = mediaItems.filter((media) => media.type === "video")
    const data = {
      videos: videoData,
      exportDate: new Date().toISOString(),
      exportedBy: adminUsername,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vargo-agro-videos-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    onLogActivity("Export", "Videos", "Exported all video data")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Video Management</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setEditingMedia(null)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
          <Button variant="outline" onClick={exportVideoData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={clearVideoData}>
            <Trash className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Video Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={homePreviewFilter}
          onValueChange={(value: "all" | "home" | "not-home") => setHomePreviewFilter(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Home preview" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Videos</SelectItem>
            <SelectItem value="home">Home Preview</SelectItem>
            <SelectItem value="not-home">Not Home Preview</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="relative mb-3">
                <div className="aspect-video relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg?height=200&width=350"}
                    alt={video.title}
                    className="w-full h-full object-cover rounded cursor-pointer"
                    onClick={() => openMediaPreview(video)}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=350"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white bg-black bg-opacity-50 rounded-full p-3" />
                  </div>
                </div>
                {video.displayIn?.includes("home") && (
                  <Badge className="absolute top-2 right-2 bg-green-500">Home</Badge>
                )}
              </div>
              <h3 className="font-semibold text-base mb-1">{video.title}</h3>
              <div className="flex justify-between items-center mb-3">
                <Badge variant="outline" className="text-xs">
                  {video.category}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleHomePreview(video)}>
                  {video.displayIn?.includes("home") ? (
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
                <Button size="sm" variant="outline" onClick={() => openMediaPreview(video)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingMedia(video)
                    setIsDialogOpen(true)
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMedia(video.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MediaForm
        media={editingMedia}
        mediaType="video"
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