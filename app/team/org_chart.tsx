"use client"
import { useState, useEffect } from "react"
import orgChartData from "@/data/org-chart.json"

interface OrgMember {
  id: string
  name: string
  title: string
  position: number
  parentId: string | null
}

const OrgNode = ({ member, children, level }: { member: OrgMember; children: OrgMember[]; level: number }) => {
  return (
    <div className="relative mb-8">
      {/* Node */}
      <div
        className="bg-white p-4 rounded-lg shadow-md border border-green-200 text-center min-w-[200px] mx-auto"
        style={{ marginTop: `${level * 80}px` }} // Vertical spacing based on level
      >
        <h3 className="font-bold text-green-800">{member.name}</h3>
        <p className="text-sm text-green-600">{member.title}</p>
      </div>

      {/* Connectors and Children */}
      {children.length > 0 && (
        <div className="flex justify-center mt-4">
          {/* Horizontal Connector Line */}
          <div className="w-full max-w-[600px] border-t-2 border-green-300 absolute" style={{ top: `${level * 80 + 20}px` }} />
          <div className="flex justify-between w-full max-w-[600px] mt-2">
            {children.map((child) => (
              <div key={child.id} className="relative">
                {/* Vertical Connector Line */}
                <div
                  className="w-0.5 h-8 bg-green-300 absolute"
                  style={{ top: "-28px", left: "50%", transform: "translateX(-50%)" }}
                />
                <OrgNode member={child} children={orgChartData.filter(m => m.parentId === child.id)} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChart() {
  const [members, setMembers] = useState<OrgMember[]>([])

  useEffect(() => {
    // Sort by position to ensure correct rendering order
    const sortedMembers = [...orgChartData].sort((a, b) => a.position - b.position)
    setMembers(sortedMembers)
  }, [])

  const rootMembers = members.filter((member) => !member.parentId)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-800">Organizational Chart</h1>
      <div className="relative flex flex-col items-center">
        {rootMembers.map((member) => (
          <OrgNode
            key={member.id}
            member={member}
            children={members.filter((m) => m.parentId === member.id)}
            level={0}
          />
        ))}
      </div>
    </div>
  )
}