// Real Dakar bus lines data with actual routes and stops
export interface BusStop {
  id: string
  name: string
  lat: number
  lng: number
}

export type Operator = "Dem Dikk" | "AFTU" | "Tata" | "BRT" | "TER"

export interface BusLine {
  id: string
  number: string
  name: string
  color: string
  operator: Operator
  fare: number // in CFA francs
  stops: BusStop[]
  returnStops?: BusStop[] // Optional: return trip stops if different from reverse order
}

export interface ActiveBus {
  id: string
  lineId: string
  lat: number
  lng: number
  heading: number
  speed: number // km/h
  scoutCount: number
  lastUpdate: number
  nextStop: string
  eta: number // minutes to next stop
  trackingName?: string // nom du passager éclaireur
}

import { ALL_DEM_DIKK_LINES } from "./dem-dikk-data"
import { BRT_LINES } from "./brt-data"
import { TER_LINES } from "./ter-data"

export const DEM_DIKK_LINES: BusLine[] = ALL_DEM_DIKK_LINES

// Tata Bus Lines (orange #E85D04 / #F48C06)
export const TATA_LINES: BusLine[] = [
  {
    id: "tata-40",
    number: "40",
    name: "Almadies - Colobane",
    color: "#E85D04",
    operator: "Tata",
    fare: 150,
    stops: [
      { id: "t-40-1", name: "Pointe des Almadies", lat: 14.7467, lng: -17.5233 },
      { id: "t-40-2", name: "Ngor", lat: 14.7486, lng: -17.5089 },
      { id: "t-40-3", name: "Yoff", lat: 14.7533, lng: -17.4800 },
      { id: "t-40-4", name: "Ouakam", lat: 14.7253, lng: -17.4878 },
      { id: "t-40-5", name: "Mermoz", lat: 14.7183, lng: -17.4736 },
      { id: "t-40-6", name: "Colobane", lat: 14.6889, lng: -17.4500 },
    ],
  },
  {
    id: "tata-27",
    number: "27",
    name: "Yoff - Gare Centrale",
    color: "#F48C06",
    operator: "Tata",
    fare: 150,
    stops: [
      { id: "t-27-1", name: "Yoff Village", lat: 14.7533, lng: -17.4800 },
      { id: "t-27-2", name: "Aéroport Yoff", lat: 14.7394, lng: -17.4894 },
      { id: "t-27-3", name: "Liberté 5", lat: 14.7281, lng: -17.4636 },
      { id: "t-27-4", name: "HLM", lat: 14.7100, lng: -17.4558 },
      { id: "t-27-5", name: "Colobane", lat: 14.6889, lng: -17.4500 },
      { id: "t-27-6", name: "Gare Centrale", lat: 14.6650, lng: -17.4436 },
    ],
  },
  {
    id: "tata-55",
    number: "55",
    name: "Guediawaye - Sandaga",
    color: "#FB923C",
    operator: "Tata",
    fare: 200,
    stops: [
      { id: "t-55-1", name: "Guediawaye Marché", lat: 14.7753, lng: -17.3936 },
      { id: "t-55-2", name: "Sam Notaire", lat: 14.7700, lng: -17.4100 },
      { id: "t-55-3", name: "Parcelles Assainies", lat: 14.7667, lng: -17.4417 },
      { id: "t-55-4", name: "Grand Yoff", lat: 14.7414, lng: -17.4489 },
      { id: "t-55-5", name: "Liberte 6", lat: 14.7231, lng: -17.4586 },
      { id: "t-55-6", name: "Centenaire", lat: 14.7028, lng: -17.4539 },
      { id: "t-55-7", name: "Sandaga", lat: 14.6717, lng: -17.4383 },
    ],
  },
  {
    id: "tata-8",
    number: "8",
    name: "Pikine - Petersen",
    color: "#FBBF24",
    operator: "Tata",
    fare: 175,
    stops: [
      { id: "t-8-1", name: "Pikine Terminus", lat: 14.7575, lng: -17.3936 },
      { id: "t-8-2", name: "Thiaroye Sur Mer", lat: 14.7500, lng: -17.3700 },
      { id: "t-8-3", name: "Hann", lat: 14.7228, lng: -17.4264 },
      { id: "t-8-4", name: "Fann", lat: 14.6964, lng: -17.4631 },
      { id: "t-8-5", name: "Petersen", lat: 14.6650, lng: -17.4328 },
    ],
  },
]

// Combined
export const BUS_LINES: BusLine[] = [...DEM_DIKK_LINES, ...TATA_LINES, ...BRT_LINES, ...TER_LINES]


// All unique stops for search
export const ALL_STOPS: BusStop[] = Array.from(
  new Map(
    BUS_LINES.flatMap((line) => line.stops).map((stop) => [stop.name, stop])
  ).values()
)

// Helper: find bus lines that pass through a stop
export function findLinesForStop(stopName: string): BusLine[] {
  return BUS_LINES.filter((line) =>
    line.stops.some((s) => s.name === stopName)
  )
}

// Helper: find bus lines connecting two stops
export function findConnectingLines(
  fromStop: string,
  toStop: string
): { line: BusLine; fromIdx: number; toIdx: number }[] {
  const results: { line: BusLine; fromIdx: number; toIdx: number }[] = []
  for (const line of BUS_LINES) {
    const fromIdx = line.stops.findIndex((s) => s.name === fromStop)
    const toIdx = line.stops.findIndex((s) => s.name === toStop)
    if (fromIdx !== -1 && toIdx !== -1) {
      results.push({ line, fromIdx, toIdx })
    }
  }
  return results
}

// Dakar center coordinates
export const DAKAR_CENTER = { lat: 14.7167, lng: -17.4677 }
export const DAKAR_ZOOM = 12

// Simulate bus positions along route
export function interpolatePosition(
  stops: BusStop[],
  progress: number // 0-1 along the route
): { lat: number; lng: number; nearestStopIdx: number } {
  const totalSegments = stops.length - 1
  const segmentFloat = progress * totalSegments
  const segmentIdx = Math.min(Math.floor(segmentFloat), totalSegments - 1)
  const segmentProgress = segmentFloat - segmentIdx

  const from = stops[segmentIdx]
  const to = stops[Math.min(segmentIdx + 1, stops.length - 1)]

  return {
    lat: from.lat + (to.lat - from.lat) * segmentProgress,
    lng: from.lng + (to.lng - from.lng) * segmentProgress,
    nearestStopIdx: segmentProgress > 0.5 ? segmentIdx + 1 : segmentIdx,
  }
}
