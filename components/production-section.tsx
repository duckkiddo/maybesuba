"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Tractor, Factory, CheckCircle, Truck, ArrowRight } from "lucide-react"
import Image from "next/image"

export function ProductionSection() {
  const { t, language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("production")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const processSteps = [
    {
      icon: Tractor,
      title: "Sustainable Farming",
      description: "Modern farming techniques with environmental responsibility",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      details: "Using organic fertilizers and sustainable irrigation systems",
      image: "/images/gate.jpg",
    },
    {
      icon: Factory,
      title: "Advanced Processing",
      description: "State-of-the-art processing facilities with modern technology",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      details: "Automated sorting, cleaning, and packaging systems",
      image: "/images/machine.jpg",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Rigorous quality testing at every stage of production",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      details: "ISO 22000:2018 certified quality management system",
      image: "/images/store.jpg",
    },
    {
      icon: Truck,
      title: "Efficient Distribution",
      description: "Nationwide delivery network ensuring fresh products",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      details: "Cold chain logistics and real-time tracking",
      image: "/images/factory.jpg",
    },
  ]

  const productionStats = [
    { label: "Daily Rice Processing", value: "50+ Tons" },
    { label: "Egg Production", value: "10,000+ Daily" },
    { label: "Quality Tests", value: "500+ Daily" },
    { label: "Distribution Points", value: "200+ Locations" },
  ]

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current.play()
        setIsVideoPlaying(true)
      }
    }
  }

  return (
    <section id="production" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Production Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From farm to table, we maintain the highest standards of quality and sustainability throughout our
            production process
          </p>
        </div>

        {/* Production Video/Image Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <Card className={`overflow-hidden transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/10">
              <Image src="/images/storage.jpg" alt="Production Facility" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-3xl font-bold mb-4">Our Production Facility</h3>
                  <p className="text-xl text-white/90">Modern storage and processing capabilities</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ${
                isVisible ? "slide-in-left visible" : "slide-in-left"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <Card className="h-full hover:shadow-lg hover:-translate-y-2 transition-all group relative overflow-hidden">
                {/* Background Image on Hover */}
                {hoveredStep === index && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      fill
                      className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}

                <CardContent className="p-6 relative z-10">
                  <div
                    className={`${step.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <h4 className={`font-semibold mb-2 text-lg ${hoveredStep === index ? "text-white" : ""}`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm mb-3 ${hoveredStep === index ? "text-white/90" : "text-muted-foreground"}`}>
                    {step.description}
                  </p>
                  <p className={`text-xs ${hoveredStep === index ? "text-white/80" : "text-muted-foreground"}`}>
                    {step.details}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Production Statistics */}
        <Card className={`mb-12 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Production Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {productionStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Want to See Our Facilities?</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Schedule a visit to our production facilities and see our quality processes firsthand. We welcome
                partners, customers, and stakeholders to experience our commitment to excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  {language === "ne" ? "कारखाना भ्रमण तय गर्नुहोस्" : "Schedule Factory Visit"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-gray-900 bg-white hover:bg-gray-100 hover:text-gray-900"
                >
                  {language === "ne" ? "ब्रोसर डाउनलोड गर्नुहोस्" : "Download Brochure"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
