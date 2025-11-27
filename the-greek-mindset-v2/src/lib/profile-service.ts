'use client'

import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Enhanced User Profile Types
export interface UserProfile {
  uid: string
  email: string
  name: string
  profile: {
    height?: number
    weight?: number
    age?: number
    gender?: 'male' | 'female' | 'other'
    goals?: 'gain' | 'maintain' | 'lose'
    dietaryPreferences?: string[]
    activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active'
    fitnessExperience?: 'beginner' | 'intermediate' | 'advanced'
    notifications?: {
      workoutReminders?: boolean
      progressUpdates?: boolean
      newContent?: boolean
      emailNewsletter?: boolean
    }
    preferences?: {
      language?: 'en' | 'el' | 'es' | 'fr'
      units?: 'metric' | 'imperial'
      theme?: 'light' | 'dark' | 'auto'
    }
  }
  progress?: {
    history?: number
    geography?: number
    mythology?: number
    philosophy?: number
    overall?: number
    totalQuizzesTaken?: number
    totalWorkoutsCompleted?: number
    currentStreak?: number
    longestStreak?: number
    totalPoints?: number
    currentLevel?: number
  }
  stats?: {
    totalTimeSpent?: number // in minutes
    lastActiveDate?: string
    joinedDate?: string
    achievements?: string[]
  }
  createdAt: string
  updatedAt: string
}

// Weight Entry for tracking weight changes
export interface WeightEntry {
  id: string
  userId: string
  weight: number
  date: string
  notes?: string
  createdAt: string
}

// Body Measurement Entry
export interface BodyMeasurement {
  id: string
  userId: string
  type: 'waist' | 'chest' | 'arms' | 'thighs' | 'hips' | 'neck'
  measurement: number // in cm
  date: string
  notes?: string
  createdAt: string
}

// Progress Photo
export interface ProgressPhoto {
  id: string
  userId: string
  imageUrl: string
  type: 'front' | 'side' | 'back'
  date: string
  notes?: string
  createdAt: string
}

// Workout Log Entry
export interface WorkoutLog {
  id: string
  userId: string
  workoutName: string
  duration: number // in minutes
  caloriesBurned?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  exercises: {
    name: string
    sets?: number
    reps?: number
    duration?: number // for time-based exercises
    weight?: number
  }[]
  notes?: string
  completedAt: string
  createdAt: string
}

class ProfileService {
  
  // User Profile CRUD Operations
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  }

  async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = new Date().toISOString()
      const userProfile: UserProfile = {
        ...profile,
        createdAt: now,
        updatedAt: now
      }
      await setDoc(doc(db, 'users', profile.uid), userProfile)
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw new Error('Failed to create user profile')
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  }

  async updateProfileSection(uid: string, section: keyof UserProfile, data: any): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        [section]: data,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating profile section:', error)
      throw new Error('Failed to update profile section')
    }
  }

  // Weight Tracking Operations
  async addWeightEntry(entry: Omit<WeightEntry, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'weight_entries'), {
        ...entry,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding weight entry:', error)
      throw new Error('Failed to add weight entry')
    }
  }

  async getWeightHistory(userId: string, limitCount: number = 50): Promise<WeightEntry[]> {
    try {
      const q = query(
        collection(db, 'weight_entries'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WeightEntry[]
    } catch (error) {
      console.error('Error fetching weight history:', error)
      throw new Error('Failed to fetch weight history')
    }
  }

  async updateWeightEntry(id: string, updates: Partial<WeightEntry>): Promise<void> {
    try {
      await updateDoc(doc(db, 'weight_entries', id), updates)
    } catch (error) {
      console.error('Error updating weight entry:', error)
      throw new Error('Failed to update weight entry')
    }
  }

  async deleteWeightEntry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'weight_entries', id))
    } catch (error) {
      console.error('Error deleting weight entry:', error)
      throw new Error('Failed to delete weight entry')
    }
  }

  // Body Measurements Operations
  async addBodyMeasurement(measurement: Omit<BodyMeasurement, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'body_measurements'), {
        ...measurement,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding body measurement:', error)
      throw new Error('Failed to add body measurement')
    }
  }

  async getBodyMeasurements(userId: string, type?: string): Promise<BodyMeasurement[]> {
    try {
      let q = query(
        collection(db, 'body_measurements'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      )
      
      if (type) {
        q = query(q, where('type', '==', type))
      }
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BodyMeasurement[]
    } catch (error) {
      console.error('Error fetching body measurements:', error)
      throw new Error('Failed to fetch body measurements')
    }
  }

  // Workout Logging Operations
  async logWorkout(workout: Omit<WorkoutLog, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'workout_logs'), {
        ...workout,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error logging workout:', error)
      throw new Error('Failed to log workout')
    }
  }

  async getWorkoutHistory(userId: string, limitCount: number = 20): Promise<WorkoutLog[]> {
    try {
      const q = query(
        collection(db, 'workout_logs'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkoutLog[]
    } catch (error) {
      console.error('Error fetching workout history:', error)
      throw new Error('Failed to fetch workout history')
    }
  }

  // Progress Photos Operations
  async addProgressPhoto(photo: Omit<ProgressPhoto, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'progress_photos'), {
        ...photo,
        createdAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding progress photo:', error)
      throw new Error('Failed to add progress photo')
    }
  }

  async getProgressPhotos(userId: string): Promise<ProgressPhoto[]> {
    try {
      const q = query(
        collection(db, 'progress_photos'),
        where('userId', '==', userId),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProgressPhoto[]
    } catch (error) {
      console.error('Error fetching progress photos:', error)
      throw new Error('Failed to fetch progress photos')
    }
  }

  // Statistics and Analytics
  async getUserStats(userId: string): Promise<{
    totalWorkouts: number
    totalTimeSpent: number
    averageWorkoutDuration: number
    currentStreak: number
    weightProgress: { start?: number; current?: number; change?: number }
  }> {
    try {
      const [workoutHistory, weightHistory] = await Promise.all([
        this.getWorkoutHistory(userId, 100),
        this.getWeightHistory(userId, 100)
      ])

      const totalWorkouts = workoutHistory.length
      const totalTimeSpent = workoutHistory.reduce((sum, workout) => sum + workout.duration, 0)
      const averageWorkoutDuration = totalWorkouts > 0 ? totalTimeSpent / totalWorkouts : 0

      // Calculate current streak (consecutive workout days)
      let currentStreak = 0
      const today = new Date()
      const sortedWorkouts = workoutHistory.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      
      for (let i = 0; i < sortedWorkouts.length; i++) {
        const workoutDate = new Date(sortedWorkouts[i].completedAt)
        const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === i) {
          currentStreak++
        } else {
          break
        }
      }

      // Weight progress
      const weightProgress = {
        start: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : undefined,
        current: weightHistory.length > 0 ? weightHistory[0].weight : undefined,
        change: weightHistory.length >= 2 ? 
          weightHistory[0].weight - weightHistory[weightHistory.length - 1].weight : undefined
      }

      return {
        totalWorkouts,
        totalTimeSpent,
        averageWorkoutDuration: Math.round(averageWorkoutDuration),
        currentStreak,
        weightProgress
      }
    } catch (error) {
      console.error('Error calculating user stats:', error)
      throw new Error('Failed to calculate user stats')
    }
  }
}

export const profileService = new ProfileService()