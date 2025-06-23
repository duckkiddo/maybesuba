import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { TeamMember } from '../../types/admin'
import { TeamForm } from './forms/TeamForm'

interface TeamManagementProps {
  teamMembers: TeamMember[]
  onSave: (teamMembers: TeamMember[]) => void
  onLogActivity: (action: string, module: string, details: string) => void
}

export function TeamManagement({ teamMembers, onSave, onLogActivity }: TeamManagementProps) {
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSave = (teamMember: TeamMember) => {
    if (editingTeamMember) {
      const updatedTeamMembers = teamMembers.map((t) => (t.id === editingTeamMember.id ? teamMember : t))
      onSave(updatedTeamMembers)
      onLogActivity("Update", "Team", `Updated team member: ${teamMember.name.en}`)
    } else {
      onSave([...teamMembers, teamMember])
      onLogActivity("Create", "Team", `Created new team member: ${teamMember.name.en}`)
    }
    setEditingTeamMember(null)
    setIsDialogOpen(false)
  }

  const deleteTeamMember = (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const teamMemberToDelete = teamMembers.find((t) => t.id === id)
      onSave(teamMembers.filter((t) => t.id !== id))
      onLogActivity("Delete", "Team", `Deleted team member: ${teamMemberToDelete?.name.en || id}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <Button
          onClick={() => {
            setEditingTeamMember(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers
          .sort((a, b) => {
            if (a.type !== b.type) {
              return a.type === "board" ? -1 : 1
            }
            return a.order - b.order
          })
          .map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name.en}
                  className="w-full h-32 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                  }}
                />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-base">{member.name.en}</h3>
                    <p className="text-sm text-muted-foreground">{member.name.ne}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">#{member.order}</Badge>
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{member.position.en}</p>
                <p className="text-xs text-muted-foreground mb-4">{member.position.ne}</p>
                <Badge variant="outline" className="mb-4 text-xs capitalize">
                  {member.type === "board" ? "Board" : "Management"}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingTeamMember(member)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTeamMember(member.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <TeamForm
        teamMember={editingTeamMember}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}