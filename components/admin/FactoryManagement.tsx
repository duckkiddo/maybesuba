import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { FactoryType } from '../../types/admin'
import { FactoryForm } from './forms/FactoryForm'

interface FactoryManagementProps {
  factories: FactoryType[]
  onSave: (factories: FactoryType[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
}

export function FactoryManagement({ factories, onSave, onLogActivity }: FactoryManagementProps) {
  const [editingFactory, setEditingFactory] = useState<FactoryType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = (factory: FactoryType) => {
    if (editingFactory) {
      const updatedFactories = factories.map((f) => (f.id === editingFactory.id ? factory : f))
      onSave(updatedFactories)
      onLogActivity("Update", "Factories", `Updated factory: ${factory.name}`)
    } else {
      onSave([...factories, factory])
      onLogActivity("Create", "Factories", `Created new factory: ${factory.name}`)
    }
    setEditingFactory(null)
    setIsDialogOpen(false)
  }

  const deleteFactory = (id: string) => {
    if (confirm("Are you sure you want to delete this factory?")) {
      const factoryToDelete = factories.find((f) => f.id === id)
      onSave(factories.filter((f) => f.id !== id))
      onLogActivity("Delete", "Factories", `Deleted factory: ${factoryToDelete?.name || id}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Factory Management</h2>
        <Button
          onClick={() => {
            setEditingFactory(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Factory
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factories.map((factory) => (
          <Card key={factory.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {factory.image && (
                <img
                  src={factory.image || "/placeholder.svg"}
                  alt={factory.name}
                  className="w-full h-32 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                  }}
                />
              )}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-base">{factory.name}</h3>
                <Badge variant="outline" className="capitalize">
                  {factory.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">📞 {factory.contact}</p>
              <p className="text-xs text-muted-foreground mb-4">
                📍 {factory.location.lat.toFixed(4)}, {factory.location.lng.toFixed(4)}
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingFactory(factory)
                    setIsDialogOpen(true)
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteFactory(factory.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FactoryForm
        factory={editingFactory}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}