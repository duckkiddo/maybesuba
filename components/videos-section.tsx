"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play, Video, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

interface MediaItem {
  id: string
  title: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  uploadDate: string
  category: string
  description?: string
  displayIn?: string[]
}

export function VideosSection() {
  const [language, setLanguage] = useState<"en" | "ne">("en")
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as "en" | "ne"
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }

    // Load videos
    loadVideos()

    // Listen for media updates
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
        // Filter for videos that are marked for home display
        const videoItems = mediaItems.filter(
          (item: MediaItem) => item.type === "video" && item.displayIn?.includes("home"),
        )
        setVideos(videoItems)
        if (videoItems.length > 0 && !selectedVideo) {
          setSelectedVideo(videoItems[0])
        }
      }
    } catch (error) {
      console.warn("Could not load videos:", error)
    }
  }

  // Updated videos with your provided YouTube links
  const fallbackVideos = [
    {
      id: "1",
      title: language === "ne" ? "कृषि प्रक्रिया" : "Agricultural Process",
      type: "video" as const,
      url: "https://www.youtube.com/embed/dokFe4d-_qA",
      thumbnail: "https://img.youtube.com/vi/dokFe4d-_qA/maxresdefault.jpg",
      category: "video",
      uploadDate: new Date().toISOString(),
      description:
        language === "ne" ? "आधुनिक कृषि प्रक्रियाको विस्तृत विवरण" : "Detailed overview of modern agricultural processes",
    },
    {
      id: "2",
      title: language === "ne" ? "धान प्रशोधन" : "Rice Processing",
      type: "video" as const,
      url: "https://www.youtube.com/embed/xEkYnsuJ_EU",
      thumbnail: "https://img.youtube.com/vi/xEkYnsuJ_EU/maxresdefault.jpg",
      category: "video",
      uploadDate: new Date().toISOString(),
      description: language === "ne" ? "धान प्रशोधन प्रक्रिया" : "Rice processing techniques",
    },
    {
      id: "3",
      title: language === "ne" ? "कृषि उत्पादन" : "Agricultural Production",
      type: "video" as const,
      url: "https://www.youtube.com/embed/WRgZdHJKvdk",
      thumbnail: "https://img.youtube.com/vi/WRgZdHJKvdk/maxresdefault.jpg",
      category: "video",
      uploadDate: new Date().toISOString(),
      description: language === "ne" ? "कृषि उत्पादन प्रक्रिया" : "Agricultural production process",
    },
    {
      id: "4",
      title: language === "ne" ? "बीउ तयारी" : "Seed Preparation",
      type: "video" as const,
      url: "https://www.youtube.com/embed/ScMzIvxBSi4",
      thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
      category: "video",
      uploadDate: new Date().toISOString(),
      description: language === "ne" ? "गुणस्तरीय बीउ तयारी प्रक्रिया" : "Quality seed preparation process",
    },
  ]

  const displayVideos = videos.length > 0 ? videos : fallbackVideos
  const currentVideo = selectedVideo || (displayVideos.length > 0 ? displayVideos[0] : null)

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/embed/")) {
      return `${url}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`
    }

    let videoId = ""
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0]
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0]
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("shorts/")[1]?.split("?")[0]
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`
    }

    return url
  }

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-800">
            {language === "ne" ? "भिडियोहरू" : "Videos"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "ne"
              ? "हाम्रो कृषि प्रक्रिया र गतिविधिहरूका भिडियोहरू हेर्नुहोस्"
              : "Watch our agricultural processes and activities through videos"}
          </p>
        </div>

        {/* YouTube-like Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl">
              <div className="aspect-video relative">
                {currentVideo && (
                  <>
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideo.url)}
                      title={currentVideo.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    {/* Custom Controls Overlay */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-black/50 text-white hover:bg-black/70"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-green-800 mb-2">{currentVideo?.title}</h3>
                <p className="text-gray-600 mb-4">
                  {currentVideo?.description ||
                    (language === "ne" ? "भिडियो विवरण उपलब्ध छैन" : "No description available")}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {language === "ne" ? "अपलोड मिति:" : "Upload Date:"}{" "}
                    {currentVideo ? new Date(currentVideo.uploadDate).toLocaleDateString() : ""}
                  </span>
                  <span className="flex items-center">
                    <Video className="w-4 h-4 mr-1" />
                    {language === "ne" ? "भिडियो" : "Video"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Sidebar */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-green-800 mb-4">
              {language === "ne" ? "अन्य भिडियोहरू" : "Related Videos"}
            </h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {displayVideos.map((video) => (
                <Card
                  key={video.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    currentVideo?.id === video.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex">
                    <div className="w-32 h-20 relative flex-shrink-0">
                      <img
                        src={video.thumbnail || "/placeholder.svg?height=80&width=128"}
                        alt={video.title}
                        className="w-full h-full object-cover rounded-l"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-3 flex-1">
                      <h5 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">{video.title}</h5>
                      <p className="text-xs text-gray-500">{new Date(video.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/videos">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              {language === "ne" ? "सबै भिडियोहरू हेर्नुहोस्" : "View All Videos"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
