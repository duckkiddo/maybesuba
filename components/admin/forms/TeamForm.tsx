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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import type { TeamMember } from '../../../types/admin'
import { useFileUpload } from '../../../hooks/useFileUpload'

interface TeamFormProps {
  teamMember: TeamMember | null
  isOpen: boolean
  onClose: () => void
  onSave: (teamMember: TeamMember) => void
}

export function TeamForm({ teamMember, isOpen, onClose, onSave }: TeamFormProps) {
  const { uploadingImage, handleImageUpload } = useFileUpload()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    let imageUrl = teamMember?.image || ""
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

    const newTeamMember: TeamMember = {
      id: teamMember?.id || Date.now().toString(),
      name: {
        en: formData.get("nameEn") as string,
        ne: formData.get("nameNe") as string,
      },
      position: {
        en: formData.get("positionEn") as string,
        ne: formData.get("positionNe") as string,
      },
      image: imageUrl,
      type: (formData.get("type") as "board" | "management") || "management",
      order: parseInt(formData.get("order") as string) || 1,
      isActive: formData.get("isActive") === "on",
    }

    onSave(newTeamMember)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{teamMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
          <DialogDescription>
            {teamMember ? "Update team member information" : "Create a new team member"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nameEn">Name (English)</Label>
            <Input id="nameEn" name="nameEn" defaultValue={teamMember?.name.en} required />
          </div>
          <div>
            <Label htmlFor="nameNe">Name (Nepali)</Label>
            <Input id="nameNe" name="nameNe" defaultValue={teamMember?.name.ne} required />
          </div>
          <div>
            <Label htmlFor="positionEn">Position (English)</Label>
            <Input
              id="positionEn"
              name="positionEn"
              defaultValue={teamMember?.position.en}
              required
            />
          </div>
          <div>
            <Label htmlFor="positionNe">Position (Nepali)</Label>
            <Input
              id="positionNe"
              name="positionNe"
              defaultValue={teamMember?.position.ne}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Team Type</Label>
            <Select name="type" defaultValue={teamMember?.type || "management"}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="board">Board of Directors</SelectItem>
                <SelectItem value="management">Management Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              defaultValue={teamMember?.order || 1}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Image</Label>
            {teamMember?.image && (
              <div className="mb-2">
                <img
                  src={teamMember.image || "/placeholder.svg"}
                  alt="Current profile image"
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
                  defaultValue={teamMember?.image}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={teamMember?.isActive} />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <Button type="submit" className="w-full" disabled={uploadingImage}>
            {uploadingImage ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading Image...
              </>
            ) : teamMember ? (
              "Update Team Member"
            ) : (
              "Create Team Member"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}