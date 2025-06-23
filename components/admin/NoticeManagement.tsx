"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Bell, Search, Eye, Download, FileText, ImageIcon } from "lucide-react"
import type { Notice } from "../../types/admin"
import { NoticeForm } from "./forms/NoticeForm"

interface NoticeManagementProps {
  notices: Notice[]
  onSave: (notices: Notice[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
}

export function NoticeManagement({ notices, onSave, onLogActivity }: NoticeManagementProps) {
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteNotice, setDeleteNotice] = useState<Notice | null>(null)
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>(notices)

  useEffect(() => {
    filterNotices()
  }, [notices, searchTerm])

  const filterNotices = () => {
    let filtered = notices

    if (searchTerm) {
      filtered = filtered.filter(
        (notice) =>
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notice.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredNotices(filtered)
  }

  const handleSave = (notice: Notice) => {
    if (editingNotice) {
      const updatedNotices = notices.map((n) => (n.id === editingNotice.id ? notice : n))
      onSave(updatedNotices)
      onLogActivity("Update", "Notices", `Updated notice: ${notice.title}`)
    } else {
      onSave([...notices, notice])
      onLogActivity("Create", "Notices", `Created new notice: ${notice.title}`)
    }
    setEditingNotice(null)
    setIsDialogOpen(false)
  }

  const handleDeleteNotice = (notice: Notice) => {
    setDeleteNotice(notice)
  }

  const confirmDelete = () => {
    if (deleteNotice) {
      onSave(notices.filter((n) => n.id !== deleteNotice.id))
      onLogActivity("Delete", "Notices", `Deleted notice: ${deleteNotice.title}`)
      setDeleteNotice(null)
    }
  }

  const handlePreview = (notice: Notice) => {
    setPreviewNotice(notice)
  }

  const handleDownload = (notice: Notice) => {
    if (notice.fileUrl) {
      const link = document.createElement("a")
      link.href = notice.fileUrl
      link.download = notice.title
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const renderPreviewContent = (notice: Notice) => {
    if (!notice.fileUrl) {
      return (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No file attached to this notice</p>
        </div>
      )
    }

    if (notice.fileType === "image") {
      return (
        <div className="space-y-4">
          <img
            src={notice.fileUrl || "/placeholder.svg"}
            alt={notice.title}
            className="w-full max-h-96 object-contain rounded"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=400&width=600"
            }}
          />
        </div>
      )
    } else if (notice.fileType === "pdf") {
      return (
        <div className="space-y-4">
          <div className="border rounded p-4 bg-gray-50">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-red-600" />
              <span className="font-medium">PDF Document</span>
            </div>
            <iframe src={notice.fileUrl} className="w-full h-96 border rounded" title={notice.title} />
          </div>
        </div>
      )
    }

    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Preview not available for this file type</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notice Management</h2>
          <p className="text-muted-foreground">Manage company notices and announcements</p>
        </div>
        <Button
          onClick={() => {
            setEditingNotice(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Notice
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotices.map((notice) => (
          <Card key={notice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center flex-1">
                  <Bell className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-base line-clamp-2">{notice.title}</h3>
                </div>
                <div className="flex gap-1 ml-2">
                  {notice.showAsPopup && (
                    <Badge variant="default" className="text-xs">
                      Popup
                    </Badge>
                  )}
                  {notice.fileUrl && (
                    <Badge variant="outline" className="text-xs">
                      {notice.fileType === "image" ? (
                        <ImageIcon className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                    </Badge>
                  )}
                </div>
              </div>

              {notice.fileUrl && notice.fileType === "image" && (
                <img
                  src={notice.fileUrl || "/placeholder.svg"}
                  alt={notice.title}
                  className="w-full h-32 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                  }}
                />
              )}

              {notice.fileUrl && notice.fileType === "pdf" && (
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded mb-4">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">PDF Document</span>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{notice.content}</p>

              <div className="text-xs text-muted-foreground mb-4">
                Created: {new Date(notice.createdAt).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                {notice.fileUrl && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => handlePreview(notice)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(notice)}>
                      <Download className="h-3 w-3" />
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingNotice(notice)
                    setIsDialogOpen(true)
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteNotice(notice)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {searchTerm ? "No notices found matching your search" : "No notices created yet"}
            </p>
            <Button
              onClick={() => {
                setEditingNotice(null)
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Notice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notice Form Dialog */}
      <NoticeForm
        notice={editingNotice}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />

      {/* Preview Dialog */}
      <Dialog open={!!previewNotice} onOpenChange={() => setPreviewNotice(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              {previewNotice?.title}
            </DialogTitle>
            <DialogDescription>Notice preview</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p>{previewNotice?.content}</p>
            </div>
            {previewNotice && renderPreviewContent(previewNotice)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNotice} onOpenChange={() => setDeleteNotice(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteNotice?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
