"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, ImageIcon } from "lucide-react"
import type { Product } from "@/types/admin"
import { useFileUpload } from "@/hooks/useFileUpload"

interface ProductFormProps {
  product?: Product
  onSave: (product: Omit<Product, "id"> & { id?: string }) => void
  onCancel: () => void
}

const productCategories = [
  {
    value: "manasuli-premium-rice",
    label: "Manasuli Premium Rice",
    subcategories: [
      { value: "sona-monsuli", label: "Sona Monsuli" },
      { value: "katarni", label: "Katarni" },
      { value: "jeera-masina", label: "Jeera Masina" },
    ],
  },
  {
    value: "surayadaya-premium-rice",
    label: "Surayadaya Premium Rice",
    subcategories: [
      { value: "sona-monsuli", label: "Sona Monsuli" },
      { value: "katarni", label: "Katarni" },
      { value: "jeera-masina", label: "Jeera Masina" },
    ],
  },
  {
    value: "local-chamal",
    label: "Local Chamal",
    subcategories: [],
  },
  {
    value: "bhus",
    label: "Bhus",
    subcategories: [],
  },
  {
    value: "kanika",
    label: "Kanika",
    subcategories: [],
  },
]

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    inStock: true,
    whatsappPhone: "",
    image: "",
  })

  const [selectedCategory, setSelectedCategory] = useState("")
  const [availableSubcategories, setAvailableSubcategories] = useState<{ value: string; label: string }[]>([])
  const { handleImageUpload: uploadImage, uploadingImage } = useFileUpload()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory || "",
        inStock: product.inStock,
        whatsappPhone: product.whatsappPhone || "",
        image: product.image || "",
      })
      setSelectedCategory(product.category)

      // Set available subcategories based on the product's category
      const categoryData = productCategories.find((cat) => cat.value === product.category)
      if (categoryData) {
        setAvailableSubcategories(categoryData.subcategories)
      }
    }
  }, [product])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setFormData((prev) => ({ ...prev, category, subcategory: "" }))

    const categoryData = productCategories.find((cat) => cat.value === category)
    setAvailableSubcategories(categoryData?.subcategories || [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...formData,
      id: product?.id,
    }

    // Remove subcategory if it's empty
    if (!productData.subcategory) {
      delete (productData as any).subcategory
    }

    onSave(productData)
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-green-800">{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="e.g., Rs. 120/kg"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Selection */}
          {availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No subcategory</SelectItem>
                  {availableSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* WhatsApp Phone */}
          <div className="space-y-2">
            <Label htmlFor="whatsappPhone">WhatsApp Phone</Label>
            <Input
              id="whatsappPhone"
              value={formData.whatsappPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsappPhone: e.target.value }))}
              placeholder="+977-9812345678"
            />
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, inStock: checked }))}
            />
            <Label htmlFor="inStock">In Stock</Label>
            <Badge variant={formData.inStock ? "default" : "secondary"} className="ml-2">
              {formData.inStock ? "Available" : "Out of Stock"}
            </Badge>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-sm text-gray-600">Click to upload image</span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (!file) return

                        try {
                          uploadImage(file).then((imageUrl) => {
                            setFormData((prev) => ({ ...prev, image: imageUrl }))
                          })
                        } catch (error) {
                          console.error("Error uploading image:", error)
                          // You could add a toast notification here if needed
                        }
                      }}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            )}
            {uploadingImage && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Upload className="h-4 w-4 animate-spin" />
                <span>Uploading image...</span>
              </div>
            )}
          </div>

          {/* Category and Subcategory Preview */}
          {selectedCategory && (
            <div className="space-y-2">
              <Label>Category Preview</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {productCategories.find((cat) => cat.value === selectedCategory)?.label}
                </Badge>
                {formData.subcategory && formData.subcategory !== "none" && (
                  <Badge variant="secondary">
                    {availableSubcategories.find((sub) => sub.value === formData.subcategory)?.label}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={uploadingImage}>
              {product ? "Update Product" : "Add Product"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
