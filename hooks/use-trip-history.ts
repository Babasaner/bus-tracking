"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { recordTrip, getUserTrips, type TripRecord } from "@/lib/firebase-trips"
import { BUS_LINES } from "@/lib/dakar-bus-data"
import { isFirebaseConfigured, auth } from "@/lib/firebase"

interface ActiveTripState {
  lineId: string
  lineNumber: string
  operator: "Dem Dikk" | "Tata"
  direction: "aller" | "retour" | "circulaire"
  departureStop: string
  startTime: number
}

export function useTripHistory() {
  const [history, setHistory] = useState<TripRecord[]>([])
  const [loading, setLoading] = useState(false)
  
  // Track ongoing trip across renders
  const activeTripRef = useRef<ActiveTripState | null>(null)

  // Fetch history
  const loadHistory = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth?.currentUser) return
    setLoading(true)
    const trips = await getUserTrips()
    setHistory(trips)
    setLoading(false)
  }, [])

  // Start a trip (called when user activates Scout Mode)
  const startTripTracking = useCallback((lineId: string, closestStopName: string) => {
    const line = BUS_LINES.find(l => l.id === lineId)
    if (!line) return

    activeTripRef.current = {
      lineId: line.id,
      lineNumber: line.number,
      operator: line.operator as "Dem Dikk" | "Tata",
      // Infer direction based on stop index (simplified)
      direction: "aller", 
      departureStop: closestStopName || line.stops[0].name,
      startTime: Date.now(),
    }
  }, [])

  // End a trip and save to Firebase (called when Scout Mode stops)
  const stopTripTracking = useCallback(async (finalStopName: string) => {
    const trip = activeTripRef.current
    if (!trip) return

    const endTime = Date.now()
    // Only record if trip was longer than 2 minutes to prevent spam
    if (endTime - trip.startTime > 120000) {
      const record = {
        ...trip,
        arrivalStop: finalStopName,
        endTime,
      }
      
      const success = await recordTrip(record)
      if (success) {
        // Optimistic UI update
        const durationMinutes = Math.round((endTime - trip.startTime) / 60000)
        setHistory(prev => [{
          ...record,
          id: `local-${Date.now()}`,
          userId: auth?.currentUser?.uid || "local",
          durationMinutes,
          createdAt: Date.now()
        }, ...prev])
      }
    }
    
    activeTripRef.current = null
  }, [])

  // Only load on mount if configured
  useEffect(() => {
    if (isFirebaseConfigured()) {
      auth?.onAuthStateChanged(user => {
        if (user) loadHistory()
      })
    }
  }, [loadHistory])

  return {
    history,
    loading,
    loadHistory,
    startTripTracking,
    stopTripTracking,
    isTracking: !!activeTripRef.current
  }
}
