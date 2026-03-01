"use client"

import { useState, useCallback, useEffect } from "react"
import type { Report, ReportCategory } from "@/lib/report-data"
import { BUS_LINES } from "@/lib/dakar-bus-data"
import {
  addReportToFirestore,
  subscribeToReports,
  upvoteReportInFirestore,
  dismissReportInFirestore,
} from "@/lib/firebase-db"
import { auth, isFirebaseConfigured } from "@/lib/firebase"

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [newReportToast, setNewReportToast] = useState<Report | null>(null)
  const isConfigured = isFirebaseConfigured()

  // Real-time Firestore subscription
  useEffect(() => {
    if (!isConfigured) return

    const unsubscribe = subscribeToReports((fetchedReports) => {
      // Filter out auto-expired reports on the client side just to be safe
      const now = Date.now()
      const validReports = fetchedReports.filter(
        (r) => r.active && (r.expiresAt === 0 || r.expiresAt > now)
      )

      setReports(validReports)

      // Optional: Check for new reports to show as toast
      // (This is a simplified approach; in production, you'd track lastSeenId)
    })

    return () => unsubscribe()
  }, [isConfigured])

  // Periodic cleanup for locally-expired reports
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setReports((prev) =>
        prev.filter((r) => r.active && (r.expiresAt === 0 || r.expiresAt > now))
      )
    }, 60000) // check every minute
    return () => clearInterval(interval)
  }, [])

  // Add a user report
  const addReport = useCallback(
    async (
      category: ReportCategory,
      subType: string,
      location: { lat: number; lng: number; name: string },
      lineId?: string,
      expiresInHours: number = 2,
      message?: string
    ) => {
      const line = lineId ? BUS_LINES.find((l) => l.id === lineId) : undefined
      
      const now = Date.now()
      const expiresAt = now + expiresInHours * 60 * 60 * 1000

      const newReport: Omit<Report, "id" | "upvotes"> = {
        category,
        subType,
        lat: location.lat,
        lng: location.lng,
        locationName: location.name,
        lineId,
        lineNumber: line?.number,
        userName: auth?.currentUser?.displayName || "Anonyme",
        timestamp: now,
        expiresAt,
        active: true,
        message,
      }

      if (isConfigured) {
        // Optimistic UI update could go here, but since subscribeToReports is very fast,
        // we write to Firestore and let the listener update the state.
        
        // Remove undefined fields to prevent Firestore crash
        const reportData: any = {
          ...newReport,
          userId: auth?.currentUser?.uid || "anonymous",
          upvotes: 1
        }
        Object.keys(reportData).forEach(key => reportData[key] === undefined && delete reportData[key])
        
        await addReportToFirestore(reportData)
      } else {
        // Demo mode fallback — add locally
        const demoReport: Report = {
          ...newReport,
          id: `demo-${now}`,
          upvotes: 1,
        }
        setReports((prev) => [demoReport, ...prev])
        setNewReportToast(demoReport)
        setTimeout(() => setNewReportToast(null), 5000)
      }
    },
    [isConfigured]
  )

  const upvoteReport = useCallback(
    async (reportId: string) => {
      if (isConfigured) {
        await upvoteReportInFirestore(reportId)
      } else {
        // Demo mode
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
        )
      }
    },
    [isConfigured]
  )

  const dismissReport = useCallback(
    async (reportId: string) => {
      if (isConfigured) {
        await dismissReportInFirestore(reportId)
      } else {
        // Demo mode
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, active: false } : r))
        )
      }
    },
    [isConfigured]
  )

  const activeReports = reports.filter((r) => r.active)

  return {
    reports,
    activeReports,
    newReportToast,
    addReport,
    upvoteReport,
    dismissReport,
    setNewReportToast,
  }
}
