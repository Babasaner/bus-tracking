"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Trash2 } from "lucide-react"
import type { Report } from "@/lib/report-data"
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    setLoading(true)
    try {
      if (!isFirebaseConfigured() || !db) return
      // Fetch all reports, not just active ones
      const q = query(collection(db, "reports"), orderBy("timestamp", "desc"))
      const snap = await getDocs(q)
      
      const data: Report[] = snap.docs.map(docSnap => {
        const d = docSnap.data()
        return {
          id: docSnap.id,
          category: d.category,
          subType: d.subType,
          lat: d.lat,
          lng: d.lng,
          locationName: d.locationName,
          lineId: d.lineId,
          lineNumber: d.lineNumber,
          userName: d.userName,
          timestamp: d.timestamp?.toMillis ? d.timestamp.toMillis() : d.timestamp,
          expiresAt: d.expiresAt || 0,
          upvotes: d.upvotes || 0,
          active: d.active,
          message: d.message,
        } as Report
      })
      setReports(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement ce signalement ?")) return
    try {
      if (!db) return
      await deleteDoc(doc(db, "reports", id))
      setReports(reports.filter(r => r.id !== id))
    } catch (err) {
      alert("Erreur lors de la suppression.")
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      if (!db) return
      const { updateDoc } = await import("firebase/firestore")
      await updateDoc(doc(db, "reports", id), { active: !currentStatus })
      setReports(reports.map(r => r.id === id ? { ...r, active: !currentStatus } : r))
    } catch (err) {
      alert("Erreur lors de la mise à jour.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="text-[#ef4444]" />
            Signalements (Alertes)
          </h1>
          <p className="text-sm text-[#8fa3b8]">Gérez les alertes soumises par les utilisateurs.</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a2535] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#8fa3b8]">Chargement des signalements...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-[#8fa3b8]">Aucun signalement trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/5 text-xs uppercase text-[#8fa3b8]">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Auteur</th>
                  <th className="px-6 py-3">Type / Catégorie</th>
                  <th className="px-6 py-3">Lieu</th>
                  <th className="px-6 py-3">Votes</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-[#8fa3b8]">
                      {new Date(report.timestamp).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{report.userName}</div>
                      <div className="text-[10px] text-[#5a7289] font-mono uppercase truncate max-w-[100px]" title={report.userId}>
                        ID: {report.userId?.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{report.subType}</div>
                      <div className="text-xs text-[#8fa3b8] capitalize">{report.category}</div>
                      {report.message && (
                         <div className="mt-1 text-xs italic text-gray-400">"{report.message}"</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {report.locationName}
                      {report.lineNumber && ` (Ligne ${report.lineNumber})`}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#3b82f6]/20 text-[#3b82f6] px-2 py-1 rounded-full font-bold">
                        {report.upvotes}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleActive(report.id, report.active)}
                        className={`rounded-full px-2 py-1 text-xs font-semibold transition-colors ${report.active ? 'bg-[#2d9d5c]/20 text-[#2d9d5c] hover:bg-[#2d9d5c]/40' : 'bg-[#8fa3b8]/20 text-[#8fa3b8] hover:bg-[#8fa3b8]/40'}`}
                      >
                        {report.active ? "Actif" : "Expiré"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-[#8fa3b8] hover:text-[#ef4444] transition-colors rounded-lg hover:bg-[#ef4444]/10"
                        title="Supprimer définitivement"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
