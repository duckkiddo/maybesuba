"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { COMPANY_CONFIG } from "@/lib/constants"

export function Footer() {
  const [language, setLanguage] = useState<"en" | "ne">("en")
  const currentYear = new Date().getFullYear()

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

  const quickLinks = [
    { href: "#home", label: language === "ne" ? "गृहपृष्ठ" : "Home" },
    { href: "/about", label: language === "ne" ? "हाम्रो बारेमा" : "About Us" },
    { href: "#products", label: language === "ne" ? "उत्पादनहरू" : "Products" },
    { href: "/rice", label: "Rice Varieties" },
    { href: "#factories", label: language === "ne" ? "कारखानाहरू" : "Factories" },
    { href: "/documents", label: language === "ne" ? "कागजातहरू" : "Documents" },
    { href: "/gallery", label: "Gallery" },
    { href: "/videos", label: "Videos" },
    { href: "/team", label: "Team" },
    { href: "#contact", label: language === "ne" ? "सम्पर्क" : "Contact" },
  ]

  const products = [
    { href: "/rice", label: "Premium Rice" },
    { href: "#products", label: "Fresh Eggs" },
    { href: "#products", label: "Organic Products" },
    { href: "#contact", label: "Bulk Orders" },
    { href: "#contact", label: "Custom Packaging" },
    { href: "#contact", label: "Dealer Program" },
  ]

  const socialLinks = [
    { icon: Facebook, href: COMPANY_CONFIG.social.facebook || "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Twitter, href: COMPANY_CONFIG.social.twitter || "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: Instagram, href: COMPANY_CONFIG.social.instagram || "#", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Linkedin, href: COMPANY_CONFIG.social.linkedin || "#", label: "LinkedIn", color: "hover:text-blue-700" },
    { icon: Youtube, href: COMPANY_CONFIG.social.youtube || "#", label: "YouTube", color: "hover:text-red-600" },
  ]

  return (
    <footer className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative w-12 h-12 mr-3">
                <Image
                  src={COMPANY_CONFIG.logo.main || "/placeholder.svg"}
                  alt={`${COMPANY_CONFIG.name.en} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold leading-tight">
                  {language === "ne" ? COMPANY_CONFIG.name.ne : COMPANY_CONFIG.name.en}
                </span>
                <div className="text-xs text-green-200 font-medium">
                  {language === "ne" ? COMPANY_CONFIG.tagline.ne : COMPANY_CONFIG.tagline.en}
                </div>
              </div>
            </div>
            <p className="text-green-100 mb-6 leading-relaxed text-sm">
              {language === "ne"
                ? "वार्गो-एग्रो इन्डस्ट्रिज (प्रा).लि. नेपालको अग्रणी कृषि कम्पनी हो जसले उच्च गुणस्तरको चामल र अन्य कृषि उत्पादनहरू प्रदान गर्दछ।"
                : "Vargo Agro Industries (P).Ltd is Nepal's leading agricultural company providing premium quality rice and other agricultural products."}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className={`p-2 bg-green-600/30 rounded-full text-green-200 ${social.color} transition-all duration-300 hover:bg-green-600/50 hover:scale-110`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-200 border-b border-green-600 pb-2">
              {language === "ne" ? "द्रुत लिङ्कहरू" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-green-100 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products & Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-200 border-b border-green-600 pb-2">
              {language === "ne" ? "उत्पादन र सेवाहरू" : "Products & Services"}
            </h4>
            <ul className="space-y-3">
              {products.map((product, index) => (
                <li key={index}>
                  <Link
                    href={product.href}
                    className="text-green-100 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {product.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-green-200 border-b border-green-600 pb-2">
              {language === "ne" ? "सम्पर्क जानकारी" : "Contact Info"}
            </h4>
            <div className="space-y-4 text-green-100">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 text-green-300 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">{COMPANY_CONFIG.contact.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-300 flex-shrink-0" />
                <div className="text-sm">
                  <p>{COMPANY_CONFIG.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-300 flex-shrink-0" />
                <div className="text-sm">
                  <p>{COMPANY_CONFIG.contact.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-green-300 flex-shrink-0" />
                <div className="text-sm">
                  <p>{COMPANY_CONFIG.contact.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-green-200 text-sm">
                &copy; {currentYear} {language === "ne" ? COMPANY_CONFIG.name.ne : COMPANY_CONFIG.name.en}.{" "}
                {language === "ne" ? "सर्वाधिकार सुरक्षित" : "All Rights Reserved"}
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-green-200 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="#" className="text-green-200 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="#" className="text-green-200 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
