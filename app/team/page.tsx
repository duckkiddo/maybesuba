"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowLeft, Users } from "lucide-react"
import initialTeamData from "@/data/initial-team.json"
import OrgChart from "./org_chart"

interface TeamMember {
  id: string
  name: { en: string; ne: string }
  position: { en: string; ne: string }
  image: string
  type: "board" | "management"
  order: number
  isActive: boolean
}

export default function TeamPage() {
  const { language } = useLanguage()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadTeamMembers()

    const handleTeamUpdate = () => loadTeamMembers()
    window.addEventListener("teamMembersUpdated", handleTeamUpdate)
    return () => window.removeEventListener("teamMembersUpdated", handleTeamUpdate)
  }, [])

  const loadTeamMembers = () => {
    try {
      const savedTeamMembers = localStorage.getItem("teamMembers")
      if (savedTeamMembers) {
        const members = JSON.parse(savedTeamMembers) as TeamMember[]
        const validMembers = members.filter((member): member is TeamMember =>
          member.isActive && (member.type === "board" || member.type === "management")
        )
        setTeamMembers(validMembers)
      } else {
        const activeMembers = initialTeamData.filter((member): member is TeamMember =>
          member.isActive && (member.type === "board" || member.type === "management")
        )
        setTeamMembers(activeMembers)
        localStorage.setItem("teamMembers", JSON.stringify(initialTeamData))
      }
    } catch (error) {
      console.warn("Failed to load team members:", error)
      const activeMembers = initialTeamData.filter((member): member is TeamMember =>
        member.isActive && (member.type === "board" || member.type === "management")
      )
      setTeamMembers(activeMembers)
    }
  }

  const boardMembers = teamMembers.filter((member) => member.type === "board").sort((a, b) => a.order - b.order)
  const managementTeam = teamMembers.filter((member) => member.type === "management").sort((a, b) => a.order - b.order)

  const handleImageError = (id: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!failedImages.has(id)) {
      console.warn(`Image failed to load for ID ${id}: ${e.currentTarget.src}`)
      setFailedImages((prev) => new Set(prev).add(id))
      e.currentTarget.src = "/placeholder.svg"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

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
                {language === "ne" ? "हाम्रो टिम" : "Our Team"}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {language === "ne" ? "हाम्रो कम्पनीको नेतृत्व र व्यवस्थापन टिम" : "Leadership and Management Team"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <OrgChart></OrgChart>

      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {boardMembers.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
                {language === "ne" ? "सञ्चालक समिति" : "Board of Directors"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {boardMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200">
                    <div className="aspect-square relative">
                      <Image
                        src={member.image}
                        alt={language === "ne" ? member.name.ne : member.name.en}
                        fill
                        className="object-cover"
                        onError={(e) => handleImageError(member.id, e)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        loader={({ src }) => src}
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-bold text-green-800 mb-1">{language === "ne" ? member.name.ne : member.name.en}</h3>
                      <p className="text-sm text-green-600">{language === "ne" ? member.position.ne : member.position.en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {managementTeam.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
                {language === "ne" ? "व्यवस्थापन टिम" : "Management Team"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {managementTeam.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-green-200">
                    <div className="aspect-square relative">
                      <Image
                        src={member.image}
                        alt={language === "ne" ? member.name.ne : member.name.en}
                        fill
                        className="object-cover"
                        onError={(e) => handleImageError(member.id, e)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        loader={({ src }) => src}
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-bold text-green-800 mb-1">{language === "ne" ? member.name.ne : member.name.en}</h3>
                      <p className="text-sm text-green-600">{language === "ne" ? member.position.ne : member.position.en}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {boardMembers.length === 0 && managementTeam.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-600">
                {language === "ne" ? "कुनै टिम सदस्य फेला परेन" : "No Team Members Found"}
              </h3>
              <p className="text-gray-500">
                {language === "ne" ? "टिम सदस्यहरू थप्न प्रशासकीय प्यानल प्रयोग गर्नुहोस्" : "Use the admin panel to add team members"}
              </p>
            </div>
          )}

          {(boardMembers.length > 0 || managementTeam.length > 0) && (
            <Card className="mt-12 border-green-200">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-green-800">
                  {language === "ne" ? "हाम्रो टिम" : "Our Team"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <div>
                    <div className="text-3xl font-bold text-green-600">{boardMembers.length}</div>
                    <p className="text-green-700">{language === "ne" ? "सञ्चालक सदस्यहरू" : "Board Members"}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{managementTeam.length}</div>
                    <p className="text-green-700">{language === "ne" ? "व्यवस्थापन सदस्यहरू" : "Management Team"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}