"use client"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, isFirebaseConfigured } from "./firebase"

export interface UserProfile {
  uid: string
  email: string | null
  phone?: string
  trackingName: string
  operator: "Dem Dikk" | "Tata" | null
  role?: "admin" | "user"
  createdAt?: unknown
}

// Generate a random Senegalese tracking name
const TRACKING_ADJECTIVES = ["Rapide", "Ponctuel", "Fidele", "Discret", "Vaillant"]
const TRACKING_NAMES = ["Samba", "Moussa", "Fatou", "Aminata", "Ousmane", "Cheikh", "Awa", "Mamadou"]

export function generateTrackingName(): string {
  const adj = TRACKING_ADJECTIVES[Math.floor(Math.random() * TRACKING_ADJECTIVES.length)]
  const name = TRACKING_NAMES[Math.floor(Math.random() * TRACKING_NAMES.length)]
  return `${adj}_${name}`
}

// Register a new user
export async function signUp(
  email: string,
  password: string,
  trackingName: string,
  phone?: string
): Promise<UserProfile> {
  if (!isFirebaseConfigured() || !auth || !db) {
    throw new Error("FIREBASE_NOT_CONFIGURED")
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const user = credential.user

  await updateProfile(user, { displayName: trackingName })

  const profile: UserProfile = {
    uid: user.uid,
    email: user.email,
    phone: phone || "",
    trackingName,
    operator: null,
    role: "user",
    createdAt: serverTimestamp(),
  }

  await setDoc(doc(db, "users", user.uid), profile)
  return profile
}

// Login existing user
export async function signIn(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error("FIREBASE_NOT_CONFIGURED")
  }
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

// Sign out
export async function signOut(): Promise<void> {
  if (!isFirebaseConfigured() || !auth) return
  await firebaseSignOut(auth)
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured() || !db) return null
  const docRef = doc(db, "users", uid)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return snap.data() as UserProfile
  }
  return null
}

// Update tracking name
export async function updateTrackingName(uid: string, trackingName: string): Promise<void> {
  if (!isFirebaseConfigured() || !db || !auth) return
  await setDoc(doc(db, "users", uid), { trackingName }, { merge: true })
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: trackingName })
  }
}

// Subscribe to auth state changes
export function onAuthChange(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured() || !auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
