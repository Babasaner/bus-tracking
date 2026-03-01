import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db, isFirebaseConfigured, auth } from "./firebase"

export type SuggestionType = "new_stop" | "route_correction" | "missing_route"

export interface UserSuggestion {
  id?: string
  userId: string
  userName: string
  type: SuggestionType
  status: "pending" | "approved" | "rejected"
  data: {
    lineId?: string
    lineNumber?: string
    stopName?: string
    lat?: number
    lng?: number
    description?: string
  }
  createdAt: Timestamp | number
}

// Submit a new suggestion for admin review
export async function submitSuggestion(
  suggestionData: Omit<UserSuggestion, "id" | "userId" | "userName" | "status" | "createdAt">
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false
  
  const user = auth?.currentUser
  if (!user) return false

  try {
    await addDoc(collection(db, "suggestions"), {
      userId: user.uid,
      userName: user.displayName || "Anonyme",
      status: "pending",
      ...suggestionData,
      createdAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error submitting suggestion:", error)
    return false
  }
}

// Fetch user's own suggestions (useful for a "My Contributions" page later)
export async function getUserSuggestions(userId: string): Promise<UserSuggestion[]> {
  if (!isFirebaseConfigured() || !db) return []

  try {
    const q = query(
      collection(db, "suggestions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    
    const snap = await getDocs(q)
    return snap.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
      } as UserSuggestion
    })
  } catch (error) {
    console.error("Error fetching user suggestions:", error)
    return []
  }
}
