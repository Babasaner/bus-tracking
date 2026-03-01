"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import type { UserProfile } from "@/lib/firebase-auth"
import { getUsersFromFirestore } from "@/lib/firebase-users"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await getUsersFromFirestore()
      setUsers(data)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "Erreur inconnue lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-[#2d9d5c]" />
            Utilisateurs Inscrits
          </h1>
          <p className="text-sm text-[#8fa3b8]">Gérez les éclaireurs et usagers de l'application.</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1a2535] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#8fa3b8]">Chargement des utilisateurs...</div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-red-500">Erreur : {errorMsg}</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[#8fa3b8]">Aucun utilisateur trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/5 text-xs uppercase text-[#8fa3b8]">
                <tr>
                  <th className="px-6 py-3">Nom (Éclaireur)</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rôle</th>
                  <th className="px-6 py-3">Opérateur Préféré</th>
                  <th className="px-6 py-3">Inscrit le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{user.trackingName}</td>
                    <td className="px-6 py-4 text-[#8fa3b8]">{user.email || "N/A"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role || "user"}
                        onChange={async (e) => {
                          const newRole = e.target.value as "admin" | "user";
                          try {
                            const { updateUserRole } = await import("@/lib/firebase-users");
                            await updateUserRole(user.uid, newRole);
                            setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
                            alert(`Rôle de ${user.trackingName} mis à jour avec succès en ${newRole}`);
                          } catch (err) {
                            alert("Erreur lors de la mise à jour du rôle.");
                          }
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold outline-none cursor-pointer border-none appearance-none text-center ${user.role === 'admin' ? 'bg-[#ef4444]/20 text-[#ef4444]' : 'bg-[#2d9d5c]/20 text-[#2d9d5c]'}`}
                      >
                        <option value="user" className="text-black">User</option>
                        <option value="admin" className="text-black">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">{user.operator || "Aucun"}</td>
                    <td className="px-6 py-4 text-[#8fa3b8]">
                      {user.createdAt ? new Date(user.createdAt as string).toLocaleDateString("fr-FR") : "--"}
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
