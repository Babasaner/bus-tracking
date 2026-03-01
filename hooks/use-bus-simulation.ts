"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { ActiveBus } from "@/lib/dakar-bus-data"
import { BUS_LINES, interpolatePosition } from "@/lib/dakar-bus-data"
import { useTripHistory } from "./use-trip-history"
import { useToast } from "./use-toast"
import { auth, isFirebaseConfigured } from "@/lib/firebase"
import { 
  addScoutToFirestore, 
  updateScoutInFirestore, 
  subscribeToScouts, 
  endScoutSession,
  type FirebaseScout 
} from "@/lib/firebase-db"

interface SimulatedBus extends ActiveBus {
  direction: "forward" | "backward"
  progress: number
}


export function useBusSimulation() {
  const [buses, setBuses] = useState<SimulatedBus[]>([])
  const [isScoutMode, setIsScoutMode] = useState(false)
  const [scoutLineId, setScoutLineId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { startTripTracking, stopTripTracking } = useTripHistory()
  const { toast } = useToast()
  const lastStopRef = useRef<string | null>(null)
  const scoutSessionId = useRef<string | null>(null)
  const isUpdatingScout = useRef(false)

  // Operating time check (Always true for development/test)
  const isOperatingTime = useCallback(() => {
    return true
  }, [])

  // Firestore Scouts Subscription
  useEffect(() => {
    if (!isFirebaseConfigured()) return

    const unsubscribe = subscribeToScouts((scoutsData) => {
      // Transform FirebaseScout to ActiveBus
      const mappedBuses: SimulatedBus[] = scoutsData.map(s => {
        const line = BUS_LINES.find(l => l.id === s.lineId)
        return {
          id: s.id!,
          lineId: s.lineId,
          lat: s.lat,
          lng: s.lng,
          heading: s.heading,
          speed: 0, 
          scoutCount: 1,
          lastUpdate: s.lastUpdate,
          nextStop: "En route",
          eta: 0,
          direction: "forward", 
          progress: 0
        }
      })
      setBuses(mappedBuses)
    })

    return () => unsubscribe()
  }, [])

  // Scout Position Upload Logic
  useEffect(() => {
    if (isScoutMode && scoutLineId && userLocation && isFirebaseConfigured()) {
      const uploadInterval = setInterval(async () => {
        if (isUpdatingScout.current) return
        isUpdatingScout.current = true

        try {
          const scoutData: Omit<FirebaseScout, "id"> = {
            userId: auth?.currentUser?.uid || "anonymous",
            userName: auth?.currentUser?.displayName || "Anonyme",
            lineId: scoutLineId,
            lat: userLocation.lat,
            lng: userLocation.lng,
            heading: 0, 
            active: true,
            lastUpdate: Date.now(),
          }

          if (scoutSessionId.current) {
            await updateScoutInFirestore(scoutSessionId.current, scoutData)
          } else {
            const id = await addScoutToFirestore(scoutData)
            scoutSessionId.current = id
          }
        } catch (error) {
          console.error("Error uploading scout position:", error)
        } finally {
          isUpdatingScout.current = false
        }
      }, 5000)

      return () => clearInterval(uploadInterval)
    }
  }, [isScoutMode, scoutLineId, userLocation])

  // Stop notification logic
  useEffect(() => {
    if (scoutLineId && userLocation) {
      const line = BUS_LINES.find(l => l.id === scoutLineId)
      if (!line) return

      let closestStop = line.stops[0]
      let minDist = Infinity
      
      line.stops.forEach(stop => {
        const d = Math.sqrt(Math.pow(stop.lat - userLocation.lat, 2) + Math.pow(stop.lng - userLocation.lng, 2))
        if (d < minDist) {
          minDist = d
          closestStop = stop
        }
      })

      if (minDist < 0.002) {
        if (lastStopRef.current !== closestStop.name) {
          toast({
            title: "Arrivée à l'arrêt",
            description: `Bienvenue à ${closestStop.name}`,
          })
          lastStopRef.current = closestStop.name
        }
      } else if (minDist > 0.003 && lastStopRef.current === closestStop.name) {
        toast({
          title: "En route",
          description: `Vous avez quitté ${closestStop.name}. Prochain arrêt bientôt.`,
        })
        lastStopRef.current = null
      }
    }
  }, [scoutLineId, userLocation, toast])

  const requestLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {
          setUserLocation({ lat: 14.7167, lng: -17.4677 })
        }
      )
    }
  }, [])

  const validateScoutSpeed = useCallback((speedKmh: number): boolean => {
    return speedKmh >= 5 && speedKmh <= 60
  }, [])

  const validateNearRoute = useCallback(
    (lat: number, lng: number, lineId: string): boolean => {
      const line = BUS_LINES.find((l) => l.id === lineId)
      if (!line) return false

      const MAX_DISTANCE = 0.005 
      return line.stops.some(
        (stop) =>
          Math.abs(stop.lat - lat) < MAX_DISTANCE &&
          Math.abs(stop.lng - lng) < MAX_DISTANCE
      )
    },
    []
  )

  const startScout = useCallback(
    async (lineId: string) => {
      if (!userLocation) {
        toast({
          title: "Localisation requise",
          description: "Veuillez activer votre GPS pour devenir éclaireur.",
          variant: "destructive",
        })
        return
      }

      const line = BUS_LINES.find(l => l.id === lineId)
      if (!line) return

      let closestStop = line.stops[0]
      let minDist = Infinity
      line.stops.forEach(stop => {
        const d = Math.sqrt(Math.pow(stop.lat - userLocation.lat, 2) + Math.pow(stop.lng - userLocation.lng, 2))
        if (d < minDist) {
          minDist = d
          closestStop = stop
        }
      })

      if (minDist > 0.005) {
        toast({
          title: "Trop éloigné",
          description: `Vous êtes trop loin de la ligne ${line.number}. Rapprochez-vous de l'arrêt "${closestStop.name}" ou choisissez une autre ligne.`,
          variant: "destructive",
        })
        return
      }

      setIsScoutMode(true)
      setScoutLineId(lineId)
      startTripTracking(lineId, closestStop.name)
    },
    [toast, userLocation, startTripTracking]
  )

  const stopScout = useCallback(async () => {
    if (scoutSessionId.current) {
      try {
        await endScoutSession(scoutSessionId.current)
      } catch (err) {
        console.error("Error ending scout session:", err)
      }
      scoutSessionId.current = null
    }

    setIsScoutMode(false)
    
    if (scoutLineId) {
      const line = BUS_LINES.find(l => l.id === scoutLineId)
      let closestStopName = line?.stops[line.stops.length - 1]?.name || "Inconnu"
      
      if (userLocation && line) {
        let minDist = Infinity
        line.stops.forEach(stop => {
          const dist = Math.sqrt(Math.pow(stop.lat - userLocation.lat, 2) + Math.pow(stop.lng - userLocation.lng, 2))
          if (dist < minDist) {
            minDist = dist
            closestStopName = stop.name
          }
        })
      }
      stopTripTracking(closestStopName)
    }
    
    setScoutLineId(null)
  }, [scoutLineId, stopTripTracking, userLocation])

  const getBusesForLine = useCallback(
    (lineId: string) => {
      return buses.filter((bus) => bus.lineId === lineId)
    },
    [buses]
  )

  const getNearestBuses = useCallback(
    (lat: number, lng: number, radiusKm: number = 3) => {
      const radiusDeg = radiusKm / 111 
      return buses.filter(
        (bus) =>
          Math.abs(bus.lat - lat) < radiusDeg &&
          Math.abs(bus.lng - lng) < radiusDeg
      )
    },
    [buses]
  )

  return {
    buses,
    isScoutMode,
    scoutLineId,
    userLocation,
    isOperatingTime: isOperatingTime(),
    startScout,
    stopScout,
    getBusesForLine,
    getNearestBuses,
    validateScoutSpeed,
    validateNearRoute,
    requestLocation,
  }
}
