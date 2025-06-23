"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ImageIcon, Calendar, ArrowLeft } from "lucide-react"
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

export default function GalleryPage() {
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
        // Filter for gallery images
        const galleryItems = mediaItems.filter(
          (item: MediaItem) => item.type === "image" && (item.displayIn?.includes("gallery") || !item.displayIn),
        )
        setGalleryImages(galleryItems)
      } else {
        // Load initial media data if no saved media exists
        const initialMediaData = [
          {
            id: "preset-1",
            title: language === "ne" ? "कारखाना परिसर" : "Factory Complex",
            type: "image",
            url: "/images/factory-new.jpg",
            thumbnail: "/images/factory-new.jpg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "factory",
            displayIn: ["gallery", "home"],
          },
          {
            id: "preset-2",
            title: language === "ne" ? "प्रशोधन उपकरण" : "Processing Equipment",
            type: "image",
            url: "/images/machine-new.jpg",
            thumbnail: "/images/machine-new.jpg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "machinery",
            displayIn: ["gallery", "home"],
          },
          {
            id: "preset-3",
            title: language === "ne" ? "कारखाना प्रवेशद्वार" : "Factory Entrance",
            type: "image",
            url: "/images/gate-new.jpg",
            thumbnail: "/images/gate-new.jpg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "facility",
            displayIn: ["gallery", "home"],
          },
          {
            id: "preset-4",
            title: language === "ne" ? "अनाज भण्डारण गोदाम" : "Grain Storage Warehouse",
            type: "image",
            url: "/images/storage-new.jpg",
            thumbnail: "/images/storage-new.jpg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "storage",
            displayIn: ["gallery"],
          },
          {
            id: "preset-5",
            title: language === "ne" ? "भण्डारण सुविधा" : "Storage Facility",
            type: "image",
            url: "/images/storageee-new.jpg",
            thumbnail: "/images/storageee-new.jpg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "storage",
            displayIn: ["gallery"],
          },
          {
            id: "preset-6",
            title: language === "ne" ? "उत्पादन भण्डारण" : "Product Storage",
            type: "image",
            url: "/images/store-new.jpg",
            thumbnail: "/images/store-new.jpg",
            uploadDate: "2024-01-01T00:00:00.000Z",
            category: "warehouse",
            displayIn: ["gallery"],
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
      setGalleryImages(fallbackImages)
    }
  }

  const fallbackImages = [
    {
      id: "1",
      title: language === "ne" ? "धान खेत" : "Rice Fields",
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1596392301391-8a8641869d3c?w=800&h=600&fit=crop",
      category: "gallery",
      uploadDate: new Date().toISOString(),
    },
    // Add more fallback images...
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
                {language === "ne" ? "ग्यालेरी" : "Gallery"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {language === "ne"
                  ? "हाम्रो कृषि गतिविधिहरू र उत्पादनहरूका तस्बिरहरूको संग्रह"
                  : "Collection of images showcasing our agricultural activities and products"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {galleryImages.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-600">
                {language === "ne" ? "कुनै तस्बिर फेला परेन" : "No Images Found"}
              </h3>
              <p className="text-gray-500">
                {language === "ne"
                  ? "ग्यालेरीमा तस्बिरहरू थप्न प्रशासकीय प्यानल प्रयोग गर्नुहोस्"
                  : "Use the admin panel to add images to the gallery"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryImages.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{image.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {image.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(image.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
