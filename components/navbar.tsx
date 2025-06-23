"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Menu, X, Globe, ChevronDown, ChevronRight } from "lucide-react"
import { COMPANY_CONFIG } from "@/lib/constants"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ne" : "en"
    setLanguage(newLanguage)
    try {
      localStorage.setItem("language", newLanguage)
      window.dispatchEvent(new Event("storage"))
      window.dispatchEvent(new Event("languageChanged"))
    } catch (error) {
      console.warn("Could not save language to localStorage:", error)
    }
  }

  const navItems = [
    { href: "/", label: language === "ne" ? "गृहपृष्ठ" : "Home" },
    { href: "/about", label: language === "ne" ? "हाम्रो बारेमा" : "About Us" },
    { href: "/team", label: language === "ne" ? "हाम्रो टिम" : "Our Team" },
    { href: "/activities", label: language === "ne" ? "कृषि गतिविधिहरू" : "Agricultural Activities" },
    { href: "/gallery", label: language === "ne" ? "ग्यालेरी" : "Gallery" },
    { href: "/videos", label: language === "ne" ? "भिडियोहरू" : "Videos" },
    { href: "/documents", label: language === "ne" ? "कागजातहरू" : "Documents" },
  ]

  const productCategories = [
    {
      name: language === "ne" ? "मनसुली प्रिमियम चामल" : "Manasuli Premium Rice",
      href: "/products?category=manasuli-premium-rice",
      subcategories: [
        {
          name: language === "ne" ? "सोना मनसुली" : "Sona Monsuli",
          href: "/products?category=manasuli-premium-rice&subcategory=sona-monsuli",
        },
        {
          name: language === "ne" ? "कतर्नी" : "Katarni",
          href: "/products?category=manasuli-premium-rice&subcategory=katarni",
        },
        {
          name: language === "ne" ? "जीरा मसिना" : "Jeera Masina",
          href: "/products?category=manasuli-premium-rice&subcategory=jeera-masina",
        },
      ],
    },
    {
      name: language === "ne" ? "सूर्योदय प्रिमियम चामल" : "Surayadaya Premium Rice",
      href: "/products?category=surayadaya-premium-rice",
      subcategories: [
        {
          name: language === "ne" ? "सोना मनसुली" : "Sona Monsuli",
          href: "/products?category=surayadaya-premium-rice&subcategory=sona-monsuli",
        },
        {
          name: language === "ne" ? "कतर्नी" : "Katarni",
          href: "/products?category=surayadaya-premium-rice&subcategory=katarni",
        },
        {
          name: language === "ne" ? "जीरा मसिना" : "Jeera Masina",
          href: "/products?category=surayadaya-premium-rice&subcategory=jeera-masina",
        },
      ],
    },
    {
      name: language === "ne" ? "स��थानीय चामल" : "Local Chamal",
      href: "/products?category=local-chamal",
      subcategories: [],
    },
    {
      name: language === "ne" ? "भुस" : "Bhus",
      href: "/products?category=bhus",
      subcategories: [],
    },
    {
      name: language === "ne" ? "कणिका" : "Kanika",
      href: "/products?category=kanika",
      subcategories: [],
    },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={COMPANY_CONFIG.logo.main || "/placeholder.svg"}
                alt={`${language === "ne" ? COMPANY_CONFIG.name.ne : COMPANY_CONFIG.name.en} Logo`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-green-800 leading-tight">
                {language === "ne" ? COMPANY_CONFIG.name.ne : COMPANY_CONFIG.name.en}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {language === "en" ? COMPANY_CONFIG.tagline.en : COMPANY_CONFIG.tagline.ne}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-green-50 group"
                >
                  {language === "ne" ? "उत्पादनहरू" : "Products"}
                  <ChevronDown className="h-3 w-3 ml-1" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2">
                <DropdownMenuItem asChild>
                  <Link href="/products" className="w-full font-medium text-green-800 hover:bg-green-50 px-3 py-2">
                    {language === "ne" ? "सबै उत्पादनहरू" : "All Products"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {productCategories.map((category, index) => (
                  <div key={index} className="py-1">
                    <DropdownMenuItem asChild>
                      <Link href={category.href} className="w-full hover:bg-green-50 px-3 py-2 font-medium">
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                    {category.subcategories.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <DropdownMenuItem key={subIndex} asChild>
                            <Link
                              href={subcategory.href}
                              className="w-full text-sm text-gray-600 hover:bg-green-50 px-3 py-1 flex items-center"
                            >
                              <ChevronRight className="w-3 h-3 mr-2" />
                              {subcategory.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                    {index < productCategories.length - 1 && <DropdownMenuSeparator className="my-2" />}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline text-sm">{language === "en" ? "EN" : "नेपाली"}</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={() => toggleLanguage()}>
                  {language === "en" ? "🇳🇵 नेपाली" : "🇺🇸 English"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="xl:hidden text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`xl:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-green-100">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Products Section */}
              <div className="px-4 py-3">
                <div className="text-sm font-medium text-gray-700 mb-3 border-b border-green-100 pb-2">
                  {language === "ne" ? "उत्पादनहरू" : "Products"}
                </div>
                <Link
                  href="/products"
                  className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg mb-2 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === "ne" ? "सबै उत्पादनहरू" : "All Products"}
                </Link>

                {productCategories.map((category, index) => (
                  <div key={index} className="mb-3">
                    <Link
                      href={category.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1">
                        {category.subcategories.map((subcategory, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subcategory.href}
                            className="block px-4 py-1 text-xs text-gray-500 hover:bg-green-50 rounded-lg flex items-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ChevronRight className="w-3 h-3 mr-1" />
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
