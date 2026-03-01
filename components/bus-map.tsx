"use client"

import { useEffect, useRef, useState } from "react"
import type { ActiveBus, BusLine } from "@/lib/dakar-bus-data"
import { BUS_LINES, DAKAR_CENTER, DAKAR_ZOOM } from "@/lib/dakar-bus-data"
import type { Report, ReportCategory } from "@/lib/report-data"
import { REPORT_TYPES, formatTimeAgo } from "@/lib/report-data"

interface BusMapProps {
  buses: ActiveBus[]
  selectedLine: string | null
  onSelectLine: (lineId: string | null) => void
  onSelectBus: (bus: ActiveBus) => void
  userLocation: { lat: number; lng: number } | null
  isScoutMode: boolean
  reports?: Report[]
}

export function BusMap({
  buses,
  selectedLine,
  onSelectLine,
  onSelectBus,
  userLocation,
  isScoutMode,
  reports = [],
}: BusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routeLayerRef = useRef<L.Polyline[]>([])
  const stopMarkersRef = useRef<L.CircleMarker[]>([])
  const userMarkerRef = useRef<L.Marker | null>(null)
  const reportMarkersRef = useRef<L.Marker[]>([])
  const [mapReady, setMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return
    // Prevent re-initialization if already created
    if (leafletMap.current) return

    let cancelled = false

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      if (cancelled || !mapRef.current) return

      // Extra safety: check if container already has a map attached
      const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number }
      if (container._leaflet_id) return

      const map = L.map(mapRef.current, {
        center: [DAKAR_CENTER.lat, DAKAR_CENTER.lng],
        zoom: DAKAR_ZOOM,
        zoomControl: false,
        attributionControl: false,
      })

      // Use a clean map tile style (Positron)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map)

      // Add zoom control on right
      L.control.zoom({ position: "topright" }).addTo(map)

      // Attribution bottom-left
      L.control.attribution({ position: "bottomleft" }).addTo(map)

      leafletMap.current = map
      if (!cancelled) {
        setMapReady(true)
      }
    }

    initMap()

    return () => {
      cancelled = true
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
        setMapReady(false)
      }
    }
  }, [])

  // Draw route lines
  useEffect(() => {
    if (!leafletMap.current || !mapReady) return

    const loadRoutes = async () => {
      const L = (await import("leaflet")).default

      // Clear old routes
      routeLayerRef.current.forEach((r) => r.remove())
      routeLayerRef.current = []
      stopMarkersRef.current.forEach((m) => m.remove())
      stopMarkersRef.current = []

      const linesToDraw = selectedLine
        ? BUS_LINES.filter((l) => l.id === selectedLine)
        : BUS_LINES

      linesToDraw.forEach((line: BusLine) => {
        const coords = line.stops.map(
          (s) => [s.lat, s.lng] as [number, number]
        )

        const polyline = L.polyline(coords, {
          color: line.color,
          weight: selectedLine === line.id ? 5 : 3,
          opacity: selectedLine && selectedLine !== line.id ? 0.3 : 0.8,
          dashArray: selectedLine === line.id ? undefined : "8 4",
        }).addTo(leafletMap.current!)

        polyline.on("click", () => {
          onSelectLine(line.id)
        })

        routeLayerRef.current.push(polyline)

        // Draw stop markers if selected
        if (selectedLine === line.id) {
          line.stops.forEach((stop) => {
            const circle = L.circleMarker([stop.lat, stop.lng], {
              radius: 7,
              fillColor: "#ffffff",
              color: line.color,
              weight: 3,
              fillOpacity: 1,
            }).addTo(leafletMap.current!)

            circle.bindTooltip(stop.name, {
              permanent: false,
              direction: "top",
              className: "bus-stop-tooltip",
            })

            stopMarkersRef.current.push(circle)
          })

          // Fit bounds to selected line
          if (coords.length > 0) {
            leafletMap.current!.fitBounds(L.latLngBounds(coords), {
              padding: [60, 60],
            })
          }
        }
      })
    }

    loadRoutes()
  }, [selectedLine, mapReady, onSelectLine])

  // Update bus markers
  useEffect(() => {
    if (!leafletMap.current || !mapReady) return

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default

      // Clear old markers
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []

      const filteredBuses = selectedLine
        ? buses.filter((b) => b.lineId === selectedLine)
        : buses

      filteredBuses.forEach((bus: ActiveBus) => {
        const line = BUS_LINES.find((l) => l.id === bus.lineId)
        if (!line) return

        const timeSinceUpdate = Math.floor(
          (Date.now() - bus.lastUpdate) / 1000
        )
        const freshness =
          timeSinceUpdate < 30
            ? "fresh"
            : timeSinceUpdate < 120
              ? "recent"
              : "stale"
        const opacity = freshness === "fresh" ? 1 : freshness === "recent" ? 0.8 : 0.5

        const busIcon = L.divIcon({
          className: "bus-marker-icon",
          html: `
            <div style="
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                background: ${line.color};
                color: white;
                font-weight: 700;
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                white-space: nowrap;
                opacity: ${opacity};
                border: 2px solid white;
                font-family: Inter, sans-serif;
              ">${line.number}</div>
              ${bus.scoutCount > 0 ? `<div style="
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ef4444;
                color: white;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                font-size: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                border: 1px solid white;
              ">${bus.scoutCount}</div>` : ""}
            </div>
          `,
          iconSize: [50, 30],
          iconAnchor: [25, 15],
        })

        const marker = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(
          leafletMap.current!
        )

        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 160px;">
            <div style="font-weight: 700; font-size: 15px; color: ${line.color}; margin-bottom: 4px;">
              Ligne ${line.number}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${line.name}</div>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
              <div><strong>Vitesse:</strong> ${Math.round(bus.speed)} km/h</div>
              <div><strong>Prochain arret:</strong> ${bus.nextStop}</div>
              <div><strong>ETA:</strong> ~${bus.eta} min</div>
              <div><strong>Eclaireurs:</strong> ${bus.scoutCount}</div>
            </div>
          </div>
        `)

        marker.on("click", () => {
          onSelectBus(bus)
        })

        markersRef.current.push(marker)
      })
    }

    updateMarkers()
  }, [buses, selectedLine, mapReady, onSelectBus])

  // User location marker
  useEffect(() => {
    if (!leafletMap.current || !mapReady || !userLocation) return

    const addUserMarker = async () => {
      const L = (await import("leaflet")).default

      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
      }

      const userIcon = L.divIcon({
        className: "user-marker-icon",
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.2);
            ${isScoutMode ? "animation: pulse 2s infinite;" : ""}
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      userMarkerRef.current = L.marker(
        [userLocation.lat, userLocation.lng],
        { icon: userIcon }
      ).addTo(leafletMap.current!)
    }

    addUserMarker()
  }, [userLocation, mapReady, isScoutMode])

  // Report markers
  useEffect(() => {
    if (!leafletMap.current || !mapReady) return

    const addReportMarkers = async () => {
      const L = (await import("leaflet")).default

      // Clear old
      reportMarkersRef.current.forEach((m) => m.remove())
      reportMarkersRef.current = []

      const activeReports = reports.filter((r) => r.active)
      activeReports.forEach((report) => {
        const type = REPORT_TYPES.find((t) => t.category === report.category)
        if (!type) return

        const ICON_SVG: Record<ReportCategory, string> = {
          traffic: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
          control: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
          bus_status: `<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>`,
          danger: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
          new_stop: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,
        }

        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              background: ${type.color};
              padding: 6px;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              border: 2px solid white;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${ICON_SVG[report.category]}
              </svg>
            </div>
            ${report.upvotes > 2 ? `<div style="
              position: absolute;
              top: -4px;
              right: -4px;
              background: white;
              color: ${type.color};
              width: 14px;
              height: 14px;
              border-radius: 50%;
              font-size: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            ">${report.upvotes}</div>` : ""}
          </div>
        `

        const reportIcon = L.divIcon({
          className: "report-marker-icon",
          html: iconHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        const marker = L.marker([report.lat, report.lng], { icon: reportIcon }).addTo(
          leafletMap.current!
        )

        const subLabel = type.subTypes.find((s) => s.value === report.subType)?.label || report.subType
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 180px;">
            <div style="font-weight: 700; font-size: 13px; color: ${type.color}; margin-bottom: 2px;">
              ${type.label}${report.lineNumber ? ` - Ligne ${report.lineNumber}` : ""}
            </div>
            <div style="font-size: 11px; color: #666; margin-bottom: 6px;">${subLabel}</div>
            <div style="font-size: 11px; color: #333; margin-bottom: 6px; line-height: 1.4;">
              ${report.locationName}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #999;">
              <span>${report.userName}</span>
              <span>${report.upvotes} confirmations</span>
            </div>
          </div>
        `)

        reportMarkersRef.current.push(marker)
      })
    }

    addReportMarkers()
  }, [reports, mapReady])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      <style jsx global>{`
        .bus-stop-tooltip {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }
        .bus-stop-tooltip::before {
          border-top-color: white;
        }
        .bus-marker-icon {
          background: transparent !important;
          border: none !important;
        }
        .user-marker-icon {
          background: transparent !important;
          border: none !important;
        }
        .report-marker-icon {
          background: transparent !important;
          border: none !important;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 0 12px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0,0,0,0.2); }
          100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.2); }
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
