"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Factory {
  id: string
  name: string
  description: string
  location: string
  phone: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface GoogleMapsProps {
  factories: Factory[]
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMaps({ factories }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) {
        setError("Google Maps failed to load")
        return
      }

      try {
        // Center map on Nepal
        const nepal = { lat: 28.3949, lng: 84.124 }

        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 7,
          center: nepal,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        mapInstanceRef.current = map

        // Add markers for each factory
        factories.forEach((factory, index) => {
          const marker = new window.google.maps.Marker({
            position: factory.coordinates,
            map: map,
            title: factory.name,
            animation: window.google.maps.Animation.DROP,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#059669" stroke="white" strokeWidth="4"/>
                  <rect x="12" y="12" width="16" height="10" fill="white" rx="1"/>
                  <rect x="14" y="14" width="12" height="2" fill="#059669"/>
                  <rect x="14" y="17" width="8" height="1" fill="#059669"/>
                  <rect x="14" y="19" width="6" height="1" fill="#059669"/>
                  <circle cx="16" cy="26" r="2" fill="white"/>
                  <circle cx="24" cy="26" r="2" fill="white"/>
                  <rect x="12" y="24" width="16" height="2" fill="white"/>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
            },
          })

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 15px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 18px; font-weight: bold;">
                  ${factory.name}
                </h3>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px; line-height: 1.4;">
                  ${factory.description}
                </p>
                <div style="margin-bottom: 8px;">
                  <strong style="color: #333;">📍 Location:</strong>
                  <span style="color: #666; font-size: 13px;"> ${factory.location}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <strong style="color: #333;">📞 Phone:</strong>
                  <span style="color: #666; font-size: 13px;"> ${factory.phone}</span>
                </div>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                  <button 
                    onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${factory.coordinates.lat},${factory.coordinates.lng}', '_blank')"
                    style="background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            `,
          })

          marker.addListener("click", () => {
            // Close all other info windows
            factories.forEach((_, i) => {
              if (i !== index && mapInstanceRef.current.infoWindows) {
                mapInstanceRef.current.infoWindows[i]?.close()
              }
            })
            infoWindow.open(map, marker)
          })

          // Store info windows for later reference
          if (!mapInstanceRef.current.infoWindows) {
            mapInstanceRef.current.infoWindows = []
          }
          mapInstanceRef.current.infoWindows[index] = infoWindow
        })

        setIsLoaded(true)
        setError(null)
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("Failed to initialize map")
      }
    }

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement("script")
      // Replace with your actual Google Maps API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz-TK7VCo&callback=initMap&libraries=places`
      script.async = true
      script.defer = true

      script.onload = () => {
        setIsLoaded(true)
      }

      script.onerror = () => {
        setError("Failed to load Google Maps")
      }

      window.initMap = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      // Cleanup if needed
    }
  }, [factories])

  if (error) {
    return <MapPlaceholder factories={factories} error={error} />
  }

  return (
    <div className="w-full">
      <div ref={mapRef} className="w-full h-96 rounded-lg border border-border" style={{ minHeight: "400px" }} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Fallback component for when Google Maps is not available
export function MapPlaceholder({ factories, error }: GoogleMapsProps & { error?: string }) {
  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-2xl font-bold mb-2 text-primary">Factory Locations</h3>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <p className="text-muted-foreground mb-6">Our {factories.length} facilities across Nepal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {factories.map((factory) => (
              <div key={factory.id} className="bg-muted/50 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-primary mb-2">{factory.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{factory.description}</p>
                <div className="text-xs space-y-1">
                  <div>📍 {factory.location}</div>
                  <div>📞 {factory.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
