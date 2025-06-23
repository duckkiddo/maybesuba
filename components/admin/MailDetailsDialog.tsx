import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MailSubmission } from '../../types/admin'

interface MailDetailsDialogProps {
  mail: MailSubmission | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (mailId: string, status: "new" | "read" | "replied") => void
  onDelete: (mailId: string) => void
}

export function MailDetailsDialog({ mail, isOpen, onClose, onUpdateStatus, onDelete }: MailDetailsDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800"
      case "read":
        return "bg-blue-100 text-blue-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mail Details</DialogTitle>
          <DialogDescription>
            {mail?.type === "dealer" ? "Dealer Application" : "Contact Message"}
          </DialogDescription>
        </DialogHeader>
        {mail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm">{mail.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm">{mail.email}</p>
              </div>
              {mail.phone && (
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{mail.phone}</p>
                </div>
              )}
              {mail.subject && (
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm">{mail.subject}</p>
                </div>
              )}
            </div>

            {mail.type === "dealer" && (
              <div className="grid grid-cols-2 gap-4">
                {mail.company && (
                  <div>
                    <Label>Company</Label>
                    <p className="text-sm">{mail.company}</p>
                  </div>
                )}
                {mail.businessType && (
                  <div>
                    <Label>Business Type</Label>
                    <p className="text-sm">{mail.businessType}</p>
                  </div>
                )}
                {mail.location && (
                  <div>
                    <Label>Location</Label>
                    <p className="text-sm">{mail.location}</p>
                  </div>
                )}
                {mail.volume && (
                  <div>
                    <Label>Expected Volume</Label>
                    <p className="text-sm">{mail.volume}</p>
                  </div>
                )}
              </div>
            )}

            {mail.message && (
              <div>
                <Label>Message</Label>
                <p className="text-sm whitespace-pre-wrap">{mail.message}</p>
              </div>
            )}

            {mail.additionalInfo && (
              <div>
                <Label>Additional Information</Label>
                <p className="text-sm whitespace-pre-wrap">{mail.additionalInfo}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Submitted: {formatDate(mail.submittedAt)}</p>
                <Badge className={getStatusColor(mail.status)}>{mail.status}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(mail.id, "replied")}
                  disabled={mail.status === "replied"}
                >
                  Mark as Replied
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(mail.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}