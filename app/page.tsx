import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { WelcomeSection } from "@/components/welcome-section"
import { CEOMessage } from "@/components/ceo-message"
import { StatsSection } from "@/components/stats-section"
import { AboutSection } from "@/components/about-section"
import { ProductsSection } from "@/components/products-section"
import { FactoriesSection } from "@/components/factories-section"
import { AgricultureTimeline } from "@/components/agriculture-timeline"
import { CapitalStructure } from "@/components/capital-structure"
import { GallerySection } from "@/components/gallery-section"
import { VideosSection } from "@/components/videos-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { MDMessage } from "@/components/ui/MDMessage"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <WelcomeSection />
      <CEOMessage />
      <MDMessage/>
      <StatsSection />
      <AboutSection />
      <ProductsSection />
      <FactoriesSection />
      <AgricultureTimeline />
      <CapitalStructure />
      <GallerySection />
      <VideosSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
