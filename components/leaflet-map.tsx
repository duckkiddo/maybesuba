"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Factory {
  id: string
  name: string
  location?: {
    lat: number
    lng: number
  }
  contact?: string
  type?: string
  // Legacy support for old structure
  description?: string
  phone?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface LeafletMapProps {
  factories: Factory[]
}

declare global {
  interface Window {
    L: any
  }
}

export function LeafletMap({ factories }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.L) {
        setError("Map container or Leaflet not available")
        return
      }

      try {
        // Clean up existing map instance if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        // Clear the map container
        if (mapRef.current) {
          mapRef.current.innerHTML = ""
        }

        // Initialize map centered on Nepal
        const map = window.L.map(mapRef.current, {
          center: [28.3949, 84.124],
          zoom: 7,
          zoomControl: true,
          scrollWheelZoom: true,
        })

        // Add OpenStreetMap tiles
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        mapInstanceRef.current = map

        // Filter factories with valid coordinates
        const validFactories = factories.filter((factory) => {
          const coords = factory.location || factory.coordinates
          return (
            coords &&
            typeof coords.lat === "number" &&
            typeof coords.lng === "number" &&
            !isNaN(coords.lat) &&
            !isNaN(coords.lng) &&
            coords.lat >= -90 &&
            coords.lat <= 90 &&
            coords.lng >= -180 &&
            coords.lng <= 180
          )
        })

        console.log(`Found ${validFactories.length} valid factories out of ${factories.length} total`)

        // Add markers for each valid factory
        validFactories.forEach((factory) => {
          const coords = factory.location || factory.coordinates
          if (!coords) return

          // Get marker color based on type
          let markerColor = "#059669" // default green
          switch (factory.type) {
            case "headquarters":
              markerColor = "#dc2626" // red
              break
            case "depot":
              markerColor = "#2563eb" // blue
              break
            case "dealer":
              markerColor = "#ea580c" // orange
              break
            default:
              markerColor = "#059669" // green for factory
          }

          // Custom factory icon with dynamic color
          const factoryIcon = window.L.divIcon({
            html: `
              <div style="
                background: ${markerColor};
                border: 3px solid white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
            `,
            className: "custom-factory-icon",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })

          try {
            const marker = window.L.marker([coords.lat, coords.lng], {
              icon: factoryIcon,
            }).addTo(map)

            // Create popup content
            const popupContent = `
              <div style="padding: 10px; min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: ${markerColor}; font-size: 16px; font-weight: bold;">
                  ${factory.name}
                </h3>
                ${
                  factory.description
                    ? `
                  <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">
                    ${factory.description}
                  </p>
                `
                    : ""
                }
                ${
                  factory.contact || factory.phone
                    ? `
                  <div style="margin-bottom: 6px;">
                    <strong style="color: #333;">📞 Contact:</strong>
                    <span style="color: #666; font-size: 13px;"> ${factory.contact || factory.phone}</span>
                  </div>
                `
                    : ""
                }
                ${
                  factory.type
                    ? `
                  <div style="margin-bottom: 8px;">
                    <strong style="color: #333;">🏢 Type:</strong>
                    <span style="color: #666; font-size: 13px; text-transform: capitalize;"> ${factory.type}</span>
                  </div>
                `
                    : ""
                }
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee;">
                  <a 
                    href="https://www.openstreetmap.org/directions?from=&to=${coords.lat}%2C${coords.lng}" 
                    target="_blank"
                    style="
                      background: ${markerColor}; 
                      color: white; 
                      text-decoration: none;
                      padding: 6px 12px; 
                      border-radius: 4px; 
                      font-size: 12px;
                      display: inline-block;
                    "
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            `

            marker.bindPopup(popupContent)
          } catch (markerError) {
            console.error(`Error creating marker for factory ${factory.name}:`, markerError)
          }
        })

        // If no valid factories, show a message
        if (validFactories.length === 0) {
          const noDataPopup = window.L.popup()
            .setLatLng([28.3949, 84.124])
            .setContent(`
              <div style="padding: 10px; text-align: center;">
                <h3 style="color: #059669; margin-bottom: 8px;">No Factory Locations</h3>
                <p style="color: #666; font-size: 14px;">
                  No valid factory coordinates found.<br>
                  Add factories through the admin panel.
                </p>
              </div>
            `)
            .openOn(map)
        }

        setIsLoaded(true)
        setError(null)
      } catch (err) {
        console.error("Error initializing map:", err)
        setError("Failed to initialize map")
      }
    }

    // Load Leaflet CSS and JS
    if (!window.L) {
      // Add Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      // Add Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        setTimeout(initMap, 100) // Small delay to ensure DOM is ready
      }
      script.onerror = () => {
        setError("Failed to load Leaflet library")
      }
      document.head.appendChild(script)
    } else {
      // Small delay to ensure DOM is ready
      setTimeout(initMap, 100)
    }

    return () => {
      // Cleanup function
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (err) {
          console.warn("Error cleaning up map:", err)
        }
      }
    }
  }, [factories]) // Re-initialize when factories change

  if (error) {
    return <MapPlaceholder factories={factories} error={error} />
  }

  return (
    <div className="w-full relative">
      <div ref={mapRef} className="w-full h-96 rounded-lg border border-border" style={{ minHeight: "400px" }} />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/50 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Fallback component for when map fails to load
export function MapPlaceholder({ factories, error }: LeafletMapProps & { error?: string }) {
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
                {factory.description && <p className="text-sm text-muted-foreground mb-2">{factory.description}</p>}
                <div className="text-xs space-y-1">
                  {(factory.contact || factory.phone) && <div>📞 {factory.contact || factory.phone}</div>}
                  {factory.type && <div>🏢 {factory.type}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
