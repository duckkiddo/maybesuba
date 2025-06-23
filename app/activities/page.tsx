"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  TrendingUp,
  Users,
  MapPin,
  Wheat,
  BarChart3,
  Cloud,
  Droplet,
  Sun,
  Leaf,
  Mountain,
  Factory,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function ActivitiesPage() {
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

    const handleLanguageChange = () => {
      try {
        const updatedLanguage = localStorage.getItem("language") as "en" | "ne"
        if (updatedLanguage && (updatedLanguage === "en" || updatedLanguage === "ne")) {
          setLanguage(updatedLanguage)
        }
      } catch (error) {
        console.warn("Could not access localStorage:", error)
      }
    }

    window.addEventListener("languageChanged", handleLanguageChange)
    return () => window.removeEventListener("languageChanged", handleLanguageChange)
  }, [])

  const statistics = [
    {
      icon: TrendingUp,
      value: "25.8%",
      label: language === "ne" ? "जीडीपीमा कृषिको योगदान" : "Agriculture's GDP Contribution",
      description:
        language === "ne"
          ? "नेपालको अर्थतन्त्रमा कृषिको महत्वपूर्ण भूमिका"
          : "Agriculture plays a vital role in Nepal's economy",
    },
    {
      icon: Users,
      value: "66%",
      label: language === "ne" ? "कृषिमा निर्भर जनसंख्या" : "Population Dependent on Agriculture",
      description:
        language === "ne"
          ? "नेपालको जनसंख्याको दुई तिहाई कृषिमा निर्भर"
          : "Two-thirds of Nepal's population depends on agriculture",
    },
    {
      icon: MapPin,
      value: "3.9M",
      label: language === "ne" ? "कुल कृषि घरपरिवार" : "Total Agricultural Households",
      description: language === "ne" ? "देशभरका कृषि घरपरिवारहरू" : "Agricultural households across the country",
    },
    {
      icon: BarChart3,
      value: "5.2M",
      label: language === "ne" ? "हेक्टेयर कृषि योग्य भूमि" : "Hectares of Arable Land",
      description: language === "ne" ? "कुल कृषि योग्य जमिन" : "Total cultivable land area",
    },
    {
      icon: Leaf,
      value: "147,181",
      label: language === "ne" ? "वर्ग किलोमिटर कुल क्षेत्रफल" : "Total Area (sq km)",
      description: language === "ne" ? "नेपालको कुल भौगोलिक क्षेत्रफल" : "Nepal's total geographical area",
    },
    {
      icon: Mountain,
      value: "8,848m",
      label: language === "ne" ? "सर्वोच्च श��खर" : "Highest Peak",
      description: language === "ne" ? "सगरमाथाको उचाइ" : "Mount Everest elevation",
    },
  ]

  const crops = [
    {
      icon: Wheat,
      name: language === "ne" ? "धान" : "Rice",
      production: "5.6M tons",
      area: "1.5M hectares",
      percentage: "52%",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
      description: language === "ne" ? "नेपालको मुख्य खाद्यान्न बाली" : "Nepal's primary food crop",
    },
    {
      icon: Wheat,
      name: language === "ne" ? "मकै" : "Maize",
      production: "2.3M tons",
      area: "0.9M hectares",
      percentage: "21%",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
      description: language === "ne" ? "दोस्रो मुख्य अनाज बाली" : "Second major cereal crop",
    },
    {
      icon: Wheat,
      name: language === "ne" ? "गहुँ" : "Wheat",
      production: "2.1M tons",
      area: "0.7M hectares",
      percentage: "19%",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      description: language === "ne" ? "जाडो मौसमको मुख्य बाली" : "Main winter season crop",
    },
    {
      icon: Wheat,
      name: language === "ne" ? "आलु" : "Potato",
      production: "3.1M tons",
      area: "0.2M hectares",
      percentage: "28%",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
      description: language === "ne" ? "नगदे बाली र खाद्यान्न" : "Cash crop and food staple",
    },
    {
      icon: Leaf,
      name: language === "ne" ? "चिया" : "Tea",
      production: "23,000 tons",
      area: "16,000 hectares",
      percentage: "2%",
      image: "https://images.unsplash.com/photo-1602943543714-cf535b048440?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhJTIwbGVhdmVzfGVufDB8fDB8fHww",
      description: language === "ne" ? "निर्यातमुखी नगदे बाली" : "Export-oriented cash crop",
    },
    {
      icon: Leaf,
      name: language === "ne" ? "कफी" : "Coffee",
      production: "1,200 tons",
      area: "2,500 hectares",
      percentage: "1%",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
      description: language === "ne" ? "उच्च गुणस्तरको कफी" : "High-quality specialty coffee",
    },
  ]

  const challenges = [
    {
      title: language === "ne" ? "जलवायु परिवर्तन" : "Climate Change",
      description:
        language === "ne"
          ? "अनियमित वर्षा र बढ्दो तापक्रमले कृषि उत्पादनमा प्रभाव"
          : "Irregular rainfall and rising temperatures affecting agricultural production",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop",
      icon: Cloud,
      impact: language === "ne" ? "उत्पादनमा २०% कमी" : "20% reduction in yield",
    },
    {
      title: language === "ne" ? "आधुनिक प्रविधिको अभाव" : "Lack of Modern Technology",
      description:
        language === "ne"
          ? "परम्परागत खेती विधि र आधुनिक उपकरणको कमी"
          : "Traditional farming methods and shortage of modern equipment",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      icon: Factory,
      impact: language === "ne" ? "कम उत्पादकता" : "Lower productivity",
    },
    {
      title: language === "ne" ? "बजार पहुँच" : "Market Access",
      description:
        language === "ne"
          ? "उत्पादनको उचित मूल्य र बजार पहुँचको समस्या"
          : "Issues with fair pricing and market access for products",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
      icon: MapPin,
      impact: language === "ne" ? "किसानको आम्दानीमा कमी" : "Reduced farmer income",
    },
    {
      title: language === "ne" ? "भूमि विभाजन" : "Land Fragmentation",
      description:
        language === "ne"
          ? "साना र छुट्टाछुट्टै जमिनका टुक्राहरूले दक्षता घटाउने"
          : "Small and scattered land plots reducing efficiency",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      icon: MapPin,
      impact: language === "ne" ? "यान्त्रिकीकरणमा बाधा" : "Hindrance to mechanization",
    },
  ]

  const seasons = [
    {
      name: language === "ne" ? "बैशाख - असार" : "Spring Season (Chaitra-Ashar)",
      months: language === "ne" ? "अप्रिल - जुलाई" : "April - July",
      activities: language === "ne" ? "धान रोपाइँ र गर्मी बालीहरू" : "Rice planting and summer crops",
      icon: Sun,
      color: "green",
      temperature: "15-30°C",
      crops: language === "ne" ? "धान, मकै, तरकारी" : "Rice, Maize, Vegetables",
    },
    {
      name: language === "ne" ? "साउन - कार्तिक" : "Monsoon Season (Shrawan-Kartik)",
      months: language === "ne" ? "अगस्त - नोभेम्बर" : "August - November",
      activities: language === "ne" ? "धान हेरचाह र फसल काट्ने" : "Rice care and harvesting",
      icon: Droplet,
      color: "blue",
      temperature: "20-35°C",
      crops: language === "ne" ? "धान, दलहन, तिलहन" : "Rice, Pulses, Oilseeds",
    },
    {
      name: language === "ne" ? "मंसिर - चैत" : "Winter Season (Mangsir-Chaitra)",
      months: language === "ne" ? "डिसेम्बर - मार्च" : "December - March",
      activities: language === "ne" ? "गहुँ र जाडो बालीहरू" : "Wheat and winter crops",
      icon: Cloud,
      color: "orange",
      temperature: "5-25°C",
      crops: language === "ne" ? "गहुँ, जौ, आलु" : "Wheat, Barley, Potato",
    },
  ]

  const regions = [
    {
      name: language === "ne" ? "तराई क्षेत्र" : "Terai Region",
      description: language === "ne" ? "मुख्य कृषि उत्पादन क्षेत्र" : "Main agricultural production area",
      area: "23%",
      production: "68%",
      image: "https://images.unsplash.com/photo-1558449174-6a54c5aa67c9?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVyYWklMjBmYXJtaW5nfGVufDB8fDB8fHww",
      crops: language === "ne" ? "धान, गहुँ, मकै, गन्ना" : "Rice, Wheat, Maize, Sugarcane",
    },
    {
      name: language === "ne" ? "पहाडी क्षेत्र" : "Hill Region",
      description: language === "ne" ? "टेरेस खेती र बागवानी" : "Terrace farming and horticulture",
      area: "42%",
      production: "28%",
      image: "https://images.unsplash.com/photo-1692782521443-b2ec5612d31e?w=1600&auto=format&fit=crop",
      crops: language === "ne" ? "मकै, कोदो, फलफूल" : "Maize, Millet, Fruits",
    },
    {
      name: language === "ne" ? "हिमाली क्षेत्र" : "Mountain Region",
      description: language === "ne" ? "सीमित कृषि र पशुपालन" : "Limited agriculture and livestock",
      area: "35%",
      production: "4%",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      crops: language === "ne" ? "जौ, आलु, याक पालन" : "Barley, Potato, Yak herding",
    },
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
                {language === "ne" ? "नेपालको कृषि गतिविधिहरू" : "Nepal's Agricultural Activities"}
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl leading-relaxed">
                {language === "ne"
                  ? "नेपालको कृषि क्षेत्रको विस्तृत विवरण, तथ्याङ्क र चुनौतिहरूको अवलोकन। यो देशको अर्थतन्त्र र जनजीवनको मुख्य आधार हो।"
                  : "Comprehensive overview of Nepal's agricultural sector, statistics, and challenges. Agriculture forms the backbone of the country's economy and livelihood."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Key Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {statistics.map((stat, index) => (
              <Card
                key={index}
                className="text-center border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-800 mb-2">{stat.value}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regional Distribution */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-green-800">
                {language === "ne" ? "भौगोलिक वितरण" : "Regional Distribution"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "ne"
                  ? "नेपालका विभिन्न भौगोलिक क्षेत्रहरूमा कृषि"
                  : "Agriculture across Nepal's diverse geographical regions"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {regions.map((region, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={region.image || "/placeholder.svg"}
                      alt={region.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{region.name}</h3>
                    <p className="text-gray-600 mb-4">{region.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === "ne" ? "क्षेत्रफल:" : "Area:"}</span>
                        <Badge variant="outline">{region.area}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === "ne" ? "उत्पादन:" : "Production:"}</span>
                        <Badge variant="outline">{region.production}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      <strong>{language === "ne" ? "मुख्य बालीहरू:" : "Main Crops:"}</strong> {region.crops}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Major Crops Section */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-green-800">
                {language === "ne" ? "मुख्य बालीहरू" : "Major Crops"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "ne"
                  ? "नेपालमा उत्पादन हुने मुख्य कृषि बालीहरू र तिनका विशेषताहरू"
                  : "Primary agricultural crops produced in Nepal and their characteristics"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {crops.map((crop, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={crop.image || "/placeholder.svg"}
                      alt={crop.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <crop.icon className="w-6 h-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-bold text-gray-800">{crop.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{crop.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === "ne" ? "उत्पादन:" : "Production:"}</span>
                        <Badge variant="outline">{crop.production}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === "ne" ? "क्षे���्रफल:" : "Area:"}</span>
                        <Badge variant="outline">{crop.area}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === "ne" ? "योगदान:" : "Share:"}</span>
                        <Badge className="bg-green-100 text-green-800">{crop.percentage}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Agricultural Calendar */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-green-800">
                {language === "ne" ? "कृषि पंचाङ्ग" : "Agricultural Calendar"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "ne"
                  ? "नेपालको मुख्य कृषि मौसमहरू र तिनका विशेषताहरू"
                  : "Nepal's main agricultural seasons and their characteristics"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {seasons.map((season, index) => (
                <Card
                  key={index}
                  className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6 text-center">
                    <season.icon className={`w-12 h-12 text-${season.color}-600 mx-auto mb-4`} />
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{season.name}</h3>
                    <p className="text-gray-600 mb-4">{season.activities}</p>
                    <div className="space-y-2 mb-4">
                      <Badge className={`bg-${season.color}-100 text-${season.color}-800`}>{season.months}</Badge>
                      <div className="text-sm text-gray-500">
                        <p>
                          <strong>{language === "ne" ? "तापक्रम:" : "Temperature:"}</strong> {season.temperature}
                        </p>
                        <p>
                          <strong>{language === "ne" ? "मुख्य बालीहरू:" : "Main Crops:"}</strong> {season.crops}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Challenges Section */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-green-800">
                {language === "ne" ? "मुख्य चुनौतिहरू" : "Key Challenges"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "ne"
                  ? "नेपालको कृषि क्षेत्रले सामना गरिरहेका मुख्य समस्याहरू र तिनका समाधानहरू"
                  : "Major issues facing Nepal's agricultural sector and potential solutions"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {challenges.map((challenge, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={challenge.image || "/placeholder.svg"}
                      alt={challenge.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <challenge.icon className="w-6 h-6 text-red-600 mr-2" />
                      <h3 className="text-lg font-bold text-gray-800">{challenge.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    <Badge variant="destructive" className="text-xs">
                      {challenge.impact}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Nepal Agriculture Images Gallery */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-green-800">
                {language === "ne" ? "नेपालको कृषि दृश्यहरू" : "Nepal's Agricultural Landscapes"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "ne"
                  ? "नेपालको सुन्दर कृषि दृश्यहरू र परम्परागत खेती विधिहरू"
                  : "Beautiful agricultural landscapes and traditional farming methods of Nepal"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1718179620334-b1d5056ed607?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmVwYWwlMjBpbWFnZXMlMjBmYXJtaW5nfGVufDB8fDB8fHww"
                  alt="Terraced rice fields in Nepal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1606681547171-1b785c9c5923?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5lcGFsJTIwaW1hZ2VzJTIwZmFybWluZ3xlbnwwfHwwfHx8MA%3D%3Dhttps://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&h=600&fit=crop"
                  alt="Farmer plowing field in Nepal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://plus.unsplash.com/premium_photo-1677850457318-06499bd9f58c?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y293JTIwZmFybWluZ3xlbnwwfHwwfHx8MA%3D%3D"
                  alt="Mountain farming in Nepal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1647102726509-eb8a7ed92015?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2hlYXQlMjBmaWVsZCUyMG5lcGFsfGVufDB8fDB8fHww"
                  alt="Wheat fields in Nepal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1613066703265-5bf64354c1c6?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmVnZXRhYmxlJTIwZmFybWluZyUyMG5lcGFsfGVufDB8fDB8fHww"
                  alt="Vegetable farming in Nepal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1651910031151-600cae79904f?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VucmlzZSUyMGZhcm0lMjBuZXBhbHxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Sunrise over farmland in Nepal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </section>

          {/* Economic Impact */}
          <section className="mb-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-green-800">
                {language === "ne" ? "आर्थिक प्रभाव" : "Economic Impact"}
              </h2>
              <p className="text-xl text-gray-600">
                {language === "ne" ? "नेपालको अर्थतन्त्रमा कृषिको योगदान" : "Agriculture's contribution to Nepal's economy"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-800 mb-2">NPR 1.2T</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === "ne" ? "कुल कृषि उत्पादन" : "Total Agricultural Output"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ne" ? "वार्षिक कृषि उत्पादनको मूल्य" : "Annual value of agricultural production"}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-800 mb-2">18M</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === "ne" ? "कृषिमा संलग्न जनसंख्या" : "People in Agriculture"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ne" ? "प्रत्यक्ष र अप्रत्यक्ष रूपमा संलग्न" : "Directly and indirectly involved"}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <BarChart3 className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-orange-800 mb-2">$2.1B</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === "ne" ? "कृषि निर्यात" : "Agricultural Exports"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ne" ? "वार्षिक कृषि निर्यातको मूल्य" : "Annual agricultural export value"}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-purple-800 mb-2">753</div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {language === "ne" ? "स्थानीय तह" : "Local Levels"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === "ne" ? "कृषि कार्यक्रम भएका स्थानीय तह" : "Local levels with agricultural programs"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
