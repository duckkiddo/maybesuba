"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, Package, Leaf, Apple, Egg, Eye, X } from "lucide-react"
import { ProductForm } from "./forms/ProductForm"
import type { Product } from "@/types/admin"
import initialProducts from "@/data/products.json"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } else {
        setProducts(initialProducts)
        localStorage.setItem("products", JSON.stringify(initialProducts))
      }
    }

    loadProducts()
  }, [])

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Subcategory filter
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((product) => product.subcategory === selectedSubcategory)
    }

    // Stock filter
    if (stockFilter !== "all") {
      filtered = filtered.filter((product) => (stockFilter === "in-stock" ? product.inStock : !product.inStock))
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, selectedSubcategory, stockFilter])

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("productsUpdated"))
  }

  const handleAddProduct = () => {
    setSelectedProduct(undefined)
    setIsFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = products.filter((p) => p.id !== productToDelete.id)
      saveProducts(updatedProducts)
      setIsDeleteDialogOpen(false)
      setProductToDelete(undefined)
    }
  }

  const handleSaveProduct = (productData: Omit<Product, "id"> & { id?: string }) => {
    if (selectedProduct) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? { ...productData, id: selectedProduct.id } : p,
      )
      saveProducts(updatedProducts)
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: productData.id || Date.now().toString(),
      }
      saveProducts([...products, newProduct])
    }
    setIsFormOpen(false)
    setSelectedProduct(undefined)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedProduct(undefined)
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
        return Package
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

  const getCategoryDisplayName = (category: string) => {
    const categoryMapping: { [key: string]: string } = {
      "manasuli-premium-rice": "Manasuli Premium Rice",
      "surayadaya-premium-rice": "Surayadaya Premium Rice",
      "local-chamal": "Local Chamal",
      bhus: "Bhus",
      kanika: "Kanika",
    }
    return categoryMapping[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  const getSubcategoryDisplayName = (subcategory: string) => {
    const subcategoryMapping: { [key: string]: string } = {
      "sona-monsuli": "Sona Monsuli",
      katarni: "Katarni",
      "jeera-masina": "Jeera Masina",
    }
    return subcategoryMapping[subcategory] || subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
  }

  // Get unique categories and subcategories
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const subcategories = Array.from(new Set(products.filter((p) => p.subcategory).map((p) => p.subcategory!)))

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedSubcategory("all")
    setStockFilter("all")
  }

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedSubcategory !== "all" || stockFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-green-800">Product Management</h2>
          <p className="text-green-600">Manage your product catalog</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
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

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {getSubcategoryDisplayName(subcategory)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="text-green-600 border-green-600">
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const ProductIcon = getProductIcon(product.category)
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              {product.image ? (
                <div className="h-48 relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.className = `h-48 bg-gradient-to-br ${getProductGradient(product.category)} flex items-center justify-center relative`
                        parent.innerHTML = `
                          <div class="text-primary">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                            </svg>
                          </div>
                        `
                      }
                    }}
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              ) : (
                <div
                  className={`h-48 bg-gradient-to-br ${getProductGradient(product.category)} flex items-center justify-center relative`}
                >
                  <ProductIcon className="w-12 h-12 text-primary" />
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-green-800 line-clamp-1">{product.name}</h3>
                <p className="text-green-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-green-800">{product.price}</span>
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProduct(product)}
                    className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product)}
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? "No products match your search criteria. Try adjusting your filters."
                : "No products have been added yet. Click 'Add Product' to get started."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Form Dialog */}
      {isFormOpen && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" title={selectedProduct ? "Edit Product" : "Add Product"}>
            <ProductForm product={selectedProduct} onSave={handleSaveProduct} onCancel={handleCloseForm} />
          </DialogContent>
        </Dialog>
      )}

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-800">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
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
                      return <ProductIcon className="w-24 h-24 text-primary" />
                    })()}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Category</h4>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {getCategoryDisplayName(selectedProduct.category)}
                    </Badge>
                  </div>
                  {selectedProduct.subcategory && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Subcategory</h4>
                      <Badge variant="secondary">{getSubcategoryDisplayName(selectedProduct.subcategory)}</Badge>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Price</h4>
                    <span className="text-2xl font-bold text-green-800">{selectedProduct.price}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Stock Status</h4>
                    <Badge variant={selectedProduct.inStock ? "default" : "secondary"}>
                      {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-green-600 leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
