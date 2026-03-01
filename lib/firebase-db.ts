import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  Timestamp,
} from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { Report, ReportCategory } from "./report-data"

export interface FirebaseReport {
  id?: string
  category: ReportCategory
  subType: string
  lat: number
  lng: number
  locationName: string
  lineId?: string
  lineNumber?: string
  userId: string
  userName: string
  timestamp: Timestamp | number
  expiresAt: number // epoch ms
  upvotes: number
  active: boolean
  message?: string
  photoUrl?: string
}

export interface FirebaseScout {
  id?: string
  userId: string
  userName: string
  lineId: string
  lat: number
  lng: number
  heading: number
  lastUpdate: number // epoch ms
  active: boolean
}

// Add a new report to Firestore
export async function addReportToFirestore(
  report: Omit<FirebaseReport, "id">
): Promise<string | null> {
  if (!isFirebaseConfigured() || !db) return null
  console.log("Submitting report to Firestore:", report)
  const docRef = await addDoc(collection(db, "reports"), {
    ...report,
    timestamp: serverTimestamp(),
    upvotes: 0,
    active: true,
  })
  return docRef.id
}

// Subscribe to active reports (real-time)
export function subscribeToReports(
  callback: (reports: Report[]) => void
): () => void {
  if (!isFirebaseConfigured() || !db) {
    callback([])
    return () => {}
  }

  const q = query(
    collection(db, "reports"),
    where("active", "==", true),
    orderBy("timestamp", "desc")
  )

  return onSnapshot(q, (snap) => {
    const reports: Report[] = snap.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        category: data.category,
        subType: data.subType,
        lat: data.lat,
        lng: data.lng,
        locationName: data.locationName,
        lineId: data.lineId,
        lineNumber: data.lineNumber,
        userName: data.userName,
        timestamp:
          data.timestamp instanceof Timestamp
            ? data.timestamp.toMillis()
            : data.timestamp,
        expiresAt: data.expiresAt || 0,
        upvotes: data.upvotes || 0,
        active: data.active,
        message: data.message,
        photoUrl: data.photoUrl,
      } as Report
    })
    callback(reports)
  })
}

// Upvote a report
export async function upvoteReportInFirestore(reportId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  await updateDoc(doc(db, "reports", reportId), {
    upvotes: increment(1),
  })
}

// Dismiss a report (set active = false)
export async function dismissReportInFirestore(reportId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  await updateDoc(doc(db, "reports", reportId), {
    active: false,
  })
}

// --- Scout Sessions ---

// Update or create a scout session
export async function updateScoutInFirestore(
  scoutId: string,
  scout: Omit<FirebaseScout, "id">
): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  await updateDoc(doc(db, "scouts", scoutId), {
    ...scout,
    lastUpdate: Date.now()
  })
}

// Add a scout session
export async function addScoutToFirestore(
  scout: Omit<FirebaseScout, "id">
): Promise<string | null> {
  if (!isFirebaseConfigured() || !db) return null
  const docRef = await addDoc(collection(db, "scouts"), {
    ...scout,
    lastUpdate: Date.now(),
    active: true
  })
  return docRef.id
}

// Subscribe to active scouts (real-time)
export function subscribeToScouts(
  callback: (scouts: FirebaseScout[]) => void
): () => void {
  if (!isFirebaseConfigured() || !db) {
    callback([])
    return () => {}
  }

  // Only get scouts updated in the last 5 minutes
  const fiveMinAgo = Date.now() - 5 * 60 * 1000
  const q = query(
    collection(db, "scouts"),
    where("active", "==", true),
    where("lastUpdate", ">=", fiveMinAgo)
  )

  return onSnapshot(q, (snap) => {
    const scouts: FirebaseScout[] = snap.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data
      } as FirebaseScout
    })
    callback(scouts)
  })
}

// End a scout session
export async function endScoutSession(scoutId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  await updateDoc(doc(db, "scouts", scoutId), {
    active: false,
    lastUpdate: Date.now()
  })
}
