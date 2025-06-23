"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LeafletMap, MapPlaceholder } from "@/components/leaflet-map"
import initialFactories from "@/data/factories.json"

interface FactoryType {
  id: string
  name: string
  description: string
  location: string
  phone: string
  employees: string
  established: string
  services: string[]
  coordinates: {
    lat: number
    lng: number
  }
  type: "factory" | "headquarters"
}

export function FactoriesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [factories, setFactories] = useState<FactoryType[]>([])
  const [mapError, setMapError] = useState<string | null>(null)
  const [language, setLanguage] = useState<"en" | "ne">("en")

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as "en" | "ne"
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("factories")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Load factories from localStorage and merge with initial data
    const loadFactories = () => {
      try {
        const savedFactories = localStorage.getItem("factories")
        if (savedFactories) {
          const parsedFactories = JSON.parse(savedFactories)
          setFactories(parsedFactories)
        } else {
          // Add type to initial factories data
          const factoriesWithType = initialFactories.map((factory, index) => ({
            ...factory,
            type: index === 0 ? "headquarters" : ("factory" as "factory" | "headquarters"),
          }))
          setFactories(factoriesWithType)
        }
      } catch (error) {
        console.error("Error loading factories:", error)
        // Add type to initial factories data as fallback
        const factoriesWithType = initialFactories.map((factory, index) => ({
          ...factory,
          type: index === 0 ? "headquarters" : ("factory" as "factory" | "headquarters"),
        }))
        setFactories(factoriesWithType)
      }
    }

    loadFactories()

    // Listen for storage changes to update factories in real-time
    const handleStorageChange = () => {
      loadFactories()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("factoriesUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("factoriesUpdated", handleStorageChange)
    }
  }, [])

  const stats = [
    { value: factories.length.toString(), label: language === "ne" ? "उत्पादन इकाइहरू" : "Manufacturing Units" },
    { value: "500+", label: language === "ne" ? "कुल कर्मचारीहरू" : "Total Employees" },
    { value: "25", label: language === "ne" ? "जिल्लाहरू समेटिएको" : "Districts Covered" },
    { value: "24/7", label: language === "ne" ? "संचालन" : "Operations" },
  ]

  return (
    <section id="factories" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">
            {language === "ne" ? "हाम्रा कारखानाहरू" : "Our Factories"}
          </h2>
          <p className="text-xl text-gray-600">
            {language === "ne"
              ? "नेपाल भरि हाम्रा उत्पादन केन्द्रहरू र कारखानाहरू"
              : "Our production centers and factories across Nepal"}
          </p>
        </div>

        {/* Interactive Map */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <Card className="overflow-hidden shadow-xl border-green-200">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-center text-green-800">
                {language === "ne" ? "हाम्रा स्थानहरू" : "Our Locations"}
              </h3>
              <p className="text-center text-gray-600 mb-6">
                {language === "ne"
                  ? "नेपाल भरि हाम्रा कारखाना स्थानहरू र मुख्यालय अन्वेषण गर्नुहोस्"
                  : "Explore our factory locations and headquarters across Nepal"}
              </p>
              {mapError ? (
                <MapPlaceholder factories={factories} error={mapError} />
              ) : (
                <LeafletMap factories={factories} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Factory Stats */}
        <Card className={`transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"} border-green-200`}>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
