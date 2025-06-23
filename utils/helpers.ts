import { MailSubmission } from "../types/admin"
import { MessageCircle, Handshake } from "lucide-react"

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

export const getStatusColor = (status: string) => {
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

export const getTypeIcon = (type: string) => {
  return type === "dealer" ? Handshake : MessageCircle
}

export const exportData = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}