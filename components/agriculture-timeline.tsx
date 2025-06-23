"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Droplets, Sun, Wheat, Package, Truck } from "lucide-react"

export function AgricultureTimeline() {
  const [isVisible, setIsVisible] = useState(false)
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("agriculture-timeline")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const timelineSteps = [
    {
      icon: Sprout,
      title: language === "ne" ? "बीउ रोपाइँ" : "Seed Planting",
      description: language === "ne" ? "उच्च गुणस्तरको बीउ छनोट र रोपाइँ" : "Selection and planting of high-quality seeds",
      duration: language === "ne" ? "१-२ दिन" : "1-2 Days",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: Droplets,
      title: language === "ne" ? "सिँचाइ र हेरचाह" : "Irrigation & Care",
      description: language === "ne" ? "नियमित सिँचाइ र बालीको हेरचाह" : "Regular irrigation and crop maintenance",
      duration: language === "ne" ? "३०-४५ दिन" : "30-45 Days",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: Sun,
      title: language === "ne" ? "बृद्धि र विकास" : "Growth & Development",
      description: language === "ne" ? "बालीको प्राकृतिक बृद्धि र विकास" : "Natural growth and development of crops",
      duration: language === "ne" ? "६०-९० दिन" : "60-90 Days",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      icon: Wheat,
      title: language === "ne" ? "फसल काट्ने" : "Harvesting",
      description: language === "ne" ? "परिपक्व फसलको कटाई" : "Harvesting of mature crops",
      duration: language === "ne" ? "५-७ दिन" : "5-7 Days",
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      icon: Package,
      title: language === "ne" ? "प्रशोधन र प्याकेजिङ" : "Processing & Packaging",
      description: language === "ne" ? "गुणस्तर नियन्त्रण र प्याकेजिङ" : "Quality control and packaging",
      duration: language === "ne" ? "२-३ दिन" : "2-3 Days",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      icon: Truck,
      title: language === "ne" ? "वितरण" : "Distribution",
      description: language === "ne" ? "बजारमा उत्पादन पुर्याउने" : "Delivery to markets and customers",
      duration: language === "ne" ? "१-२ दिन" : "1-2 Days",
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ]

  return (
    <section id="agriculture-timeline" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">
            🌾 {language === "ne" ? "कृषि उत्पादन प्रक्रिया" : "Agriculture Production Process"}
          </h2>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">
            {language === "ne"
              ? "बीउदेखि बजारसम्मको सम्पूर्ण कृषि उत्पादन प्रक्रिया"
              : "Complete agricultural production process from seed to market"}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600 rounded-full"></div>

          <div className="space-y-8 md:space-y-12">
            {timelineSteps.map((step, index) => (
              <div
                key={index}
                className={`relative transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center">
                  {index % 2 === 0 ? (
                    // Left side
                    <>
                      <div className="w-1/2 pr-8">
                        <Card className={`${step.bgColor} ${step.borderColor} border-2 card-hover`}>
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <div className={`p-3 rounded-full bg-gradient-to-r ${step.color} text-white mr-4`}>
                                <step.icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                                <Badge variant="outline" className="mt-1">
                                  {step.duration}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{step.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="relative z-10">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${step.color} border-4 border-white shadow-lg`}
                        ></div>
                      </div>
                      <div className="w-1/2 pl-8"></div>
                    </>
                  ) : (
                    // Right side
                    <>
                      <div className="w-1/2 pr-8"></div>
                      <div className="relative z-10">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${step.color} border-4 border-white shadow-lg`}
                        ></div>
                      </div>
                      <div className="w-1/2 pl-8">
                        <Card className={`${step.bgColor} ${step.borderColor} border-2 card-hover`}>
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <div className={`p-3 rounded-full bg-gradient-to-r ${step.color} text-white mr-4`}>
                                <step.icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                                <Badge variant="outline" className="mt-1">
                                  {step.duration}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{step.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                  <Card className={`${step.bgColor} ${step.borderColor} border-2 card-hover`}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div
                          className={`p-3 rounded-full bg-gradient-to-r ${step.color} text-white mr-4 flex-shrink-0`}
                        >
                          <step.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                            <Badge variant="outline" className="ml-2">
                              {step.duration}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className={`mt-16 transition-all duration-1000 ${isVisible ? "scale-in visible" : "scale-in"}`}>
          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                {language === "ne" ? "कुल उत्पादन समय" : "Total Production Time"}
              </h3>
              <div className="text-4xl font-bold mb-2">{language === "ne" ? "१००-१५० दिन" : "100-150 Days"}</div>
              <p className="text-green-100">
                {language === "ne" ? "बीउदेखि उपभोक्तासम्म पुग्न लाग्ने कुल समय" : "Total time from seed to consumer delivery"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
