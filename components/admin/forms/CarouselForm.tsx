import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import type { CarouselSlide } from '../../../types/admin'
import { useFileUpload } from '../../../hooks/useFileUpload'

interface CarouselFormProps {
  carousel: CarouselSlide | null
  isOpen: boolean
  onClose: () => void
  onSave: (carousel: CarouselSlide) => void
}

export function CarouselForm({ carousel, isOpen, onClose, onSave }: CarouselFormProps) {
  const { uploadingImage, handleImageUpload } = useFileUpload()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    let imageUrl = carousel?.image || ""
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

    const newSlide: CarouselSlide = {
      id: carousel?.id || Date.now().toString(),
      image: imageUrl,
      title: {
        en: formData.get("titleEn") as string,
        ne: formData.get("titleNe") as string,
      },
      subtitle: {
        en: formData.get("subtitleEn") as string,
        ne: formData.get("subtitleNe") as string,
      },
      duration: parseInt(formData.get("duration") as string) || 5000,
      order: parseInt(formData.get("order") as string) || 1,
      isActive: formData.get("isActive") === "on",
    }

    onSave(newSlide)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{carousel ? "Edit Carousel Slide" : "Add New Carousel Slide"}</DialogTitle>
          <DialogDescription>
            {carousel ? "Update carousel slide information" : "Create a new carousel slide"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titleEn">Title (English)</Label>
            <Input id="titleEn" name="titleEn" defaultValue={carousel?.title.en} required />
          </div>
          <div>
            <Label htmlFor="titleNe">Title (Nepali)</Label>
            <Input id="titleNe" name="titleNe" defaultValue={carousel?.title.ne} required />
          </div>
          <div>
            <Label htmlFor="subtitleEn">Subtitle (English)</Label>
            <Input id="subtitleEn" name="subtitleEn" defaultValue={carousel?.subtitle.en} required />
          </div>
          <div>
            <Label htmlFor="subtitleNe">Subtitle (Nepali)</Label>
            <Input id="subtitleNe" name="subtitleNe" defaultValue={carousel?.subtitle.ne} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (ms)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                defaultValue={carousel?.duration || 5000}
                required
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={carousel?.order || 1}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Slide Image</Label>
            {carousel?.image && (
              <div className="mb-2">
                <img
                  src={carousel.image || "/placeholder.svg"}
                  alt="Current slide image"
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
                  defaultValue={carousel?.image}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={carousel?.isActive} />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <Button type="submit" className="w-full" disabled={uploadingImage}>
            {uploadingImage ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading Image...
              </>
            ) : carousel ? (
              "Update Slide"
            ) : (
              "Create Slide"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}