"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { FileText, Plus, Search, Edit, Trash2, Download, Eye } from "lucide-react"
import { DocumentForm } from "./forms/DocumentForm"

// Define the Document interface locally to avoid import issues
interface Document {
  id: string
  name: string
  description: string
  fileType: string
  category: string
  uploadDate: string
  fileUrl?: string
  fileData?: string
}

export function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchTerm, categoryFilter])

  const loadDocuments = () => {
    const savedDocuments = localStorage.getItem("documents")
    if (savedDocuments) {
      const parsedDocuments = JSON.parse(savedDocuments)
      setDocuments(parsedDocuments)
    }
  }

  const saveDocuments = (updatedDocuments: Document[]) => {
    localStorage.setItem("documents", JSON.stringify(updatedDocuments))
    setDocuments(updatedDocuments)

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent("documentsUpdated"))
  }

  const filterDocuments = () => {
    let filtered = documents

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((doc) => doc.category === categoryFilter)
    }

    setFilteredDocuments(filtered)
  }

  const handleAddDocument = () => {
    setSelectedDocument(null)
    setIsFormOpen(true)
  }

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document)
    setIsFormOpen(true)
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    const response = await fetch('/api/documents')
    const data = await response.json()
    if (data.success) {
      setDocuments(data.documents)
    }
  }

  const handleSaveDocument = async (document: Document) => {
    await fetchDocuments()
    setIsFormOpen(false)
    setSelectedDocument(null)
  }

  const handleDeleteDocument = (document: Document) => {
    setDeleteDocument(document)
  }

  const confirmDelete = () => {
    if (deleteDocument) {
      const updatedDocuments = documents.filter((doc) => doc.id !== deleteDocument.id)
      saveDocuments(updatedDocuments)
      setDeleteDocument(null)
    }
  }

  const handleDownload = (doc: Document) => {
    if (doc.fileUrl) {
      const link = document.createElement("a")
      link.href = doc.fileUrl
      link.download = doc.name
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

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

  const categories = ["all", "Legal", "Tax", "Quality", "Marketing", "Sales", "Financial", "Environmental", "Export"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-muted-foreground">Manage company documents and files</p>
        </div>
        <Button onClick={handleAddDocument}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
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
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
              <Button onClick={handleAddDocument} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{document.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(document.category)}>{document.category}</Badge>
                    </TableCell>
                    <TableCell>{document.fileType}</TableCell>
                    <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={document.fileUrl ? "default" : "secondary"}>
                        {document.fileUrl ? "Available" : "No File"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {document.fileUrl && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => window.open(document.fileUrl, "_blank")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEditDocument(document)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(document)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Document Form Dialog */}
      <DocumentForm
        document={selectedDocument}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedDocument(null)
        }}
        onSave={handleSaveDocument}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDocument} onOpenChange={() => setDeleteDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDocument?.name}"? This action cannot be undone.
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
