"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import initialCarouselData from "@/data/carousel.json"

interface CarouselSlide {
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

export function HeroCarousel() {
  const { language } = useLanguage()
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    loadSlides()

    const handleCarouselUpdate = () => {
      loadSlides()
    }

    window.addEventListener("carouselUpdated", handleCarouselUpdate)
    return () => window.removeEventListener("carouselUpdated", handleCarouselUpdate)
  }, [])

  const loadSlides = () => {
    try {
      const savedCarousel = localStorage.getItem("carousel")
      if (savedCarousel) {
        const parsedSlides = JSON.parse(savedCarousel)
        const activeSlides = parsedSlides
          .filter((slide: CarouselSlide) => slide.isActive)
          .sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order)
        setSlides(activeSlides)
      } else {
        // Use initial carousel data with working images
        const activeSlides = initialCarouselData.filter((slide) => slide.isActive).sort((a, b) => a.order - b.order)
        setSlides(activeSlides)
      }
    } catch (error) {
      console.error("Error loading carousel slides:", error)
      // Fallback to initial data
      const activeSlides = initialCarouselData.filter((slide) => slide.isActive).sort((a, b) => a.order - b.order)
      setSlides(activeSlides)
    }
  }

  useEffect(() => {
    if (!isPlaying || slides.length === 0) return

    const currentSlideDuration = slides[currentSlide]?.duration || 5000
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, currentSlideDuration)

    return () => clearInterval(timer)
  }, [currentSlide, isPlaying, slides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-green-800">
            Welcome to Vargo Agro Industries
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-600 max-w-3xl mx-auto">
            Leading agricultural company in Nepal providing premium quality products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("products")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white">
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    index === currentSlide && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    {language === "ne" ? slide.title.ne : slide.title.en}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed font-light">
                    {language === "ne" ? slide.subtitle.ne : slide.subtitle.en}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => scrollToSection("products")}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Explore Products
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => scrollToSection("contact")}
                      className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Get In Touch
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </>
      )}

      {/* Slide Counter */}
      {slides.length > 1 && (
        <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </section>
  )
}
