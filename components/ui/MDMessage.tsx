"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Quote, Mic, Pause } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function MDMessage() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">{t("md.title")}</h2>
        </div>

        <Card className="max-w-4xl mx-auto shadow-2xl border-green-200">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 relative">
              {/* Text content first */}
              <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-1">
                <Quote className="w-12 h-12 text-green-600 mb-6" />
                <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                  {t("md.message")}
                </blockquote>
                <div className="border-t border-green-200 pt-6">
                  <div className="font-bold text-xl text-green-800">{t("md.name")}</div>
                  <div className="text-green-600 font-medium">{t("md.position")}</div>
                </div>
              </div>

              {/* Image on right side */}
              <div className="relative h-96 md:h-full rounded-r-lg overflow-hidden order-2 md:order-2">
                <Image
                  src="https://images.unsplash.com/photo-1667184763638-a666fc90ece2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9zcyUyMG5lcGFsaXxlbnwwfHwwfHx8MA%3D%3D" // Replace with actual MD image path
                  alt="Managing Director"
                  fill
                  className="object-cover"
                />

                {/* Toggle button on left bottom of image */}
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
                  src="https://ia803108.us.archive.org/10/items/a_christmas_miscellany_2018_1807_librivox/christmasmiscellany2018_01_various_128kb.mp3" // Replace with actual audio URL
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
