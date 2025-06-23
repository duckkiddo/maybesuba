"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Send, Handshake, CheckCircle } from "lucide-react"

interface ContactSubmission {
  id: string
  type: "contact" | "dealer"
  name: string
  email: string
  phone?: string
  subject?: string
  message?: string
  company?: string
  contactPerson?: string
  businessType?: string
  location?: string
  volume?: string
  additionalInfo?: string
  submittedAt: string
  status: "new" | "read" | "replied"
}

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [isSubmittingDealer, setIsSubmittingDealer] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)
  const [dealerSuccess, setDealerSuccess] = useState(false)
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

    const element = document.getElementById("contact")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  const saveSubmission = (submission: ContactSubmission) => {
    try {
      const existingSubmissions = JSON.parse(localStorage.getItem("mailSubmissions") || "[]")
      const newSubmissions = [submission, ...existingSubmissions]
      localStorage.setItem("mailSubmissions", JSON.stringify(newSubmissions))
      window.dispatchEvent(new CustomEvent("mailSubmissionsUpdated"))
    } catch (error) {
      console.error("Error saving submission:", error)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingContact(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const submission: ContactSubmission = {
      id: Date.now().toString(),
      type: "contact",
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      submittedAt: new Date().toISOString(),
      status: "new",
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    saveSubmission(submission)
    setIsSubmittingContact(false)
    setContactSuccess(true)

    form.reset()

    setTimeout(() => setContactSuccess(false), 5000)
  }

  const handleDealerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingDealer(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const submission: ContactSubmission = {
      id: Date.now().toString(),
      type: "dealer",
      name: formData.get("contact_person") as string,
      email: formData.get("dealer_email") as string,
      phone: formData.get("dealer_phone") as string,
      company: formData.get("company") as string,
      contactPerson: formData.get("contact_person") as string,
      businessType: formData.get("business_type") as string,
      location: formData.get("location") as string,
      additionalInfo: formData.get("additional_info") as string,
      submittedAt: new Date().toISOString(),
      status: "new",
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    saveSubmission(submission)
    setIsSubmittingDealer(false)
    setDealerSuccess(true)

    form.reset()

    setTimeout(() => setDealerSuccess(false), 5000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      content: "Bhaktapur Industrial Area\nKathmandu, Bagmati Province\nNepal",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      content: "Sales: +977-1-4567890\nSupport: +977-1-4567891\nToll Free: 1660-01-23456",
    },
    {
      icon: Mail,
      title: "Email Addresses",
      content: "info@vagro-agro.com.np\nsales@vagro-agro.com.np\nsupport@vagro-agro.com.np",
    },
  ]

  return (
    <section id="contact" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">
            {language === "ne" ? "सम्पर्क गर्नुहोस्" : "Contact Us"}
          </h2>
          <p className="text-xl text-green-700">
            {language === "ne"
              ? "हामीसँग सम्पर्क गर्नुहोस् र हाम्रो सेवाहरूको बारेमा जान्नुहोस्।"
              : "Get in touch with us and learn about our services."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card
            className={`transition-all duration-1000 border-green-200 ${isVisible ? "slide-in-left visible" : "slide-in-left"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Mail className="w-5 h-5 text-green-600 mr-2" />
                {language === "ne" ? "हामीलाई सम्पर्क गर्नुहोस्" : "Contact Us"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    {language === "ne" ? "सन्देश सफलतापूर्वक पठाइयो!" : "Message Sent Successfully!"}
                  </h3>
                  <p className="text-green-600">
                    {language === "ne"
                      ? "हामीलाई सम्पर्क गर्नुभएकोमा धन्यवाद। हामी २४ घण्टा भित्र तपाईंलाई सम्पर्क गर्नेछौं।"
                      : "Thank you for contacting us. We'll get back to you within 24 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-green-700">
                      {language === "ne" ? "नाम" : "Name"} *
                    </Label>
                    <Input id="name" name="name" required className="border-green-200 focus:border-green-300" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-700">
                      {language === "ne" ? "इमेल" : "Email"} *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="border-green-200 focus:border-green-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-green-700">
                      {language === "ne" ? "फोन" : "Phone"}
                    </Label>
                    <Input id="phone" name="phone" type="tel" className="border-green-200 focus:border-green-300" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-green-700">
                      {language === "ne" ? "विषय" : "Subject"}
                    </Label>
                    <Select name="subject">
                      <SelectTrigger className="border-green-200 focus:border-green-300">
                        <SelectValue placeholder={language === "ne" ? "विषय छान्नुहोस्" : "Select Subject"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          {language === "ne" ? "सामान्य सोधपुछ" : "General Inquiry"}
                        </SelectItem>
                        <SelectItem value="products">
                          {language === "ne" ? "उत्पादन जानकारी" : "Product Information"}
                        </SelectItem>
                        <SelectItem value="pricing">
                          {language === "ne" ? "मूल्य र कोटेशन" : "Pricing & Quotes"}
                        </SelectItem>
                        <SelectItem value="support">
                          {language === "ne" ? "ग्राहक सहायता" : "Customer Support"}
                        </SelectItem>
                        <SelectItem value="complaint">{language === "ne" ? "गुनासो" : "Complaint"}</SelectItem>
                        <SelectItem value="feedback">{language === "ne" ? "प्रतिक्रिया" : "Feedback"}</SelectItem>
                        <SelectItem value="careers">
                          {language === "ne" ? "टिममा सामेल हुनुहोस्" : "Join the Team"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-green-700">
                      {language === "ne" ? "सन्देश" : "Message"} *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      className="border-green-200 focus:border-green-300"
                      placeholder={
                        language === "ne"
                          ? "आफ्नो आवश्यकताहरूको बारेमा हामीलाई बताउनुहोस्..."
                          : "Tell us about your requirements..."
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmittingContact}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmittingContact
                      ? language === "ne"
                        ? "पठाउँदै..."
                        : "Sending..."
                      : language === "ne"
                        ? "पठाउनुहोस्"
                        : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Dealer/Partner Form */}
          <Card
            className={`transition-all duration-1000 border-green-200 ${isVisible ? "slide-in-right visible" : "slide-in-right"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Handshake className="w-5 h-5 text-green-600 mr-2" />
                {language === "ne" ? "डिलर/पार्टनर बन्नुहोस्" : "Become a Dealer/Partner"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dealerSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    {language === "ne" ? "आवेदन पेश गरियो!" : "Application Submitted!"}
                  </h3>
                  <p className="text-green-600">
                    {language === "ne"
                      ? "हाम्रो पार्टनर बन्न चाहनुभएकोमा धन्यवाद। हाम्रो टिमले तपाईंको आवेदन समीक्षा गरेर चाँडै सम्पर्क गर्नेछ।"
                      : "Thank you for your interest in becoming our partner. Our team will review your application and contact you soon."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-green-700">
                      {language === "ne" ? "कम्पनी/व्यवसायको नाम *" : "Company/Business Name *"}
                    </Label>
                    <Input id="company" name="company" required className="border-green-200 focus:border-green-300" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_person" className="text-green-700">
                      {language === "ne" ? "सम्पर्क व्यक्ति *" : "Contact Person *"}
                    </Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      required
                      className="border-green-200 focus:border-green-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dealer_email" className="text-green-700">
                      {language === "ne" ? "इमेल ठेगाना *" : "Email Address *"}
                    </Label>
                    <Input
                      id="dealer_email"
                      name="dealer_email"
                      type="email"
                      required
                      className="border-green-200 focus:border-green-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dealer_phone" className="text-green-700">
                      {language === "ne" ? "फोन नम्बर *" : "Phone Number *"}
                    </Label>
                    <Input
                      id="dealer_phone"
                      name="dealer_phone"
                      type="tel"
                      required
                      className="border-green-200 focus:border-green-300"
                      placeholder={language === "ne" ? "+९७७-९८XXXXXXXX" : "+977-98XXXXXXXX"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_type" className="text-green-700">
                      {language === "ne" ? "व्यवसायको प्रकार *" : "Business Type *"}
                    </Label>
                    <Select name="business_type" required>
                      <SelectTrigger className="border-green-200 focus:border-green-300">
                        <SelectValue
                          placeholder={language === "ne" ? "व्यवसायको प्रकार छान्नुहोस्" : "Select Business Type"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retailer">{language === "ne" ? "खुद्रा विक्रेता" : "Retailer"}</SelectItem>
                        <SelectItem value="wholesaler">{language === "ne" ? "थोक विक्रेता" : "Wholesaler"}</SelectItem>
                        <SelectItem value="distributor">{language === "ne" ? "वितरक" : "Distributor"}</SelectItem>
                        <SelectItem value="restaurant">
                          {language === "ne" ? "रेस्टुरेन्ट/होटल" : "Restaurant/Hotel"}
                        </SelectItem>
                        <SelectItem value="supermarket">
                          {language === "ne" ? "सुपरमार्केट चेन" : "Supermarket Chain"}
                        </SelectItem>
                        <SelectItem value="grocery">{language === "ne" ? "किराना पसल" : "Grocery Store"}</SelectItem>
                        <SelectItem value="export">
                          {language === "ne" ? "निर्यात व्यवसाय" : "Export Business"}
                        </SelectItem>
                        <SelectItem value="other">{language === "ne" ? "अन्य" : "Other"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-green-700">
                      {language === "ne" ? "स्थान/क्षेत्र *" : "Location/Area *"}
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      required
                      className="border-green-200 focus:border-green-300"
                      placeholder={language === "ne" ? "जिल्ला, प्रदेश" : "District, Province"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional_info" className="text-green-700">
                      {language === "ne" ? "अतिरिक्त जानकारी" : "Additional Information"}
                    </Label>
                    <Textarea
                      id="additional_info"
                      name="additional_info"
                      rows={3}
                      className="border-green-200 focus:border-green-300"
                      placeholder={
                        language === "ne"
                          ? "आफ्नो व्यवसायको आवश्यकता, अनुभव, लक्षित बजार आदिको बारेमा हामीलाई बताउनुहोस्..."
                          : "Tell us about your business requirements, experience, target market, etc..."
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmittingDealer}
                  >
                    <Handshake className="w-4 h-4 mr-2" />
                    {isSubmittingDealer
                      ? language === "ne"
                        ? "पेश गर्दै..."
                        : "Submitting..."
                      : language === "ne"
                        ? "आवेदन पेश गर्नुहोस्"
                        : "Submit Application"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className={`text-center transition-all duration-1000 hover:shadow-lg hover:-translate-y-2 border-green-200 ${
                isVisible ? "fade-in visible" : "fade-in"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2 text-green-800">{info.title}</h4>
                <p className="text-green-700 whitespace-pre-line">{info.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
