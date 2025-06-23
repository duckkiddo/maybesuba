import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import type { MediaItem } from '../../../types/admin'
import { useFileUpload } from '../../../hooks/useFileUpload'

interface MediaFormProps {
  media: MediaItem | null
  mediaType: "image" | "video"
  isOpen: boolean
  onClose: () => void
  onSave: (media: MediaItem) => void
}

export function MediaForm({ media, mediaType, isOpen, onClose, onSave }: MediaFormProps) {
  const { uploadingImage, uploadingVideo, handleImageUpload, handleVideoUpload } = useFileUpload()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    let mediaUrl = media?.url || ""
    let thumbnailUrl = media?.thumbnail || ""

    if (mediaType === "image") {
      const imageFile = formData.get("mediaFile") as File
      if (imageFile && imageFile.size > 0) {
        try {
          mediaUrl = await handleImageUpload(imageFile)
          thumbnailUrl = mediaUrl
        } catch (error) {
          alert("Failed to upload image. Please try again.")
          return
        }
      } else if (formData.get("mediaUrl")) {
        mediaUrl = formData.get("mediaUrl") as string
        thumbnailUrl = mediaUrl
      }
    } else {
      // Handle video URLs, especially YouTube
      if (formData.get("mediaUrl")) {
        mediaUrl = formData.get("mediaUrl") as string

        // Extract YouTube video ID if it's a YouTube URL
        if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
          let videoId = ""

          if (mediaUrl.includes("youtube.com/watch?v=")) {
            videoId = mediaUrl.split("v=")[1]?.split("&")[0] || ""
          } else if (mediaUrl.includes("youtu.be/")) {
            videoId = mediaUrl.split("youtu.be/")[1]?.split("?")[0] || ""
          } else if (mediaUrl.includes("youtube.com/embed/")) {
            videoId = mediaUrl.split("embed/")[1]?.split("?")[0] || ""
          }

          if (videoId) {
            // Use embed URL format for YouTube videos
            mediaUrl = `https://www.youtube.com/embed/${videoId}`
            // Set default thumbnail if not provided
            if (!thumbnailUrl) {
              thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            }
          }
        }
      }

      const videoFile = formData.get("mediaFile") as File
      if (videoFile && videoFile.size > 0) {
        try {
          mediaUrl = await handleVideoUpload(videoFile)
          thumbnailUrl = "/placeholder.svg?height=200&width=300"
        } catch (error) {
          alert("Failed to upload video. Please try again.")
          return
        }
      }

      const thumbnailFile = formData.get("thumbnailFile") as File
      if (thumbnailFile && thumbnailFile.size > 0) {
        try {
          thumbnailUrl = await handleImageUpload(thumbnailFile)
        } catch (error) {
          alert("Failed to upload thumbnail. Using default thumbnail.")
        }
      } else if (formData.get("thumbnailUrl")) {
        thumbnailUrl = formData.get("thumbnailUrl") as string
      }
    }

    const displayIn: string[] = []
    if (mediaType === "image") {
      if (formData.get("displayGallery") === "on") displayIn.push("gallery")
      if (formData.get("displayActivities") === "on") displayIn.push("activities")
    } else {
      if (formData.get("displayVideos") === "on") displayIn.push("videos")
    }
    if (formData.get("displayHome") === "on") displayIn.push("home")

    const newMedia: MediaItem = {
      id: media?.id || Date.now().toString(),
      title: formData.get("title") as string,
      type: mediaType,
      url: mediaUrl,
      thumbnail: thumbnailUrl,
      uploadDate: media?.uploadDate || new Date().toISOString(),
      category: formData.get("category") as string,
      displayIn: displayIn.length > 0 ? displayIn : undefined,
    }

    onSave(newMedia)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{media ? `Edit ${mediaType}` : `Add New ${mediaType}`}</DialogTitle>
          <DialogDescription>
            {media ? `Update ${mediaType} information` : `Upload a new ${mediaType}${mediaType === "video" ? " or add YouTube link" : ""}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{mediaType === "image" ? "Image" : "Video"} Title</Label>
            <Input id="title" name="title" defaultValue={media?.title} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              defaultValue={media?.category || (mediaType === "image" ? "gallery" : "video")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{mediaType === "image" ? "Image File" : "Video Source"}</Label>
            {media?.url && (
              <div className="mb-2">
                {mediaType === "image" ? (
                  <img
                    src={media.url || "/placeholder.svg"}
                    alt="Current media"
                    className="w-full h-32 object-cover rounded border"
                  />
                ) : (
                  <img
                    src={media.thumbnail || "/placeholder.svg"}
                    alt="Current video thumbnail"
                    className="w-full h-32 object-cover rounded border"
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">Current {mediaType}</p>
              </div>
            )}
            <div className="space-y-2">
              {mediaType === "video" && (
                <div>
                  <Label htmlFor="mediaUrl" className="text-sm">
                    YouTube URL or Video URL
                  </Label>
                  <Input
                    id="mediaUrl"
                    name="mediaUrl"
                    defaultValue={media?.url}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">YouTube, Vimeo, or direct video URL</p>
                </div>
              )}
              {mediaType === "image" && (
                <>
                  <div>
                    <Label htmlFor="mediaFile" className="text-sm">
                      Upload Image File
                    </Label>
                    <Input
                      id="mediaFile"
                      name="mediaFile"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="text-center text-sm text-muted-foreground">OR</div>
                  <div>
                    <Label htmlFor="mediaUrl" className="text-sm">
                      Image URL
                    </Label>
                    <Input
                      id="mediaUrl"
                      name="mediaUrl"
                      defaultValue={media?.url}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {mediaType === "video" && (
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              {media?.thumbnail && (
                <div className="mb-2">
                  <img
                    src={media.thumbnail || "/placeholder.svg"}
                    alt="Current thumbnail"
                    className="w-full h-32 object-cover rounded border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Current thumbnail</p>
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <Label htmlFor="thumbnailFile" className="text-sm">
                    Upload Thumbnail Image
                  </Label>
                  <Input
                    id="thumbnailFile"
                    name="thumbnailFile"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">OR</div>
                <div>
                  <Label htmlFor="thumbnailUrl" className="text-sm">
                    Thumbnail URL
                  </Label>
                  <Input
                    id="thumbnailUrl"
                    name="thumbnailUrl"
                    defaultValue={media?.thumbnail}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Display Options</Label>
            <div className="grid grid-cols-2 gap-2">
              {mediaType === "image" && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="displayGallery"
                      name="displayGallery"
                      defaultChecked={media?.displayIn?.includes("gallery") || true}
                    />
                    <Label htmlFor="displayGallery" className="text-sm">
                      Gallery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="displayActivities"
                      name="displayActivities"
                      defaultChecked={media?.displayIn?.includes("activities")}
                    />
                    <Label htmlFor="displayActivities" className="text-sm">
                      Activities
                    </Label>
                  </div>
                </>
              )}
              {mediaType === "video" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="displayVideos"
                    name="displayVideos"
                    defaultChecked={media?.displayIn?.includes("videos") || true}
                  />
                  <Label htmlFor="displayVideos" className="text-sm">
                    Videos Page
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="displayHome"
                  name="displayHome"
                  defaultChecked={media?.displayIn?.includes("home")}
                />
                <Label htmlFor="displayHome" className="text-sm font-medium">
                  Home Preview
                </Label>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={uploadingImage || uploadingVideo}>
            {uploadingImage || uploadingVideo ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : media ? (
              `Update ${mediaType}`
            ) : (
              `Add ${mediaType}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}