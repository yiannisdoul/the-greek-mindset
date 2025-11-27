// src/hooks/use-auth.ts
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface User {
  uid: string
  email: string
  name: string
  profile?: {
    height?: number
    weight?: number
    age?: number
    gender?: 'male' | 'female' | 'other'
    goals?: 'gain' | 'maintain' | 'lose'
    dietaryPreferences?: string[]
  }
  progress?: {
    history?: number
    geography?: number
    mythology?: number
    philosophy?: number
    overall?: number
  }
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (profile: Partial<User['profile']>) => Promise<void>
  updateProgress: (subject: keyof User['progress'], score: number) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        // Load user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setUser(userData)
          } else {
            // User document doesn't exist, create a basic profile
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              profile: {
                dietaryPreferences: []
              },
              progress: {
                history: 0,
                geography: 0,
                mythology: 0,
                philosophy: 0,
                overall: 0
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            
            // Save to Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
            setUser(newUser)
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return !!userCredential.user
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Create user document in Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: name,
        profile: {
          dietaryPreferences: []
        },
        progress: {
          history: 0,
          geography: 0,
          mythology: 0,
          philosophy: 0,
          overall: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
      
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (profileUpdate: Partial<User['profile']>): Promise<void> => {
    if (user && firebaseUser) {
      try {
        const updatedUser = {
          ...user,
          profile: { ...user.profile, ...profileUpdate },
          updatedAt: new Date().toISOString()
        }
        
        // Update in Firestore
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          profile: updatedUser.profile,
          updatedAt: updatedUser.updatedAt
        })
        
        // Update local state
        setUser(updatedUser)
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }
  }

  const updateProgress = async (subject: keyof User['progress'], score: number): Promise<void> => {
    if (user && user.progress && firebaseUser) {
      try {
        const updatedProgress = { ...user.progress }
        updatedProgress[subject] = score
        
        // Calculate overall progress
        const subjects = ['history', 'geography', 'mythology', 'philosophy'] as const
        const total = subjects.reduce((sum, s) => sum + (updatedProgress[s] || 0), 0)
        updatedProgress.overall = Math.round(total / subjects.length)
        
        const updatedUser = {
          ...user,
          progress: updatedProgress,
          updatedAt: new Date().toISOString()
        }
        
        // Update in Firestore
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          progress: updatedProgress,
          updatedAt: updatedUser.updatedAt
        })
        
        // Update local state
        setUser(updatedUser)
      } catch (error) {
        console.error('Error updating progress:', error)
      }
    }
  }

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updateProgress
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


