"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Quote, Mic, Pause } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function CEOMessage() {
  const { t } = useLanguage()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">{t("ceo.title")}</h2>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-green-200">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 relative">
              <div className="relative h-96 md:h-full rounded-l-lg overflow-hidden">
                <Image
                  src="/images/guru.JPG"
                  alt="Chairman Guru Prasad Neupane"
                  fill
                  className="object-cover"
                />

                {/* Toggle button on left bottom */}
                <button
                  onClick={toggleAudio}
                  aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                  className="absolute bottom-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg focus:outline-none flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-green-600" />
                  ) : (
                    <Mic className="w-8 h-8 text-green-400" />
                  )}
                </button>

                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src="https://ia600701.us.archive.org/32/items/undertheguns_2411_librivox/undertheguns_00_wittenmyer_64kb.mp3"
                  onEnded={() => setIsPlaying(false)}
                />
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <Quote className="w-12 h-12 text-green-600 mb-6" />
                <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                  {t("ceo.message")}
                </blockquote>
                <div className="border-t border-green-200 pt-6">
                  <div className="font-bold text-xl text-green-800">{t("ceo.name")}</div>
                  <div className="text-green-600 font-medium">{t("ceo.position")}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
