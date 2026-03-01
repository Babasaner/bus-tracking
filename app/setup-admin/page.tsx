"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { ShieldCheck, ArrowRight } from "lucide-react"

export default function SetupAdminPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePromote = async () => {
    if (!user || !db) return
    setLoading(true)
    try {
      await setDoc(doc(db, "users", user.uid), { role: "admin" }, { merge: true })
      alert("Succès ! Vous êtes maintenant Administrateur. Actualisez la page.")
      router.push("/admin")
    } catch (err) {
      alert("Erreur: " + err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a1118] text-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès Refusé</h1>
          <p className="text-[#8fa3b8] mb-6">Vous devez être connecté pour devenir Admin.</p>
          <button onClick={() => router.push("/auth")} className="px-4 py-2 bg-[#3b82f6] rounded-lg">Aller à la connexion</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a1118] text-white p-6">
      <div className="max-w-md w-full bg-[#1a2535] p-8 rounded-2xl border border-white/10 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-[#2d9d5c]/20 rounded-full flex items-center justify-center">
            <ShieldCheck size={32} className="text-[#2d9d5c]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Configuration Admin</h1>
        <p className="text-[#8fa3b8] mb-8">
          Bienvenue {profile?.trackingName || user.email}. Cliquez sur le bouton ci-dessous pour octroyer les droits administrateur à votre compte actuel.
        </p>

        {profile?.role === "admin" ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#2d9d5c]/10 text-[#2d9d5c] rounded-lg font-medium">
              Vous êtes déjà Administrateur !
            </div>
            <button 
              onClick={() => router.push("/admin")} 
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-[#0a1118] rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Aller au Backoffice
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={handlePromote} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2d9d5c] text-white rounded-xl font-bold hover:bg-[#1b6b3a] transition-colors disabled:opacity-50"
          >
            {loading ? "Mise à jour..." : "Me nommer Admin !"}
          </button>
        )}
      </div>
    </div>
  )
}
