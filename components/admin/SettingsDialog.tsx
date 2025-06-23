import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Download, Trash, AlertTriangle } from "lucide-react"

interface SettingsDialogProps {
  adminUsername: string
}

export function SettingsDialog({ adminUsername }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      const storageKeys = [
        "products", "documents", "notices", "factories", 
        "mailSubmissions", "mediaItems", "carousel", 
        "activityLogs", "teamMembers"
      ]
      
      storageKeys.forEach(key => localStorage.removeItem(key))
      
      // Dispatch events to notify other components
      storageKeys.forEach(key => {
        window.dispatchEvent(new CustomEvent(`${key}Updated`))
      })
      
      alert("All data has been cleared successfully.")
      window.location.reload() // Reload to reset state
    }
  }

  const exportData = () => {
    const data = {
      products: JSON.parse(localStorage.getItem("products") || "[]"),
      documents: JSON.parse(localStorage.getItem("documents") || "[]").map((doc: any) => ({ ...doc, fileData: undefined })),
      notices: JSON.parse(localStorage.getItem("notices") || "[]"),
      factories: JSON.parse(localStorage.getItem("factories") || "[]"),
      mailSubmissions: JSON.parse(localStorage.getItem("mailSubmissions") || "[]"),
      mediaItems: JSON.parse(localStorage.getItem("mediaItems") || "[]"),
      carouselSlides: JSON.parse(localStorage.getItem("carousel") || "[]"),
      teamMembers: JSON.parse(localStorage.getItem("teamMembers") || "[]"),
      exportDate: new Date().toISOString(),
      exportedBy: adminUsername,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vargo-agro-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>Manage your dashboard data and settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={clearAllData} variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Clearing data will permanently delete all content. This action cannot be undone.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}