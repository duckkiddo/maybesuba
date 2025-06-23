"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ShoppingCart, Star, Leaf, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function RicePage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const riceVarieties = [
    {
      id: 1,
      name: language === "ne" ? "बासमती चामल" : "Basmati Rice",
      price: "NPR 180/kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
      category: "premium",
      description: language === "ne" ? "उच्च गुणस्तरको सुगन्धित चामल" : "High-quality aromatic rice",
      features: [
        language === "ne" ? "लामो दाना" : "Long grain",
        language === "ne" ? "सुगन्धित" : "Aromatic",
        language === "ne" ? "प्रिमियम गुणस्तर" : "Premium quality",
      ],
      rating: 4.8,
      availability: "In Stock",
    },
    {
      id: 2,
      name: language === "ne" ? "जस्मिन चामल" : "Jasmine Rice",
      price: "NPR 160/kg",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
      category: "premium",
      description: language === "ne" ? "मुलायम र सुगन्धित चामल" : "Soft and fragrant rice",
      features: [
        language === "ne" ? "मुलायम बनावट" : "Soft texture",
        language === "ne" ? "प्राकृतिक सुगन्ध" : "Natural fragrance",
        language === "ne" ? "पकाउन सजिलो" : "Easy to cook",
      ],
      rating: 4.7,
      availability: "In Stock",
    },
    {
      id: 3,
      name: language === "ne" ? "सेतो चामल" : "White Rice",
      price: "NPR 120/kg",
      image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=800&auto=format&fit=crop",
      category: "regular",
      description: language === "ne" ? "दैनिक प्रयोगको लागि उत्तम" : "Perfect for daily consumption",
      features: [
        language === "ne" ? "पोषणयुक्त" : "Nutritious",
        language === "ne" ? "किफायती मूल्य" : "Affordable price",
        language === "ne" ? "उच्च गुणस्तर" : "High quality",
      ],
      rating: 4.5,
      availability: "In Stock",
    },
    {
      id: 4,
      name: language === "ne" ? "रातो चामल" : "Red Rice",
      price: "NPR 200/kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop",
      category: "organic",
      description: language === "ne" ? "जैविक र पोषणयुक्त चामल" : "Organic and nutritious rice",
      features: [
        language === "ne" ? "जैविक" : "Organic",
        language === "ne" ? "फाइबर युक्त" : "High fiber",
        language === "ne" ? "एन्टिअक्सिडेन्ट" : "Antioxidants",
      ],
      rating: 4.9,
      availability: "Limited Stock",
    },
    {
      id: 5,
      name: language === "ne" ? "कालो चामल" : "Black Rice",
      price: "NPR 250/kg",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop",
      category: "organic",
      description: language === "ne" ? "सुपर फूड चामल" : "Superfood rice variety",
      features: [
        language === "ne" ? "सुपर फूड" : "Superfood",
        language === "ne" ? "एन्थोसायनिन" : "Anthocyanins",
        language === "ne" ? "प्रोटिन युक्त" : "High protein",
      ],
      rating: 4.9,
      availability: "Limited Stock",
    },
    {
      id: 6,
      name: language === "ne" ? "भुरा चामल" : "Brown Rice",
      price: "NPR 140/kg",
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=800&auto=format&fit=crop",
      category: "healthy",
      description: language === "ne" ? "स्वास्थ्यकर विकल्प" : "Healthy alternative",
      features: [
        language === "ne" ? "फाइबर युक्त" : "High fiber",
        language === "ne" ? "भिटामिन बी" : "Vitamin B",
        language === "ne" ? "कम ग्लाइसेमिक" : "Low glycemic",
      ],
      rating: 4.6,
      availability: "In Stock",
    },
  ]

  const categories = [
    { id: "all", name: language === "ne" ? "सबै" : "All" },
    { id: "premium", name: language === "ne" ? "प्रिमियम" : "Premium" },
    { id: "regular", name: language === "ne" ? "नियमित" : "Regular" },
    { id: "organic", name: language === "ne" ? "जैविक" : "Organic" },
    { id: "healthy", name: language === "ne" ? "स्वास्थ्यकर" : "Healthy" },
  ]

  const filteredRice =
    selectedCategory === "all" ? riceVarieties : riceVarieties.filter((rice) => rice.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      premium: "bg-yellow-100 text-yellow-800",
      regular: "bg-blue-100 text-blue-800",
      organic: "bg-green-100 text-green-800",
      healthy: "bg-purple-100 text-purple-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getAvailabilityColor = (availability: string) => {
    return availability === "In Stock" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
  }

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
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-800">
                {language === "ne" ? "चामलका किसिमहरू" : "Rice Varieties"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {language === "ne"
                  ? "नेपालमा उपलब्ध विभिन्न चामलका किसिमहरू"
                  : "Different rice varieties available in Nepal"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-600 text-green-600 hover:bg-green-50"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Rice Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRice.map((rice) => (
              <Card
                key={rice.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-green-200"
              >
                <div className="relative h-48">
                  <Image src={rice.image || "/placeholder.svg"} alt={rice.name} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(rice.category)}>
                      {rice.category.charAt(0).toUpperCase() + rice.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={getAvailabilityColor(rice.availability)}>{rice.availability}</Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-green-800">{rice.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-green-600 ml-1">{rice.rating}</span>
                    </div>
                  </div>

                  <p className="text-green-600 text-sm mb-4">{rice.description}</p>

                  <div className="space-y-2 mb-4">
                    {rice.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-green-600">
                        <Leaf className="w-3 h-3 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-green-800">{rice.price}</div>
                    <Button className="bg-green-600 hover:bg-green-700" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {language === "ne" ? "अर्डर गर्नुहोस्" : "Order Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quality Assurance */}
          <Card className="mt-16 border-green-200">
            <CardContent className="p-8 text-center">
              <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                {language === "ne" ? "गुणस्तरको आश्वासन" : "Quality Assurance"}
              </h2>
              <p className="text-green-600 mb-6 max-w-3xl mx-auto">
                {language === "ne"
                  ? "हाम्रो सबै चामल उत्पादनहरू कडा गुणस्तर नियन्त्रण प्रक्रियाबाट गुज्रिन्छन्। हामी केवल उत्कृष्ट गुणस्तरको चामल मात्र बजारमा ल्याउँछौं।"
                  : "All our rice products go through strict quality control processes. We only bring the finest quality rice to the market."}
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800">{language === "ne" ? "प्राकृतिक" : "Natural"}</h4>
                  <p className="text-sm text-green-600">{language === "ne" ? "कुनै रसायन छैन" : "No chemicals"}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800">{language === "ne" ? "प्रमाणित" : "Certified"}</h4>
                  <p className="text-sm text-green-600">{language === "ne" ? "गुणस्तर प्रमाणित" : "Quality certified"}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800">{language === "ne" ? "उत्कृष्ट" : "Premium"}</h4>
                  <p className="text-sm text-green-600">{language === "ne" ? "उच्च गुणस्तर" : "High quality"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
