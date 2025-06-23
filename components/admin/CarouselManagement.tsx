import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { CarouselSlide } from '../../types/admin'
import { CarouselForm } from './forms/CarouselForm'

interface CarouselManagementProps {
  carouselSlides: CarouselSlide[]
  onSave: (carouselSlides: CarouselSlide[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
}

export function CarouselManagement({ carouselSlides, onSave, onLogActivity }: CarouselManagementProps) {
  const [editingCarousel, setEditingCarousel] = useState<CarouselSlide | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = (slide: CarouselSlide) => {
    if (editingCarousel) {
      const updatedSlides = carouselSlides.map((s) => (s.id === editingCarousel.id ? slide : s))
      onSave(updatedSlides)
      onLogActivity("Update", "Carousel", `Updated carousel slide: ${slide.title.en}`)
    } else {
      onSave([...carouselSlides, slide])
      onLogActivity("Create", "Carousel", `Created new carousel slide: ${slide.title.en}`)
    }
    setEditingCarousel(null)
    setIsDialogOpen(false)
  }

  const deleteCarouselSlide = (id: string) => {
    if (confirm("Are you sure you want to delete this carousel slide?")) {
      const slideToDelete = carouselSlides.find((s) => s.id === id)
      onSave(carouselSlides.filter((s) => s.id !== id))
      onLogActivity("Delete", "Carousel", `Deleted carousel slide: ${slideToDelete?.title.en || id}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carousel Management</h2>
        <Button
          onClick={() => {
            setEditingCarousel(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carouselSlides
          .sort((a, b) => a.order - b.order)
          .map((slide) => (
            <Card key={slide.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title.en}
                  className="w-full h-32 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                  }}
                />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-base">{slide.title.en}</h3>
                    <p className="text-sm text-muted-foreground">{slide.title.ne}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{slide.order}</Badge>
                    <Badge variant={slide.isActive ? "default" : "secondary"}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{slide.subtitle.en}</p>
                <p className="text-xs text-muted-foreground mb-4">Duration: {slide.duration}ms</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingCarousel(slide)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteCarouselSlide(slide.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <CarouselForm
        carousel={editingCarousel}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}