"use client"

import { useEffect, useState, useRef } from "react"
import { useLanguage } from "@/components/language-provider"

interface StatItemProps {
  target: number
  label: string
  suffix?: string
}

function StatItem({ target, label, suffix = "+" }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const duration = 2000
      const steps = 60
      const increment = target / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isVisible, target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
        {count}
        {suffix}
      </div>
      <p className="text-green-700 font-medium">{label}</p>
    </div>
  )
}

export function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    { target: 15, label: t("stats.yearsExperience") },
    { target: 500, label: t("stats.happyCustomers") },
    { target: 50, label: t("stats.products") },
    { target: 25, label: t("stats.districtsServed") },
  ]

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} target={stat.target} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
