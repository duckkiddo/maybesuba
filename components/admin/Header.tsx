import React from 'react'
import { Button } from "@/components/ui/button"
import { Menu, Settings } from "lucide-react"
import { SettingsDialog } from './SettingsDialog'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  adminUsername: string
}

export function Header({ setSidebarOpen, adminUsername }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b p-4 lg:hidden">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <SettingsDialog adminUsername={adminUsername} />
        </div>
      </div>
    </header>
  )
}