import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MediaItem } from '../../types/admin'

interface MediaPreviewDialogProps {
  media: MediaItem | null
  isOpen: boolean
  onClose: () => void
}

export function MediaPreviewDialog({ media, isOpen, onClose }: MediaPreviewDialogProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{media?.title}</DialogTitle>
          <DialogDescription>Media Preview</DialogDescription>
        </DialogHeader>
        {media && (
          <div className="space-y-4">
            {media.type === "image" ? (
              <img
                src={media.url || "/placeholder.svg"}
                alt={media.title}
                className="w-full max-h-96 object-contain rounded"
              />
            ) : (
              <div className="aspect-video">
                {media.url.includes("youtube.com/embed/") ? (
                  <iframe
                    src={media.url}
                    className="w-full h-full rounded"
                    allowFullScreen
                    title={media.title}
                  />
                ) : (
                  <video src={media.url} className="w-full h-full object-contain rounded" controls />
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Category:</strong> {media.category}
                </p>
                <p>
                  <strong>Type:</strong> {media.type}
                </p>
              </div>
              <div>
                <p>
                  <strong>Upload Date:</strong> {formatDate(media.uploadDate)}
                </p>
                {media.displayIn && (
                  <p>
                    <strong>Display In:</strong> {media.displayIn.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}