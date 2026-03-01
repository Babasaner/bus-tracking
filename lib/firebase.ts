import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getDatabase, type Database } from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// A value is considered a placeholder if it starts with "your_" or is missing
const isPlaceholder = (v?: string) =>
  !v || v.startsWith("your_") || v === "undefined" || v.trim() === ""

// Check if Firebase is properly configured with real values
export const isFirebaseConfigured = (): boolean => {
  return (
    !isPlaceholder(firebaseConfig.apiKey) &&
    !isPlaceholder(firebaseConfig.projectId) &&
    !isPlaceholder(firebaseConfig.authDomain)
  )
}

// Only initialize Firebase if properly configured
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let rtdb: Database | null = null

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig as Record<string, string>) : getApp()
    auth = getAuth(app)
    db = getFirestore(app)
    rtdb = getDatabase(app)

    // Enable offline persistence
    if (typeof window !== "undefined") {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === "failed-precondition") {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.")
        } else if (err.code === "unimplemented") {
          console.warn("The current browser does not support persistence.")
        }
      })
    }
  } catch (e) {
    console.warn("Firebase initialization failed:", e)
    app = null
    auth = null
    db = null
    rtdb = null
  }
}

export { app, auth, db, rtdb }
export default app
