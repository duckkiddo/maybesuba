import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Handshake, MessageCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MailSubmission } from '../../types/admin'
import { MailDetailsDialog } from './MailDetailsDialog'

interface MailManagementProps {
  mailSubmissions: MailSubmission[]
  onSave: (mailSubmissions: MailSubmission[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
}

export function MailManagement({ mailSubmissions, onSave, onLogActivity }: MailManagementProps) {
  const [selectedMail, setSelectedMail] = useState<MailSubmission | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mailFilter, setMailFilter] = useState<"all" | "contact" | "dealer">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all")

  const filteredMail = mailSubmissions.filter((mail) => {
    const typeMatch = mailFilter === "all" || mail.type === mailFilter
    const statusMatch = statusFilter === "all" || mail.status === statusFilter
    return typeMatch && statusMatch
  })

  const updateMailStatus = (mailId: string, status: "new" | "read" | "replied") => {
    const updatedMail = mailSubmissions.map((mail) => (mail.id === mailId ? { ...mail, status } : mail))
    onSave(updatedMail)
    onLogActivity("Update", "Mail", `Changed mail status to ${status}`)
  }

  const deleteMail = (mailId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const mailToDelete = mailSubmissions.find((mail) => mail.id === mailId)
      const updatedMail = mailSubmissions.filter((mail) => mail.id !== mailId)
      onSave(updatedMail)
      onLogActivity("Delete", "Mail", `Deleted mail from ${mailToDelete?.name || "unknown"}`)
    }
  }

  const openMailDetails = (mail: MailSubmission) => {
    setSelectedMail(mail)
    setIsDialogOpen(true)
    if (mail.status === "new") {
      updateMailStatus(mail.id, "read")
    }
  }

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

  const getTypeIcon = (type: string) => {
    return type === "dealer" ? Handshake : MessageCircle
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mail Management</h2>
        <div className="flex space-x-2">
          <Select
            value={mailFilter}
            onValueChange={(value: "all" | "contact" | "dealer") => setMailFilter(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="dealer">Dealer</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "new" | "read" | "replied") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMail.map((mail) => {
          const TypeIcon = getTypeIcon(mail.type)
          return (
            <Card
              key={mail.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openMailDetails(mail)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <TypeIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-semibold text-base">{mail.name}</h3>
                      <p className="text-sm text-muted-foreground">{mail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(mail.status)}>{mail.status}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {mail.type}
                    </Badge>
                  </div>
                </div>
                {mail.subject && <p className="font-medium mb-2">{mail.subject}</p>}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {mail.message || mail.additionalInfo}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">{formatDate(mail.submittedAt)}</p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        updateMailStatus(mail.id, "replied")
                      }}
                    >
                      Mark Replied
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteMail(mail.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <MailDetailsDialog
        mail={selectedMail}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdateStatus={updateMailStatus}
        onDelete={(mailId) => {
          deleteMail(mailId)
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}