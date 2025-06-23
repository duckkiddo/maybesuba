"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ImageIcon } from "lucide-react"
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

export function GallerySection() {
  const [language, setLanguage] = useState<"en" | "ne">("en")
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([])

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as "en" | "ne"
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }

    // Load gallery images
    loadGalleryImages()

    // Listen for media updates
    const handleMediaUpdate = () => {
      loadGalleryImages()
    }

    window.addEventListener("mediaItemsUpdated", handleMediaUpdate)
    return () => window.removeEventListener("mediaItemsUpdated", handleMediaUpdate)
  }, [])

  const loadGalleryImages = () => {
    try {
      const savedMedia = localStorage.getItem("mediaItems")
      if (savedMedia) {
        const mediaItems = JSON.parse(savedMedia)
        // Filter for gallery images that are marked for home display
        const galleryItems = mediaItems
          .filter((item: MediaItem) => item.type === "image" && item.displayIn?.includes("home"))
          .slice(0, 6) // Show only first 6 images
        setGalleryImages(galleryItems)
      } else {
        // Load initial media data if no saved media exists
        const initialMediaData = [
          {
            id: "preset-1",
            title: "Factory Complex",
            type: "image",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/factory.JPG-oD56xncNWFngO1bwshbWXihBgNaZNZ.jpeg",
            thumbnail:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/factory.JPG-oD56xncNWFngO1bwshbWXihBgNaZNZ.jpeg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "factory",
            displayIn: ["gallery", "home"],
          },
          {
            id: "preset-2",
            title: "Processing Equipment",
            type: "image",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/machine.JPG-OkinpSHbnUoUnfI4IJg1rXGjd3hxSk.jpeg",
            thumbnail:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/machine.JPG-OkinpSHbnUoUnfI4IJg1rXGjd3hxSk.jpeg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "machinery",
            displayIn: ["gallery", "home"],
          },
          {
            id: "preset-3",
            title: "Factory Entrance",
            type: "image",
            url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gate.JPG-Z94X25R7UUPGbhoPxeGAW1g90cVwoP.jpeg",
            thumbnail:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gate.JPG-Z94X25R7UUPGbhoPxeGAW1g90cVwoP.jpeg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "facility",
            displayIn: ["gallery", "home"],
          },
        ]

        // Save initial data and set gallery images
        localStorage.setItem("mediaItems", JSON.stringify(initialMediaData))
        setGalleryImages(initialMediaData)

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent("mediaItemsUpdated"))
      }
    } catch (error) {
      console.warn("Could not load gallery images:", error)
      // Fallback to default images if there's an error
      setGalleryImages(fallbackImages)
    }
  }

  // Fallback images if no gallery images are available
  const fallbackImages = [
    {
      id: "1",
      title: "Rice Fields",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1596392301391-8a8641869d3c?w=600&h=400&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Farming",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&h=400&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Harvest",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Agriculture",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
    {
      id: "5",
      title: "Crops",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
    {
      id: "6",
      title: "Fields",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1601371095929-82c9589a9a31?w=600&h=400&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
  ]

  const displayImages = galleryImages.length > 0 ? galleryImages : fallbackImages

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-800">
            {language === "ne" ? "ग्यालेरी" : "Gallery"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === "ne"
              ? "हाम्रो कृषि गतिविधिहरू र उत्पादनहरूका तस्बिरहरू हेर्नुहोस्"
              : "Explore our agricultural activities and products through images"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayImages.map((image, index) => (
            <Card
              key={image.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                  }}
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{image.title}</h3>
                  <ImageIcon className="w-4 h-4 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/gallery">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              {language === "ne" ? "सबै तस्बिरहरू हेर्नुहोस्" : "View All Images"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
