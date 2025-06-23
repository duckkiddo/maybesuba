"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Video, Play, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface MediaItem {
  id: string
  title: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  uploadDate: string
  category: string
  displayIn?: string[]
}

export default function VideosPage() {
  const [language, setLanguage] = useState<"en" | "ne">("en")
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null)

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as "en" | "ne"
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }

    loadVideos()

    const handleMediaUpdate = () => {
      loadVideos()
    }

    window.addEventListener("mediaItemsUpdated", handleMediaUpdate)
    return () => window.removeEventListener("mediaItemsUpdated", handleMediaUpdate)
  }, [])

  const loadVideos = () => {
    try {
      const savedMedia = localStorage.getItem("mediaItems")
      if (savedMedia) {
        const mediaItems = JSON.parse(savedMedia)
        const videoItems = mediaItems.filter(
          (item: MediaItem) => item.type === "video" && (item.displayIn?.includes("videos") || !item.displayIn),
        )
        setVideos(videoItems)
      } else {
        setVideos(fallbackVideos)
      }
    } catch (error) {
      console.warn("Could not load videos:", error)
      setVideos(fallbackVideos)
    }
  }

  const fallbackVideos = [
    {
      id: "1",
      title: language === "ne" ? "कृषि प्रक्रिया" : "Agricultural Process",
      type: "video" as const,
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
      category: "video",
      uploadDate: new Date().toISOString(),
    },
  ]

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
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-green-800">
                {language === "ne" ? "भिडियोहरू" : "Videos"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {language === "ne"
                  ? "हाम्रो कृषि प्रक्रिया र गतिविधिहरूका भिडियोहरूको संग्रह"
                  : "Collection of videos showcasing our agricultural processes and activities"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-600">
                {language === "ne" ? "कुनै भिडियो फेला परेन" : "No Videos Found"}
              </h3>
              <p className="text-gray-500">
                {language === "ne" ? "भिडियोहरू थप्न प्रशासकीय प्यानल प्रयोग गर्नुहोस्" : "Use the admin panel to add videos"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200"
                >
                  <div className="aspect-video overflow-hidden relative group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                    <img
                      src={video.thumbnail || "/placeholder.svg?height=400&width=600"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {video.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(video.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-3xl aspect-video">
          <iframe
            src={`${selectedVideo.url}?autoplay=1&rel=0&modestbranding=1`}
            title={selectedVideo.title}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
