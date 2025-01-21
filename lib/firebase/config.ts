import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAh7pSXzmgHZcxgG1Dh_SdObgj9wt4azOc",
  authDomain: "the-greek-mindset.firebaseapp.com",
  projectId: "the-greek-mindset",
  storageBucket: "the-greek-mindset.appspot.com",
  messagingSenderId: "1041293298355",
  appId: "1:1041293298355:web:faf960082e386a17757ec6",
  measurementId: "G-1MS6LKQ80V",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }

