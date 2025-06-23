"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Leaf, Egg, Apple, Check, MessageCircle, ArrowRight } from "lucide-react"
import initialProducts from "@/data/products.json"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  image?: string
  inStock: boolean
  whatsappPhone?: string
}

export function ProductsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
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

    const element = document.getElementById("products")
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("products")
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts)
          setProducts(parsedProducts)
        } else {
          setProducts(initialProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts(initialProducts)
      }
    }

    loadProducts()

    const handleStorageChange = () => {
      loadProducts()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("productsUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("productsUpdated", handleStorageChange)
    }
  }, [])

  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openWhatsApp = (product: Product) => {
    const message = `Hello! I'm interested in ${product.name}. Price: ${product.price}. Could you please provide more details?`
    const phoneNumber = product.whatsappPhone || "9779841234567"
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  const getProductIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "rice":
        return Leaf
      case "eggs":
        return Egg
      default:
        return Apple
    }
  }

  const getProductGradient = (category: string) => {
    return "from-green-200 to-green-400 dark:from-green-600 dark:to-green-800"
  }

  const getIconColor = (category: string) => {
    return "text-green-800 dark:text-green-200"
  }

  // Only show top 3 products on homepage
  const displayProducts = products.slice(0, 3)

  return (
    <section id="products" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in visible" : "fade-in"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">
            {language === "ne" ? "हाम्रा उत्पादनहरू" : "Our Products"}
          </h2>
          <p className="text-xl text-green-700">
            {language === "ne"
              ? "हाम्रो उच्च गुणस्तरको कृषि उत्पादनहरूको श्रृंखला पत्ता लगाउनुहोस्।"
              : "Discover our range of premium quality agricultural products."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => {
            const ProductIcon = getProductIcon(product.category)
            return (
              <Card
                key={product.id}
                className={`overflow-hidden transition-all duration-1000 hover:shadow-lg hover:-translate-y-2 border-green-200 ${
                  isVisible ? "slide-in-left visible" : "slide-in-left"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {product.image ? (
                  <div className="h-64 relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                ) : (
                  <div
                    className={`h-64 bg-gradient-to-br ${getProductGradient(product.category)} flex items-center justify-center relative`}
                  >
                    <ProductIcon className={`w-16 h-16 ${getIconColor(product.category)}`} />
                    <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-green-800">{product.name}</h3>
                  <p className="text-green-700 mb-4 leading-relaxed line-clamp-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => openWhatsApp(product)}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-green-700 border-green-300 hover:bg-green-50"
                      onClick={() => openProductDetails(product)}
                    >
                      {language === "ne" ? "थप जान्नुहोस्" : "Learn More"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
            <Link href="/products">
              {language === "ne" ? "सबै उत्पादनहरू हेर्नुहोस्" : "Show All Products"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold mb-2 text-green-800">No Products Available</h3>
            <p className="text-green-700">Products will appear here once they are added by the admin.</p>
          </div>
        )}
      </div>

      {/* Product Details Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-800">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="aspect-video rounded-lg overflow-hidden">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getProductGradient(selectedProduct.category)} flex items-center justify-center`}
                  >
                    {(() => {
                      const ProductIcon = getProductIcon(selectedProduct.category)
                      return <ProductIcon className={`w-24 h-24 ${getIconColor(selectedProduct.category)}`} />
                    })()}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-green-800">Product Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Category:</span>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {selectedProduct.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Price:</span>
                      <span className="text-xl font-bold text-green-600">{selectedProduct.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">Availability:</span>
                      <Badge
                        variant={selectedProduct.inStock ? "default" : "secondary"}
                        className={selectedProduct.inStock ? "bg-green-600" : "bg-gray-500"}
                      >
                        {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4 text-green-800">Description</h3>
                  <p className="text-green-700 leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-800">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Premium Quality</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Fresh & Natural</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Quality Assured</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Fast Delivery</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => openWhatsApp(selectedProduct)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Inquiry
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-green-700 border-green-300 hover:bg-green-50"
                  onClick={scrollToContact}
                >
                  Contact Seller
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
