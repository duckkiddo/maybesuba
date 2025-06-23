"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("testimonials")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      name: "Ram Bahadur Thapa",
      role: "Restaurant Owner, Kathmandu",
      content:
        "The quality of rice from Vagro-Agro is exceptional. Our customers always compliment the taste and texture. Highly recommended!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Sita Devi Sharma",
      role: "Grocery Store Owner, Pokhara",
      content:
        "Fresh eggs delivered on time, every time. The packaging is excellent and the quality is consistently high. Great partnership!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    {
      name: "Arjun Prasad Poudel",
      role: "Wholesale Distributor, Chitwan",
      content:
        "Reliable supply chain and competitive pricing. Vagro-Agro has been our trusted partner for agricultural products for years.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground">Trusted by businesses and families across Nepal</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`transition-all duration-1000 hover:shadow-lg hover:-translate-y-2 bg-gradient-to-br from-primary/5 to-primary/10 ${
                isVisible ? "slide-in-left visible" : "slide-in-left"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground italic pl-6">{testimonial.content}</p>
                </div>

                <div className="flex">{renderStars(testimonial.rating)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
