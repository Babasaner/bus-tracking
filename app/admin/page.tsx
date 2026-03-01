"use client"

import { useEffect, useState } from "react"
import { collection, getCountFromServer, query, where } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { Users, Bus, AlertCircle, Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    lines: 0,
    reports: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!isFirebaseConfigured() || !db) return
      setLoading(true)
      try {
        const [usersSnap, linesSnap, reportsSnap] = await Promise.all([
          getCountFromServer(collection(db, "users")),
          getCountFromServer(collection(db, "bus_lines")),
          getCountFromServer(query(collection(db, "reports"), where("active", "==", true))),
        ])

        setStats({
          users: usersSnap.data().count,
          lines: linesSnap.data().count,
          reports: reportsSnap.data().count,
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: "Utilisateurs Inscrits", value: stats.users, icon: Users, color: "text-[#2d9d5c]" },
    { label: "Lignes de Bus", value: stats.lines, icon: Bus, color: "text-blue-500" },
    { label: "Signalements Actifs", value: stats.reports, icon: AlertCircle, color: "text-[#ef4444]" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
        <p className="text-sm text-[#8fa3b8]">Statistiques en temps réel de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-white/10 bg-[#1a2535]/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-[#8fa3b8]">{card.label}</div>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {loading ? <Loader2 className="animate-spin text-[#8fa3b8]" size={24} /> : card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
