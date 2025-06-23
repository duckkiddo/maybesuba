import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  FileText,
  Bell,
  Factory,
  ImageIcon,
  Video,
  Users,
  Mail,
  Home,
  LogOut,
  X,
  ImageIcon as ImageLucide,
} from "lucide-react"
import Image from "next/image"
import type { AdminDashboardState } from '../../types/admin'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isMobile: boolean
  onLogout: () => void
  currentTime: Date
  adminUsername: string
  data: AdminDashboardState
}

export function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  onLogout,
  currentTime,
  adminUsername,
  data
}: SidebarProps) {
  const newMailCount = data.mailSubmissions.filter((mail) => mail.status === "new").length

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package, count: data.products.length },
    { id: "documents", label: "Documents", icon: FileText, count: data.documents.length },
    { id: "notices", label: "Notices", icon: Bell, count: data.notices.length },
    { id: "factories", label: "Factories", icon: Factory, count: data.factories.length },
    { id: "carousel", label: "Carousel", icon: ImageIcon, count: data.carouselSlides.length },
    { id: "images", label: "Images", icon: ImageLucide, count: data.mediaItems.filter((m) => m.type === "image").length },
    { id: "videos", label: "Videos", icon: Video, count: data.mediaItems.filter((m) => m.type === "video").length },
    { id: "team", label: "Team", icon: Users, count: data.teamMembers.length },
    { id: "mail", label: "Mail", icon: Mail, count: newMailCount, highlight: newMailCount > 0 },
  ]

  return (
    <aside
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none border-r border-gray-200`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-3 flex-shrink-0">
            <Image
              src="/images/vargo-agro-logo.png"
              alt="Vargo Agro Industries Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">Admin Panel</h1>
            <p className="text-xs text-gray-500 truncate">Vargo Agro Industries</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0" onClick={() => setSidebarOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-full flex flex-col overflow-hidden">
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                if (isMobile) setSidebarOpen(false)
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === item.id
                  ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.count !== undefined && (
                <Badge
                  className={`ml-2 flex-shrink-0 ${item.highlight ? "bg-red-500" : "bg-gray-200 text-gray-800"}`}
                >
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center mb-3">
            <Users className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 truncate">{adminUsername}</span>
          </div>
          <p className="text-xs text-gray-500 mb-3 truncate">
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </p>
          <div className="space-y-2">
            <Button variant="outline" onClick={() => (window.location.href = "/")} size="sm" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Homepage
            </Button>
            <Button variant="outline" onClick={onLogout} size="sm" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}