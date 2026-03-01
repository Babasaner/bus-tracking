import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { BusLine } from "./dakar-bus-data"

export async function getBusLinesFromFirestore(): Promise<BusLine[]> {
  if (!isFirebaseConfigured() || !db) return []
  const snap = await getDocs(collection(db, "bus_lines"))
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  } as BusLine))
}

export async function addBusLineToFirestore(line: Omit<BusLine, "id">): Promise<string | null> {
  if (!isFirebaseConfigured() || !db) return null
  const docRef = await addDoc(collection(db, "bus_lines"), {
    ...line,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export async function updateBusLineInFirestore(id: string, line: Partial<BusLine>): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  const docRef = doc(db, "bus_lines", id)
  await updateDoc(docRef, line)
}

export async function deleteBusLineFromFirestore(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) return
  await deleteDoc(doc(db, "bus_lines", id))
}
