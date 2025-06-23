"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Award, Users, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WelcomeSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [language, setLanguage] = useState<"en" | "ne">("en")
  const [homeImages, setHomeImages] = useState<any[]>([])

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as "en" | "ne"
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }

    // Load home images from media items
    loadHomeImages()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("welcome")
    if (element) {
      observer.observe(element)
    }

    // Listen for media updates
    const handleMediaUpdate = () => {
      loadHomeImages()
    }

    window.addEventListener("mediaItemsUpdated", handleMediaUpdate)

    return () => {
      observer.disconnect()
      window.removeEventListener("mediaItemsUpdated", handleMediaUpdate)
    }
  }, [])

  const loadHomeImages = () => {
    try {
      const savedMedia = localStorage.getItem("mediaItems")
      if (savedMedia) {
        const mediaItems = JSON.parse(savedMedia)
        const homeImageItems = mediaItems.filter(
          (item: any) => item.type === "image" && item.displayIn?.includes("home"),
        )
        setHomeImages(homeImageItems)
      } else {
        // Use fallback images from Unsplash
        setHomeImages([
          {
            id: "factory",
            title: language === "ne" ? "हाम्रो कारखाना" : "Our Factory",
            url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
            category: "factory",
          },
          {
            id: "machine",
            title: language === "ne" ? "प्रशोधन उपकरण" : "Processing Equipment",
            url: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop",
            category: "machinery",
          },
          {
            id: "storage",
            title: language === "ne" ? "भण्डारण सुविधा" : "Storage Facility",
            url: "https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=800&h=600&fit=crop",
            category: "storage",
          },
        ])
      }
    } catch (error) {
      console.warn("Could not load home images:", error)
      // Fallback to Unsplash URLs
      setHomeImages([
        {
          id: "factory",
          title: language === "ne" ? "हाम्रो कारखाना" : "Our Factory",
          url: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop",
          category: "factory",
        },
        {
          id: "machine",
          title: language === "ne" ? "प्रशोधन उपकरण" : "Processing Equipment",
          url: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop",
          category: "machinery",
        },
        {
          id: "storage",
          title: language === "ne" ? "भण्डारण सुविधा" : "Storage Facility",
          url: "https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=800&h=600&fit=crop",
          category: "storage",
        },
      ])
    }
  }

  const features = [
    {
      icon: Leaf,
      title: language === "ne" ? "प्राकृतिक उत्पादन" : "Natural Products",
      description: language === "ne" ? "१००% प्राकृतिक र जैविक उत्पादनहरू" : "100% natural and organic products",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Award,
      title: language === "ne" ? "गुणस्तरको आश्वासन" : "Quality Assurance",
      description: language === "ne" ? "उच्च गुणस्तरको ग्यारेन्टी" : "Guaranteed high quality standards",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: language === "ne" ? "विश्वसनीय सेवा" : "Trusted Service",
      description: language === "ne" ? "१५+ वर्षको अनुभव" : "15+ years of experience",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Globe,
      title: language === "ne" ? "राष्ट्रव्यापी पहुँच" : "Nationwide Reach",
      description: language === "ne" ? "नेपालभरि सेवा उपलब्ध" : "Service available across Nepal",
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <section id="welcome" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-800">
            {language === "ne" ? "वार्गो-एग्रो इन्डस्ट्रिजमा स्वागत छ" : "Welcome to Vargo Agro Industries"}
          </h2>
          <p className="text-xl text-green-700 max-w-4xl mx-auto leading-relaxed">
            {language === "ne"
              ? "हामी नेपालको अग्रणी कृषि कम्पनी हौं जसले उच्च गुणस्तरका कृषि उत्पादनहरू उत्पादन र वितरण गर्दछ। हाम्रो मुख्य उद्देश्य नेपाली किसानहरूको जीवनस्तर सुधार गर्नु र देशको खाद्य सुरक्षामा योगदान पुर्याउनु हो।"
              : "We are Nepal's leading agricultural company dedicated to producing and distributing premium quality agricultural products. Our mission is to improve the livelihood of Nepali farmers and contribute to the country's food security."}
          </p>
        </div>

        {/* Company Images Gallery */}
        <div className={`mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeImages.length >= 1 && (
              <div className="lg:col-span-2">
                <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-80">
                    <img
                      src={
                        homeImages[0]?.url ||
                        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop"
                      }
                      alt={homeImages[0]?.title || "Factory"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/70 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {homeImages[0]?.title || (language === "ne" ? "हाम्रो कारखाना" : "Our Factory")}
                      </h3>
                      <p className="text-green-100">
                        {language === "ne" ? "आधुनिक प्रविधिसहितको उत्पादन केन्द्र" : "Modern production facility"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            <div className="space-y-6">
              {homeImages.length >= 2 && (
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-36">
                    <img
                      src={
                        homeImages[1]?.url ||
                        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop"
                      }
                      alt={homeImages[1]?.title || "Processing Equipment"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-bold">
                        {homeImages[1]?.title || (language === "ne" ? "प्रशोधन उपकरण" : "Processing Equipment")}
                      </h4>
                    </div>
                  </div>
                </Card>
              )}
              {homeImages.length >= 3 && (
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-36">
                    <img
                      src={
                        homeImages[2]?.url ||
                        "https://images.unsplash.com/photo-1565011523534-747a8601f10a?w=800&h=600&fit=crop"
                      }
                      alt={homeImages[2]?.title || "Storage Facility"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <h4 className="font-bold">
                        {homeImages[2]?.title || (language === "ne" ? "भण्डारण सुविधा" : "Storage Facility")}
                      </h4>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`card-base card-hover transition-all duration-1000 ${
                isVisible ? "scale-in visible" : "scale-in"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.color} text-white mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-800">{feature.title}</h3>
                <p className="text-green-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-green-800">
              {language === "ne" ? "हाम्रो यात्रामा सामेल हुनुहोस्" : "Join Our Journey"}
            </h3>
            <p className="text-lg text-green-700 mb-8 max-w-3xl mx-auto">
              {language === "ne"
                ? "दिगो कृषि विकास र गुणस्तरीय उत्पादनको लागि हामीसँग सहकार्य गर्नुहोस्"
                : "Partner with us for sustainable agricultural development and quality production"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary btn-hover-lift">
                <Link href="/about">
                  {language === "ne" ? "हाम्रो बारेमा जान्नुहोस्" : "Learn About Us"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-secondary btn-hover-lift">
                <Link href="#contact">{language === "ne" ? "सम्पर्क गर्नुहोस्" : "Contact Us"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
