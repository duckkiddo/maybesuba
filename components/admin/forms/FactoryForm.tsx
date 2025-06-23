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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import type { FactoryType, FactoryTypeType } from '../../../types/admin'
import { useFileUpload } from '../../../hooks/useFileUpload'

interface FactoryFormProps {
  factory: FactoryType | null
  isOpen: boolean
  onClose: () => void
  onSave: (factory: FactoryType) => void
}

export function FactoryForm({ factory, isOpen, onClose, onSave }: FactoryFormProps) {
  const { uploadingImage, uploadingVideo, handleImageUpload, handleVideoUpload } = useFileUpload()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    let imageUrl = factory?.image || ""
    let videoUrl = factory?.video || ""

    const imageFile = formData.get("imageFile") as File
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await handleImageUpload(imageFile)
      } catch (error) {
        alert("Failed to upload image. Please try again.")
        return
      }
    } else if (formData.get("imageUrl")) {
      imageUrl = formData.get("imageUrl") as string
    }

    const videoFile = formData.get("videoFile") as File
    if (videoFile && videoFile.size > 0) {
      try {
        videoUrl = await handleVideoUpload(videoFile)
      } catch (error) {
        alert("Failed to upload video. Please try again.")
        return
      }
    } else if (formData.get("videoUrl")) {
      videoUrl = formData.get("videoUrl") as string
    }

    const newFactory: FactoryType = {
      id: factory?.id || Date.now().toString(),
      name: formData.get("name") as string,
      location: {
        lat: parseFloat(formData.get("lat") as string) || 27.7172,
        lng: parseFloat(formData.get("lng") as string) || 85.324,
      },
      contact: formData.get("contact") as string,
      type: (formData.get("type") as FactoryTypeType) || "factory",
      image: imageUrl || undefined,
      video: videoUrl || undefined,
    }

    onSave(newFactory)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{factory ? "Edit Factory" : "Add New Factory"}</DialogTitle>
          <DialogDescription>
            {factory ? "Update factory information" : "Create a new factory location"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Factory Name</Label>
            <Input id="name" name="name" defaultValue={factory?.name} required />
          </div>
          <div>
            <Label htmlFor="contact">Contact Information</Label>
            <Input id="contact" name="contact" defaultValue={factory?.contact} required />
          </div>
          <div>
            <Label htmlFor="type">Factory Type</Label>
            <Select name="type" defaultValue={factory?.type || "factory"}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="headquarters">Headquarters</SelectItem>
                <SelectItem value="factory">Factory</SelectItem>
                <SelectItem value="depot">Depot</SelectItem>
                <SelectItem value="dealer">Dealer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="any"
                defaultValue={factory?.location.lat || 27.7172}
                required
              />
            </div>
            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                name="lng"
                type="number"
                step="any"
                defaultValue={factory?.location.lng || 85.324}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Factory Image (Optional)</Label>
            {factory?.image && (
              <div className="mb-2">
                <img
                  src={factory.image || "/placeholder.svg"}
                  alt="Current factory image"
                  className="w-full h-32 object-cover rounded border"
                />
                <p className="text-xs text-muted-foreground mt-1">Current image</p>
              </div>
            )}
            <div className="space-y-2">
              <div>
                <Label htmlFor="imageFile" className="text-sm">
                  Upload Image File
                </Label>
                <Input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <div>
                <Label htmlFor="imageUrl" className="text-sm">
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={factory?.image}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Factory Video (Optional)</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="videoFile" className="text-sm">
                  Upload Video File
                </Label>
                <Input
                  id="videoFile"
                  name="videoFile"
                  type="file"
                  accept="video/*"
                  className="cursor-pointer"
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">OR</div>
              <div>
                <Label htmlFor="videoUrl" className="text-sm">
                  Video URL
                </Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  defaultValue={factory?.video}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={uploadingImage || uploadingVideo}>
            {uploadingImage || uploadingVideo ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : factory ? (
              "Update Factory"
            ) : (
              "Create Factory"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}