"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Bell, FileText, Download, Eye } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Notice {
  id: string
  title: string
  content: string
  fileUrl?: string
  fileType?: 'image' | 'pdf'
  image?: string // For backward compatibility
  showAsPopup: boolean
  createdAt: string
}

export function NoticePopup() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    const loadNotices = async () => {
      try {
        // Try to load from API first
        const response = await fetch('/api/notices')
        if (response.ok) {
          const notices = await response.json()
          const popupNotice = notices.find((n: Notice) => n.showAsPopup)
          if (popupNotice) {
            showNoticeIfNotSeen(popupNotice)
          }
        } else {
          // Fallback to localStorage
          loadLocalNotices()
        }
      } catch (error) {
        console.warn('Failed to load notices from API, using localStorage:', error)
        loadLocalNotices()
      }
    }

    const loadLocalNotices = () => {
      const localNotices = JSON.parse(localStorage.getItem("notices") || "[]")
      const popupNotice = localNotices.find((n: Notice) => n.showAsPopup)
      if (popupNotice) {
        showNoticeIfNotSeen(popupNotice)
      }
    }

    const showNoticeIfNotSeen = (popupNotice: Notice) => {
      const seenNotices = JSON.parse(localStorage.getItem("seenNotices") || "[]")
      const today = new Date().toDateString()
      const noticeKey = `${popupNotice.id}-${today}`

      if (!seenNotices.includes(noticeKey)) {
        setTimeout(() => {
          setNotice(popupNotice)
          setIsVisible(true)
        }, 2000)
      }
    }

    loadNotices()
  }, [])

  const handleClose = () => {
    if (notice) {
      const seenNotices = JSON.parse(localStorage.getItem("seenNotices") || "[]")
      const today = new Date().toDateString()
      const noticeKey = `${notice.id}-${today}`
      seenNotices.push(noticeKey)
      localStorage.setItem("seenNotices", JSON.stringify(seenNotices))
    }
    setIsVisible(false)
  }

  const handlePreview = () => {
    setIsPreviewOpen(true)
  }

  const handleDownload = () => {
    if (notice?.fileUrl) {
      const link = document.createElement('a')
      link.href = notice.fileUrl
      link.download = `${notice.title}.${notice.fileType === 'pdf' ? 'pdf' : 'jpg'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFileUrl = (notice: Notice) => {
    return notice.fileUrl || notice.image
  }

  const getFileType = (notice: Notice): 'image' | 'pdf' => {
    if (notice.fileType) return notice.fileType
    // Backward compatibility - if image exists, assume it's an image
    if (notice.image) return 'image'
    return 'image'
  }

  if (!isVisible || !notice) return null

  const fileUrl = getFileUrl(notice)
  const fileType = getFileType(notice)

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-auto shadow-2xl border-2 border-primary/20 animate-in fade-in-0 zoom-in-95 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-primary">
                <Bell className="w-5 h-5 mr-2" />
                {notice.title}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {fileUrl && (
              <div className="mb-4">
                {fileType === 'image' ? (
                  <img
                    src={fileUrl || "/placeholder.svg"}
                    alt={notice.title}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={handlePreview}
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium">PDF Document</p>
                        <p className="text-sm text-gray-600">Click to view or download</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={handlePreview}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDownload}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <p className="text-muted-foreground mb-4 leading-relaxed">{notice.content}</p>
            <div className="flex justify-end space-x-2">
              {fileUrl && (
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  {language === "ne" ? "हेर्नुहोस्" : "View"}
                </Button>
              )}
              <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
                {language === "ne" ? "बुझेँ!" : "Got it!"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{notice.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {fileUrl && fileType === 'image' ? (
              <img
                src={fileUrl || "/placeholder.svg"}
                alt={notice.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded"
              />
            ) : fileUrl && fileType === 'pdf' ? (
              <iframe
                src={fileUrl}
                className="w-full h-[70vh] border-0 rounded"
                title={notice.title}
              />
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No preview available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}