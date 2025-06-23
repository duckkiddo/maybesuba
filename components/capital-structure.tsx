"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, PieChart } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function CapitalStructure() {
  const { language, t } = useLanguage()

  const capitalData = [
    {
      title: t("capital.authorized"),
      amount: "NPR 100,000,000",
      icon: PieChart,
      description: language === "ne" ? "कम्पनी ऐनमा उल्लेखित अधिकतम पूंजी" : "Maximum capital mentioned in company charter",
    },
    {
      title: t("capital.issued"),
      amount: "NPR 75,000,000",
      icon: TrendingUp,
      description: language === "ne" ? "सेयरधारकहरूलाई जारी गरिएको पूंजी" : "Capital issued to shareholders",
    },
    {
      title: t("capital.paidUp"),
      amount: "NPR 60,000,000",
      icon: DollarSign,
      description: language === "ne" ? "वास्तवमा भुक्तानी गरिएको पूंजी" : "Actually paid capital by shareholders",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">{t("capital.title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("capital.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {capitalData.map((item, index) => (
            <Card key={index} className="text-center shadow-xl border-green-200 hover:shadow-2xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-800">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-4">{item.amount}</div>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Financial Info */}
        <div className="mt-16 bg-green-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-green-800 mb-2">80%</div>
              <div className="text-gray-600">{t("capital.utilization")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800 mb-2">AAA</div>
              <div className="text-gray-600">{t("capital.creditRating")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800 mb-2">2009</div>
              <div className="text-gray-600">{t("capital.established")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
