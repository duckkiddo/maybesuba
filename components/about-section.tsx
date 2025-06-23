"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, TargetIcon as Bullseye } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { language, t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("about")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Bullseye,
      title: t("about.mission"),
      description: t("about.missionText"),
      animation: "slide-in-left",
    },
    {
      icon: Eye,
      title: t("about.vision"),
      description: t("about.visionText"),
      animation: "fade-in",
    },
    {
      icon: Target,
      title: t("about.goals"),
      description: t("about.goalsText"),
      animation: "slide-in-right",
    },
  ]

  return (
    <section id="about" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">{t("about.title")}</h2>
          <p className="text-xl text-green-700 max-w-3xl mx-auto">{t("about.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`transition-all duration-1000 hover:shadow-lg hover:-translate-y-2 border-green-200 ${
                isVisible ? `${feature.animation} visible` : feature.animation
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-800">{feature.title}</h3>
                <p className="text-green-700 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
