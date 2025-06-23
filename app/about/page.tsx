"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, ExternalLink, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function AboutPage() {
  const [language, setLanguage] = useState<"en" | "ne">("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language") as "en" | "ne"
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ne")) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn("Could not access localStorage:", error)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const depots = [
    {
      id: 1,
      name: language === "ne" ? "काठमाडौं डिपो" : "Kathmandu Depot",
      address: "Teku, Kathmandu",
      image: "/images/store-new.jpg",
      mapLink: "https://maps.google.com/?q=Teku,Kathmandu",
    },
    {
      id: 2,
      name: language === "ne" ? "पोखरा डिपो" : "Pokhara Depot",
      address: "Mahendrapul, Pokhara",
      image: "/images/storage-new.jpg",
      mapLink: "https://maps.google.com/?q=Mahendrapul,Pokhara",
    },
    {
      id: 3,
      name: language === "ne" ? "चितवन डिपो" : "Chitwan Depot",
      address: "Bharatpur, Chitwan",
      image: "/images/storageee-new.jpg",
      mapLink: "https://maps.google.com/?q=Bharatpur,Chitwan",
    },
  ]

  const buildings = [
    {
      id: 1,
      name: language === "ne" ? "मुख्य कार्यालय" : "Head Office",
      address: "Bhaktapur Industrial Area, Kathmandu",
      image: "/images/factory-new.jpg",
      mapLink: "https://maps.google.com/?q=Bhaktapur+Industrial+Area,Kathmandu",
    },
    {
      id: 2,
      name: language === "ne" ? "उत्पादन केन्द्र" : "Production Center",
      address: "Balaju Industrial Area, Kathmandu",
      image: "/images/machine-new.jpg",
      mapLink: "https://maps.google.com/?q=Balaju+Industrial+Area,Kathmandu",
    },
  ]

  const suppliers = [
    {
      id: 1,
      name: language === "ne" ? "नेपाल एग्रो डिस्ट्रिब्युटर्स" : "Nepal Agro Distributors",
      address: "Putalisadak, Kathmandu",
      contact: "+977-1-4567890",
      region: language === "ne" ? "काठमाडौं उपत्यका" : "Kathmandu Valley",
    },
    {
      id: 2,
      name: language === "ne" ? "हिमालय कृषि सप्लायर्स" : "Himalaya Agriculture Suppliers",
      address: "Lakeside, Pokhara",
      contact: "+977-61-567890",
      region: language === "ne" ? "गण्डकी प्रदेश" : "Gandaki Province",
    },
    {
      id: 3,
      name: language === "ne" ? "तराई एग्रो प्रोडक्ट्स" : "Terai Agro Products",
      address: "Birgunj, Parsa",
      contact: "+977-51-567890",
      region: language === "ne" ? "मधेश प्रदेश" : "Madhesh Province",
    },
    {
      id: 4,
      name: language === "ne" ? "पूर्वी नेपाल डिस्ट्रिब्युटर्स" : "Eastern Nepal Distributors",
      address: "Biratnagar, Morang",
      contact: "+977-21-567890",
      region: language === "ne" ? "प्रदेश १" : "Province 1",
    },
    {
      id: 5,
      name: language === "ne" ? "पश्चिम नेपाल सप्लायर्स" : "Western Nepal Suppliers",
      address: "Nepalgunj, Banke",
      contact: "+977-81-567890",
      region: language === "ne" ? "लुम्बिनी प्रदेश" : "Lumbini Province",
    },
    {
      id: 6,
      name: language === "ne" ? "सुदूरपश्चिम एग्रो सेन्टर" : "Far-Western Agro Center",
      address: "Dhangadhi, Kailali",
      contact: "+977-91-567890",
      region: language === "ne" ? "सुदूरपश्चिम प्रदेश" : "Far-Western Province",
    },
  ]

  const videos = [
    {
      id: 1,
      title: language === "ne" ? "कम्पनी परिचय" : "Company Introduction",
      description: language === "ne" ? "हाम्रो कम्पनीको विस्तृत परिचय" : "Detailed introduction to our company",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      id: 2,
      title: language === "ne" ? "उत्पादन प्रक्रिया" : "Production Process",
      description: language === "ne" ? "चामल उत्पादनको सम्पूर्ण प्रक्रिया" : "Complete rice production process",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-green-800">
                {language === "ne" ? "हाम्रो बारेमा" : "About Us"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {language === "ne" ? "हाम्रो कम्पनीको विस्तृत जानकारी" : "Learn more about our company"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Company Introduction */}
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <Image
                  src="/images/factory-new.jpg"
                  alt="Vargo-Agro Industries (P).Ltd"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-6">
                  {language === "ne" ? "वार्गो-एग्रो इन्डस्ट्रिज (प्रा).लि." : "Vargo-Agro Industries (P).Ltd"}
                </h2>
                <p className="text-green-600 text-lg leading-relaxed mb-6">
                  {language === "ne"
                    ? "वार्गो-एग्रो इन्डस्ट्रिज (प्रा).लि. नेपालको अग्रणी कृषि कम्पनी हो जसले १५ वर्षभन्दा बढी समयदेखि उच्च गुणस्तरका कृषि उत्पादनहरू उत्पादन र वितरण गर्दै आएको छ। हाम्रो मुख्य उद्देश्य नेपाली किसानहरूको जीवनस्तर सुधार गर्नु र देशको खाद्य सुरक्षामा योगदान पुर्याउनु हो।"
                    : "Vargo-Agro Industries (P).Ltd is Nepal's leading agricultural company that has been producing and distributing high-quality agricultural products for over 15 years. Our main objective is to improve the livelihood of Nepali farmers and contribute to the country's food security."}
                </p>
                <p className="text-green-600 text-lg leading-relaxed">
                  {language === "ne"
                    ? "हामी आधुनिक प्रविधि र दिगो कृषि पद्धतिको प्रयोग गरेर चामल, अण्डा र अन्य कृषि उत्पादनहरू उत्पादन गर्छौं। हाम्रो उत्पादनहरू नेपालभरका ७५ जिल्लामा पुगेका छन्।"
                    : "We produce rice, eggs, and other agricultural products using modern technology and sustainable farming practices. Our products have reached all 75 districts of Nepal."}
                </p>
              </div>
            </div>
          </div>

          {/* Mission, Vision, Goals */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  {language === "ne" ? "हाम्रो लक्ष्य" : "Our Mission"}
                </h3>
                <p className="text-green-600">
                  {language === "ne"
                    ? "नेपालमा उच्च गुणस्तरको कृषि उत्पादनहरू प्रदान गर्ने र किसानहरूको जीवनस्तर सुधार गर्ने।"
                    : "To provide high-quality agricultural products in Nepal and improve the livelihood of farmers."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  {language === "ne" ? "हाम्रो दृष्टिकोण" : "Our Vision"}
                </h3>
                <p className="text-green-600">
                  {language === "ne"
                    ? "नेपालको अग्रणी कृषि कम्पनी बनेर खाद्य सुरक्षामा योगदान पुर्याउने।"
                    : "To become Nepal's leading agricultural company contributing to food security."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  {language === "ne" ? "हाम्रो उद्देश्य" : "Our Goals"}
                </h3>
                <p className="text-green-600">
                  {language === "ne"
                    ? "दिगो कृषि विकास, गुणस्तर सुधार र आधुनिक प्रविधिको प्रयोग।"
                    : "Sustainable agricultural development, quality improvement and modern technology adoption."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Company Videos - Two separate videos with titles */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
              {language === "ne" ? "कम्पनी भिडियोहरू" : "Company Videos"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-4">{video.title}</h3>
                    <p className="text-green-600 mb-4">{video.description}</p>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                      <iframe src={video.videoUrl} title={video.title} className="w-full h-full" allowFullScreen />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Building Locations */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
              {language === "ne" ? "हाम्रा भवनहरू" : "Our Buildings"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {buildings.map((building) => (
                <Card
                  key={building.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200"
                >
                  <div className="relative h-64">
                    <Image
                      src={building.image || "/placeholder.svg"}
                      alt={building.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-2">{building.name}</h3>
                    <div className="flex items-center text-green-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{building.address}</span>
                    </div>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <a href={building.mapLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {language === "ne" ? "नक्सामा हेर्नुहोस्" : "View on Map"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Depot Locations */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
              {language === "ne" ? "डिपो स्थानहरू" : "Depot Locations"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {depots.map((depot) => (
                <Card
                  key={depot.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200"
                >
                  <div className="relative h-48">
                    <Image src={depot.image || "/placeholder.svg"} alt={depot.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-green-800 mb-2">{depot.name}</h3>
                    <div className="flex items-center text-green-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{depot.address}</span>
                    </div>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                      <a href={depot.mapLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {language === "ne" ? "नक्सामा हेर्नुहोस्" : "View on Google Maps"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Supplier Information */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
              {language === "ne" ? "हाम्रा आपूर्तिकर्ताहरू" : "Our Suppliers"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-green-800 mb-2">{supplier.name}</h3>
                    <div className="space-y-2 text-sm text-green-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{supplier.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{supplier.contact}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="font-medium">{supplier.region}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
