"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Bus, Users, LayoutDashboard, LogOut, AlertCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      // Pour les tests de développement, si vous voulez autoriser tout le monde, enlevez cette ligne:
      // router.push("/")
    }
  }, [user, profile, loading, router])

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-[#0f1923] text-[#8fa3b8]">Chargement...</div>
  }

  const navItems = [
    { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
    { name: "Signalements", href: "/admin/reports", icon: AlertCircle },
    { name: "Lignes de Bus", href: "/admin/bus", icon: Bus },
    { name: "Utilisateurs", href: "/admin/users", icon: Users },
  ]

  return (
    <div className="flex h-screen bg-[#0a1118] text-white">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-white/10 bg-[#1a2535] p-4 flex flex-col">
        <div className="mb-8 px-2 flex items-center gap-2 text-[#2d9d5c]">
          <Bus size={24} />
          <h1 className="text-xl font-bold text-white">Administration</h1>
        </div>
        
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#2d9d5c]/20 text-[#2d9d5c]"
                    : "text-[#8fa3b8] hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#8fa3b8] hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Quitter l'administration
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0f1923] p-8">
        {children}
      </main>
    </div>
  )
}
