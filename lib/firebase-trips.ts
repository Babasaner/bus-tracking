import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { db, isFirebaseConfigured, auth } from "./firebase"

export interface TripRecord {
  id?: string
  userId: string
  operator: "Dem Dikk" | "Tata"
  lineId: string
  lineNumber: string
  direction: "aller" | "retour" | "circulaire"
  departureStop: string
  arrivalStop: string
  startTime: number
  endTime: number
  durationMinutes: number
  createdAt: Timestamp | number
}

// Record a completed trip
export async function recordTrip(
  tripData: Omit<TripRecord, "id" | "userId" | "createdAt" | "durationMinutes">
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false
  
  const user = auth?.currentUser
  if (!user) return false

  const durationMinutes = Math.round((tripData.endTime - tripData.startTime) / 60000)

  try {
    // Trips are stored in a top-level collection to allow admin analytics,
    // queries will filter by userId
    await addDoc(collection(db, "trips"), {
      ...tripData,
      userId: user.uid,
      durationMinutes,
      createdAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error("Error recording trip:", error)
    return false
  }
}

// Get user trip history
export async function getUserTrips(): Promise<TripRecord[]> {
  if (!isFirebaseConfigured() || !db) return []
  
  const user = auth?.currentUser
  if (!user) return []

  try {
    // Requires an index in Firestore: userId ASC, createdAt DESC
    const q = query(
      collection(db, "trips"),
      // where("userId", "==", user.uid), // Uncomment when composite index is created
      orderBy("createdAt", "desc")
    )
    
    const snap = await getDocs(q)
    return snap.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : data.createdAt
        } as TripRecord
      })
      .filter(trip => trip.userId === user.uid) // Fallback client-side filter until index is created
  } catch (error) {
    console.error("Error fetching trips:", error)
    return []
  }
}
