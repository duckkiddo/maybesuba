import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { NoticePopup } from "@/components/notice-popup"
import { COMPANY_CONFIG } from "@/lib/constants"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: COMPANY_CONFIG.name.en,
  description: "Leading agricultural company in Nepal with premium quality products",
  keywords: "agriculture, Nepal, farming, organic products, Vargo Agro Industries",
  authors: [{ name: COMPANY_CONFIG.name.en }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: COMPANY_CONFIG.name.en,
    description: "Leading agricultural company in Nepal with premium quality products",
    type: "website",
    locale: "en_US",
  },
    generator: 'PixelPlaty',
    
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <NoticePopup />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
