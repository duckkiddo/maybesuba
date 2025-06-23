export interface Document {
  id: string
  name: string
  description: string
  fileType: string
  category: string
  uploadDate: string
  fileUrl?: string
  fileSize?: number
  originalName?: string
  createdAt?: string
  updatedAt?: string
}

export interface Notice {
  id: string
  title: string
  content: string
  description?: string
  category?: string
  fileUrl?: string
  fileType?: "image" | "pdf"
  fileSize?: number
  originalName?: string
  image?: string // backward compatibility
  showAsPopup: boolean
  createdAt: string
  updatedAt?: string
  isActive?: boolean
  priority?: "low" | "medium" | "high"
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  subcategory?: string
  image?: string
  inStock: boolean
  whatsappPhone?: string
}

export type FactoryTypeType = "headquarters" | "depot" | "factory" | "dealer"

export interface FactoryType {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  contact: string
  type: FactoryTypeType
  image?: string
  video?: string
}

export interface MailSubmission {
  id: string
  type: "contact" | "dealer"
  name: string
  email: string
  phone?: string
  subject?: string
  message?: string
  company?: string
  contactPerson?: string
  businessType?: string
  location?: string
  volume?: string
  additionalInfo?: string
  submittedAt: string
  status: "new" | "read" | "replied"
}

export interface MediaItem {
  id: string
  title: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  uploadDate: string
  category: string
  displayIn?: string[]
}

export interface CarouselSlide {
  id: string
  image: string
  title: {
    en: string
    ne: string
  }
  subtitle: {
    en: string
    ne: string
  }
  duration: number
  order: number
  isActive: boolean
}

export interface ActivityLog {
  id: string
  action: string
  module: string
  details: string
  timestamp: string
  user: string
}

export interface TeamMember {
  id: string
  name: {
    en: string
    ne: string
  }
  position: {
    en: string
    ne: string
  }
  image: string
  type: "board" | "management"
  order: number
  isActive: boolean
}

export interface AdminDashboardState {
  products: Product[]
  documents: Document[]
  notices: Notice[]
  factories: FactoryType[]
  mailSubmissions: MailSubmission[]
  mediaItems: MediaItem[]
  carouselSlides: CarouselSlide[]
  activityLogs: ActivityLog[]
  teamMembers: TeamMember[]
}
