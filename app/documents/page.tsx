"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  FileText,
  Download,
  Search,
  Calendar,
  FileType,
  ArrowLeft,
  Eye,
  Printer,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Document {
  id: string
  name: string
  description: string
  fileType: string
  category: string
  uploadDate: string
  fileUrl?: string
  fileSize?: number
  originalName?: string
}

export default function DocumentsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterYear, setFilterYear] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<{ [key: string]: "downloading" | "success" | "error" }>({})

  useEffect(() => {
    loadDocuments()

    // Listen for document updates
    const handleDocumentsUpdate = () => {
      loadDocuments()
    }

    window.addEventListener("documentsUpdated", handleDocumentsUpdate)
    return () => window.removeEventListener("documentsUpdated", handleDocumentsUpdate)
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to load from API first (database)
      try {
        const response = await fetch("/api/documents")
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.documents) {
            setDocuments(result.documents)
            return
          }
        }
      } catch (apiError) {
        console.warn("Failed to load from API, falling back to localStorage:", apiError)
      }

      // Fallback to localStorage
      const localDocuments = JSON.parse(localStorage.getItem("documents") || "[]")
      setDocuments(localDocuments)
    } catch (err) {
      console.error("Failed to load documents:", err)
      setError("Failed to load documents. Please try refreshing the page.")
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.category.toLowerCase() === filterType.toLowerCase()
    const docYear = new Date(doc.uploadDate).getFullYear().toString()
    const matchesYear = filterYear === "all" || docYear === filterYear

    return matchesSearch && matchesType && matchesYear
  })

  const categories = ["all", "Legal", "Tax", "Quality", "Marketing", "Sales", "Financial", "Environmental", "Export"]
  const years = [
    "all",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Legal: "bg-blue-100 text-blue-800",
      Tax: "bg-purple-100 text-purple-800",
      Quality: "bg-green-100 text-green-800",
      Marketing: "bg-pink-100 text-pink-800",
      Sales: "bg-orange-100 text-orange-800",
      Financial: "bg-yellow-100 text-yellow-800",
      Environmental: "bg-emerald-100 text-emerald-800",
      Export: "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc)
    setIsPreviewOpen(true)
  }

  const handleDownload = async (doc: Document) => {
    if (!doc.fileUrl) {
      alert("File not available for download.")
      return
    }

    setDownloadStatus((prev) => ({ ...prev, [doc.id]: "downloading" }))

    try {
      console.log("Starting download for document:", doc.name, doc.fileUrl)

      // Check if file exists by making a HEAD request first
      const checkResponse = await fetch(doc.fileUrl, { method: "HEAD" })
      if (!checkResponse.ok) {
        throw new Error(`File not found on server (${checkResponse.status})`)
      }

      // Get proper file extension
      const getFileExtension = (fileType: string, fileName?: string, originalName?: string) => {
        // If we have an original filename with extension, use that
        if (originalName && originalName.includes(".")) {
          return originalName.split(".").pop()?.toLowerCase() || "pdf"
        }

        // If we have a filename with extension, use that
        if (fileName && fileName.includes(".")) {
          return fileName.split(".").pop()?.toLowerCase() || "pdf"
        }

        // Map common file types to extensions
        const typeMap: { [key: string]: string } = {
          pdf: "pdf",
          doc: "doc",
          docx: "docx",
          xls: "xls",
          xlsx: "xlsx",
          txt: "txt",
          png: "png",
          jpg: "jpg",
          jpeg: "jpeg",
          gif: "gif",
          webp: "webp",
        }

        const normalizedType = fileType.toLowerCase()
        return typeMap[normalizedType] || "pdf"
      }

      const extension = getFileExtension(doc.fileType, doc.name, doc.originalName)
      const fileName = doc.originalName || (doc.name.includes(".") ? doc.name : `${doc.name}.${extension}`)

      // Create download link
      const link = document.createElement("a")
      link.href = doc.fileUrl
      link.download = fileName
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log("Download initiated successfully for:", fileName)
      setDownloadStatus((prev) => ({ ...prev, [doc.id]: "success" }))

      // Reset status after 3 seconds
      setTimeout(() => {
        setDownloadStatus((prev) => {
          const newStatus = { ...prev }
          delete newStatus[doc.id]
          return newStatus
        })
      }, 3000)
    } catch (error) {
      console.error("Download failed:", error)
      setDownloadStatus((prev) => ({ ...prev, [doc.id]: "error" }))

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`Failed to download file: ${errorMessage}. Please try again or contact support.`)

      // Reset error status after 5 seconds
      setTimeout(() => {
        setDownloadStatus((prev) => {
          const newStatus = { ...prev }
          delete newStatus[doc.id]
          return newStatus
        })
      }, 5000)
    }
  }

  const canPreview = (doc: Document) => {
    if (!doc.fileUrl) return false

    const fileType = doc.fileType.toLowerCase()
    // Can preview PDFs and images
    return fileType === "pdf" || ["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)
  }

  const getPreviewContent = (doc: Document) => {
    if (!doc.fileUrl) {
      return (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No preview available</p>
          <p className="text-sm text-gray-500 mt-2">File not uploaded yet</p>
        </div>
      )
    }

    const fileType = doc.fileType.toLowerCase()

    if (fileType === "pdf") {
      return (
        <iframe
          src={doc.fileUrl}
          className="w-full h-[70vh] border-0 rounded"
          title={doc.name}
          onError={() => {
            console.error("Failed to load PDF preview")
          }}
        />
      )
    } else if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
      return (
        <img
          src={doc.fileUrl || "/placeholder.svg"}
          alt={doc.name}
          className="w-full h-auto max-h-[70vh] object-contain rounded"
          onError={(e) => {
            console.error("Failed to load image preview")
            e.currentTarget.style.display = "none"
          }}
        />
      )
    } else {
      return (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-green-800">Document Preview</h3>
          <p className="text-green-600 mb-4">Preview is not available for {doc.fileType} files.</p>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleDownload(doc)}>
            <Download className="w-4 h-4 mr-2" />
            Download to View
          </Button>
        </div>
      )
    }
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ""
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getDownloadButtonContent = (doc: Document) => {
    const status = downloadStatus[doc.id]

    switch (status) {
      case "downloading":
        return (
          <>
            <Download className="w-3 h-3 mr-1 animate-spin" />
            Downloading...
          </>
        )
      case "success":
        return (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Downloaded
          </>
        )
      case "error":
        return (
          <>
            <AlertCircle className="w-3 h-3 mr-1" />
            Retry
          </>
        )
      default:
        return (
          <>
            <Download className="w-3 h-3 mr-1" />
            Download
          </>
        )
    }
  }

  const getDownloadButtonVariant = (doc: Document) => {
    const status = downloadStatus[doc.id]

    switch (status) {
      case "success":
        return "default"
      case "error":
        return "destructive"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-600">Loading documents...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="icon" asChild className="text-green-600 hover:bg-green-100 mr-4">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-800">Official Documents</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Access our company's official documents and certifications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="mb-8 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Search className="h-5 w-5 mr-2" />
                Search & Filter Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year === "all" ? "All Years" : year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-green-600 font-medium">
              Showing {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-green-800">{doc.name}</h3>
                  <p className="text-green-600 text-sm mb-4 line-clamp-3">{doc.description}</p>

                  <div className="space-y-2 text-xs text-green-500 mb-4">
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FileType className="w-3 h-3 mr-1" />
                        {doc.fileType}
                      </span>
                    </div>
                    {doc.fileSize && (
                      <div className="text-right">
                        <span className="text-green-500">{formatFileSize(doc.fileSize)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      variant={getDownloadButtonVariant(doc)}
                      onClick={() => handleDownload(doc)}
                      disabled={!doc.fileUrl || downloadStatus[doc.id] === "downloading"}
                    >
                      {getDownloadButtonContent(doc)}
                    </Button>
                    {canPreview(doc) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => handlePreview(doc)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredDocuments.length === 0 && !loading && (
            <Card className="text-center py-12 border-green-200">
              <CardContent>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-green-800">No documents found</h3>
                <p className="text-green-600 mb-4">
                  {documents.length === 0
                    ? "No documents have been uploaded yet."
                    : "Try adjusting your search terms or filters to find what you're looking for."}
                </p>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("all")
                    setFilterYear("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact Section */}
          <Card className="mt-12 border-green-200">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-green-800">Need Additional Documents?</h3>
              <p className="text-green-600 mb-6 max-w-2xl mx-auto">
                If you need any specific documents or certificates not listed above, please contact us and we'll be
                happy to provide them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/#contact">Request Documents</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => window.print()}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between text-green-800">
              <span>{selectedDocument?.name}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="flex flex-col h-full">
              {/* Document Info */}
              <div className="grid md:grid-cols-2 gap-4 p-6 bg-green-50 mx-6 rounded-lg">
                <div>
                  <h4 className="font-semibold mb-2 text-green-800">Document Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Category:</span>
                      <Badge className={getCategoryColor(selectedDocument.category)}>{selectedDocument.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">File Type:</span>
                      <span className="text-green-600">{selectedDocument.fileType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Upload Date:</span>
                      <span className="text-green-600">
                        {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedDocument.fileSize && (
                      <div className="flex justify-between">
                        <span className="font-medium text-green-700">File Size:</span>
                        <span className="text-green-600">{formatFileSize(selectedDocument.fileSize)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-800">Description</h4>
                  <p className="text-sm text-green-600">{selectedDocument.description}</p>
                </div>
              </div>

              {/* Document Preview */}
              <div className="flex-1 mx-6 mb-6">
                <div className="border rounded-lg bg-white h-full flex items-center justify-center min-h-[500px]">
                  {getPreviewContent(selectedDocument)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 p-6 pt-0 border-t">
                <Button
                  variant={getDownloadButtonVariant(selectedDocument)}
                  onClick={() => handleDownload(selectedDocument)}
                  disabled={!selectedDocument.fileUrl || downloadStatus[selectedDocument.id] === "downloading"}
                >
                  {getDownloadButtonContent(selectedDocument)}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
