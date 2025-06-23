import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileIcon, Video, Mail, Clock, Settings } from "lucide-react"
import type { AdminDashboardState } from '../../types/admin'
import { SettingsDialog } from './SettingsDialog'

interface DashboardOverviewProps {
  data: AdminDashboardState
  adminUsername: string
}

export function DashboardOverview({ data, adminUsername }: DashboardOverviewProps) {
  const newMailCount = data.mailSubmissions.filter((mail) => mail.status === "new").length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="hidden lg:flex items-center space-x-2">
          <SettingsDialog adminUsername={adminUsername} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <p className="text-3xl font-bold text-green-600">{data.products.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-3xl font-bold text-blue-600">{data.documents.length}</p>
              </div>
              <FileIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Media</p>
                <p className="text-3xl font-bold text-purple-600">{data.mediaItems.length}</p>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                <p className="text-3xl font-bold text-red-600">{newMailCount}</p>
              </div>
              <Mail className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {data.activityLogs.slice(0, 15).map((log) => (
              <div key={log.id} className="flex items-start space-x-4 border-b pb-3 last:border-0">
                <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                  {log.module === "Products" && <Package className="h-4 w-4 text-green-600" />}
                  {log.module === "Documents" && <FileIcon className="h-4 w-4 text-blue-600" />}
                  {log.module === "Notices" && <Clock className="h-4 w-4 text-yellow-600" />}
                  {log.module === "Factories" && <Package className="h-4 w-4 text-purple-600" />}
                  {log.module === "Media" && <Video className="h-4 w-4 text-red-600" />}
                  {log.module === "Carousel" && <Video className="h-4 w-4 text-indigo-600" />}
                  {log.module === "Mail" && <Mail className="h-4 w-4 text-orange-600" />}
                  {log.module === "Settings" && <Settings className="h-4 w-4 text-gray-600" />}
                  {log.module === "Team" && <Package className="h-4 w-4 text-teal-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900">
                      {log.action} {log.module}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatDate(log.timestamp)}</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{log.details}</p>
                </div>
              </div>
            ))}

            {data.activityLogs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No activity recorded yet</p>
                <p className="text-xs mt-1">Activity will appear here as you manage content</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}