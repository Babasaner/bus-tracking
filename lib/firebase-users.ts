import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { UserProfile } from "./firebase-auth"

export async function getUsersFromFirestore(): Promise<UserProfile[]> {
  if (!isFirebaseConfigured() || !db) return []
  
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  
  return snap.docs.map(d => {
    const data = d.data()
    return {
      uid: d.id,
      email: data.email,
      trackingName: data.trackingName,
      operator: data.operator,
      role: data.role,
      createdAt: data.createdAt ? (data.createdAt as any).toDate?.()?.toISOString() : new Date().toISOString()
    } as UserProfile
  })
}
export async function updateUserRole(uid: string, role: "admin" | "user"): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  const { doc, updateDoc } = await import("firebase/firestore")
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, { role })
}
