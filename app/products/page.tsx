"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Leaf, Egg, Apple, Check, MessageCircle, Filter, ArrowLeft, Search, X } from "lucide-react"
import initialProducts from "@/data/products.json"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  subcategory?: string
  image?: string
  inStock: boolean
  whatsappPhone?: string
}

export default function ProductsPage() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState<string>("all")

  // Get category and subcategory from URL params
  const urlCategory = searchParams.get("category")
  const urlSubcategory = searchParams.get("subcategory")

  useEffect(() => {
    // Set initial filters from URL params
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
    if (urlSubcategory) {
      setSelectedSubcategory(urlSubcategory)
    }
  }, [urlCategory, urlSubcategory])

  useEffect(() => {
    // Load products from localStorage and merge with initial data
    const loadProducts = () => {
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } else {
        setProducts(initialProducts)
      }
    }

    loadProducts()

    // Listen for storage changes to update products in real-time
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

  // Filter products based on all criteria
  useEffect(() => {
    let filtered = products

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Subcategory filter
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((p) => p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase())
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Stock filter
    if (stockFilter !== "all") {
      filtered = filtered.filter((p) => (stockFilter === "in-stock" ? p.inStock : !p.inStock))
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedSubcategory, searchTerm, stockFilter])

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
      case "manasuli-premium-rice":
      case "surayadaya-premium-rice":
      case "local-chamal":
        return Leaf
      case "bhus":
        return Apple
      case "kanika":
        return Egg
      default:
        return Apple
    }
  }

  const getProductGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case "manasuli-premium-rice":
        return "from-green-200 to-green-400"
      case "surayadaya-premium-rice":
        return "from-blue-200 to-blue-400"
      case "local-chamal":
        return "from-yellow-200 to-yellow-400"
      case "bhus":
        return "from-orange-200 to-orange-400"
      case "kanika":
        return "from-purple-200 to-purple-400"
      default:
        return "from-gray-200 to-gray-400"
    }
  }

  const getIconColor = (category: string) => {
    return "text-primary"
  }

  // Create categories and subcategories arrays
  const categoryMapping = {
    "manasuli-premium-rice": language === "ne" ? "मनसुली प्रिमियम चामल" : "Manasuli Premium Rice",
    "surayadaya-premium-rice": language === "ne" ? "सूर्योदय प्रिमियम चामल" : "Surayadaya Premium Rice",
    "local-chamal": language === "ne" ? "स्थानीय चामल" : "Local Chamal",
    bhus: language === "ne" ? "भुस" : "Bhus",
    kanika: language === "ne" ? "कणिका" : "Kanika",
  }

  const subcategoryMapping = {
    "sona-monsuli": language === "ne" ? "सोना मनसुली" : "Sona Monsuli",
    katarni: language === "ne" ? "कतर्नी" : "Katarni",
    "jeera-masina": language === "ne" ? "जीरा मसिना" : "Jeera Masina",
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const subcategories = [
    "all",
    ...Array.from(new Set(products.filter((p) => p.subcategory).map((p) => p.subcategory!))),
  ]

  const getCategoryDisplayName = (category: string) => {
    return (
      categoryMapping[category as keyof typeof categoryMapping] || category.charAt(0).toUpperCase() + category.slice(1)
    )
  }

  const getSubcategoryDisplayName = (subcategory: string) => {
    return (
      subcategoryMapping[subcategory as keyof typeof subcategoryMapping] ||
      subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
    )
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedSubcategory("all")
    setSearchTerm("")
    setStockFilter("all")
  }

  const hasActiveFilters =
    selectedCategory !== "all" || selectedSubcategory !== "all" || searchTerm || stockFilter !== "all"

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
                {urlCategory && urlCategory !== "all"
                  ? getCategoryDisplayName(urlCategory)
                  : language === "ne"
                    ? "सबै उत्पादनहरू"
                    : "All Products"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {urlSubcategory
                  ? `${getCategoryDisplayName(urlCategory || "")} - ${getSubcategoryDisplayName(urlSubcategory)}`
                  : language === "ne"
                    ? "हाम्रा सबै उत्पादनहरू एकै ठाउँमा"
                    : "All our products in one place"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={language === "ne" ? "उत्पादन खोज्नुहोस्..." : "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">{language === "ne" ? "फिल्टर" : "Filters"}</h3>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={language === "ne" ? "श्रेणी छान्नुहोस्" : "Select Category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "ne" ? "सबै श्रेणी" : "All Categories"}</SelectItem>
                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Subcategory Filter */}
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={language === "ne" ? "उप-श्रेणी छान्नुहोस्" : "Select Subcategory"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "ne" ? "सबै उप-श्रेणी" : "All Subcategories"}</SelectItem>
                  {subcategories
                    .filter((sub) => sub !== "all")
                    .map((subcategory) => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {getSubcategoryDisplayName(subcategory)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Stock Filter */}
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={language === "ne" ? "स्टक" : "Stock"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "ne" ? "सबै" : "All"}</SelectItem>
                  <SelectItem value="in-stock">{language === "ne" ? "उपलब्ध" : "In Stock"}</SelectItem>
                  <SelectItem value="out-of-stock">{language === "ne" ? "स्टकमा छैन" : "Out of Stock"}</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  {language === "ne" ? "फिल्टर हटाउनुहोस्" : "Clear Filters"}
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getCategoryDisplayName(selectedCategory)}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                  </Badge>
                )}
                {selectedSubcategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getSubcategoryDisplayName(selectedSubcategory)}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSubcategory("all")} />
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {stockFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {stockFilter === "in-stock"
                      ? language === "ne"
                        ? "उपलब्ध"
                        : "In Stock"
                      : language === "ne"
                        ? "स्टकमा छैन"
                        : "Out of Stock"}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setStockFilter("all")} />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {language === "ne"
                ? `${filteredProducts.length} उत्पादनहरू फेला परे`
                : `${filteredProducts.length} products found`}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const ProductIcon = getProductIcon(product.category)
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-green-200"
                >
                  {product.image ? (
                    <div className="h-64 relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.className = `h-64 bg-gradient-to-br ${getProductGradient(product.category)} flex items-center justify-center relative`
                            parent.innerHTML = `
                              <div class="${getIconColor(product.category)}">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                                </svg>
                              </div>
                            `
                          }
                        }}
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
                    <h3 className="text-xl font-bold mb-3 text-green-800">{product.name}</h3>
                    <p className="text-green-600 mb-4 leading-relaxed line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-green-800">{product.price}</span>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                          {getCategoryDisplayName(product.category)}
                        </Badge>
                        {product.subcategory && (
                          <Badge variant="secondary" className="text-xs">
                            {getSubcategoryDisplayName(product.subcategory)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => openWhatsApp(product)}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => openProductDetails(product)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-2 text-green-800">
                {language === "ne" ? "कुनै उत्पादन फेला परेन" : "No Products Found"}
              </h3>
              <p className="text-green-600 mb-4">
                {hasActiveFilters
                  ? language === "ne"
                    ? "तपाईंको खोजी मापदण्ड अनुसार कुनै उत्पादन फेला परेन।"
                    : "No products match your search criteria."
                  : language === "ne"
                    ? "उत्पादनहरू एडमिनले थपेपछि यहाँ देखिनेछन्।"
                    : "Products will appear here once they are added by the admin."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} className="bg-green-600 hover:bg-green-700">
                  {language === "ne" ? "सबै फिल्टर हटाउनुहोस्" : "Clear All Filters"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-800">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Image */}
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

              {/* Product Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-green-800">Product Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Category:</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {getCategoryDisplayName(selectedProduct.category)}
                      </Badge>
                    </div>
                    {selectedProduct.subcategory && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Type:</span>
                        <Badge variant="secondary" className="text-xs">
                          {getSubcategoryDisplayName(selectedProduct.subcategory)}
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="text-xl font-bold text-green-800">{selectedProduct.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Availability:</span>
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
                  <p className="text-green-600 leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-800">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-600">Premium Quality</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-600">Fresh & Natural</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-600">Quality Assured</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-600">Fast Delivery</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer/>
    </div>
  )
}
