"use client"

import { BUS_LINES, type BusLine } from "./dakar-bus-data"

const CACHE_KEY = "dakarbus_static_lines_v1"
// 24 hours TTL for static route data
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 

interface CachePayload {
  timestamp: number
  data: BusLine[]
}

/**
 * Gets bus lines from localStorage cache if valid, 
 * otherwise falls back to memory data and caches it.
 * This is the first step towards indexedDB/ServiceWorker caching 
 * for ultra-low mobile data consumption.
 */
export function getCachedBusLines(): BusLine[] {
  if (typeof window === "undefined") return BUS_LINES

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed: CachePayload = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.data
      }
    }

    // Cache miss or expired, update cache
    const payload: CachePayload = {
      timestamp: Date.now(),
      data: BUS_LINES,
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    return BUS_LINES
  } catch (error) {
    console.warn("localStorage cache error:", error)
    return BUS_LINES
  }
}

/**
 * Utility to clear the cache if a forced update is needed
 */
export function clearBusLinesCache() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CACHE_KEY)
  }
}
