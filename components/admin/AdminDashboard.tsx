"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { DashboardOverview } from "./DashboardOverview"
import { ProductManagement } from "./ProductManagement"
import { DocumentManagement } from "./DocumentManagement"
import { NoticeManagement} from "./NoticeManagement"
import { FactoryManagement } from "./FactoryManagement"
import { CarouselManagement } from "./CarouselManagement"
import { ImageManagement } from "./ImageManagement"
import { VideoManagement } from "./VideoManagement" 
import { TeamManagement } from "./TeamManagement" 
import { MailManagement } from "./MailManagement"
import { useAdminData } from "@/hooks/useAdminData"


interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    products,
    documents,
    notices,
    factories,
    mailSubmissions,
    mediaItems,
    carouselSlides,
    activityLogs,
    teamMembers,
    logActivity,
    updateProducts,
    updateDocuments,
    updateNotices,
    updateFactories,
    updateMailSubmissions,
    updateMediaItems,
    updateCarouselSlides,
    updateTeamMembers,
    adminUsername
  } = useAdminData()

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024)
      setSidebarOpen(width >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const data = {
    products,
    documents,
    notices,
    factories,
    mailSubmissions,
    mediaItems,
    carouselSlides,
    activityLogs,
    teamMembers
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview data={data} adminUsername={adminUsername} />
      case "products":
        return (
          <ProductManagement
            products={products}
            onSave={updateProducts}
            onLogActivity={logActivity}
          />
        )
      case "documents":
        return (
          <DocumentManagement
            documents={documents}
            onSave={updateDocuments}
            onLogActivity={logActivity}
          />
        )
      case "notices":
        return (
          <NoticeManagement
            notices={notices}
            onSave={updateNotices}
            onLogActivity={logActivity}
          />
        )
      case "factories":
        return (
          <FactoryManagement
            factories={factories}
            onSave={updateFactories}
            onLogActivity={logActivity}
          />
        )
      case "carousel":
        return (
          <CarouselManagement
            carouselSlides={carouselSlides}
            onSave={updateCarouselSlides}
            onLogActivity={logActivity}
          />
        )
      case "images":
        return (
          <ImageManagement
            mediaItems={mediaItems}
            onSave={updateMediaItems}
            onLogActivity={logActivity}
            adminUsername={adminUsername}
          />
        )
      case "videos":
        return (
          <VideoManagement
            mediaItems={mediaItems}
            onSave={updateMediaItems}
            onLogActivity={logActivity}
            adminUsername={adminUsername}
          />
        )
      case "team":
        return (
          <TeamManagement
            teamMembers={teamMembers}
            onSave={updateTeamMembers}
            onLogActivity={logActivity}
          />
        )
      case "mail":
        return (
          <MailManagement
            mailSubmissions={mailSubmissions}
            onSave={updateMailSubmissions}
            onLogActivity={logActivity}
          />
        )
      default:
        return <DashboardOverview data={data} adminUsername={adminUsername} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        onLogout={onLogout}
        currentTime={currentTime}
        adminUsername={adminUsername}
        data={data}
      />

      <main className="flex-1 flex flex-col min-h-screen">
        <Header setSidebarOpen={setSidebarOpen} adminUsername={adminUsername} />

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}