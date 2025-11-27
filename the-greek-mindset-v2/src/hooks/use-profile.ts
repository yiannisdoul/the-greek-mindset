'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { 
  profileService, 
  UserProfile, 
  WeightEntry, 
  BodyMeasurement, 
  WorkoutLog, 
  ProgressPhoto 
} from '@/lib/profile-service'

export function useProfile() {
  const { user, firebaseUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([])
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([])
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLog[]>([])
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([])
  const [stats, setStats] = useState<{
    totalWorkouts: number
    totalTimeSpent: number
    averageWorkoutDuration: number
    currentStreak: number
    weightProgress: { start?: number; current?: number; change?: number }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all profile data
  const fetchProfileData = async () => {
    if (!firebaseUser?.uid) return

    try {
      setLoading(true)
      setError(null)
      
      const [
        userProfile,
        weights,
        measurements,
        workouts,
        photos,
        userStats
      ] = await Promise.all([
        profileService.getUserProfile(firebaseUser.uid),
        profileService.getWeightHistory(firebaseUser.uid),
        profileService.getBodyMeasurements(firebaseUser.uid),
        profileService.getWorkoutHistory(firebaseUser.uid),
        profileService.getProgressPhotos(firebaseUser.uid),
        profileService.getUserStats(firebaseUser.uid)
      ])

      setProfile(userProfile)
      setWeightHistory(weights)
      setBodyMeasurements(measurements)
      setWorkoutHistory(workouts)
      setProgressPhotos(photos)
      setStats(userStats)
    } catch (err) {
      console.error('Error fetching profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [firebaseUser?.uid])

  // Profile update operations
  const updateProfile = async (updates: Partial<UserProfile['profile']>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      await profileService.updateProfileSection(firebaseUser.uid, 'profile', {
        ...profile?.profile,
        ...updates
      })
      
      if (profile) {
        setProfile({
          ...profile,
          profile: { ...profile.profile, ...updates },
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const updateProgress = async (progressUpdates: Partial<UserProfile['progress']>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      await profileService.updateProfileSection(firebaseUser.uid, 'progress', {
        ...profile?.progress,
        ...progressUpdates
      })
      
      if (profile) {
        setProfile({
          ...profile,
          progress: { ...profile.progress, ...progressUpdates },
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  const updatePreferences = async (preferences: Partial<UserProfile['profile']['preferences']>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      const updatedProfile = {
        ...profile?.profile,
        preferences: { ...profile?.profile?.preferences, ...preferences }
      }
      
      await profileService.updateProfileSection(firebaseUser.uid, 'profile', updatedProfile)
      
      if (profile) {
        setProfile({
          ...profile,
          profile: updatedProfile,
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  const updateNotificationSettings = async (notifications: Partial<UserProfile['profile']['notifications']>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      const updatedProfile = {
        ...profile?.profile,
        notifications: { ...profile?.profile?.notifications, ...notifications }
      }
      
      await profileService.updateProfileSection(firebaseUser.uid, 'profile', updatedProfile)
      
      if (profile) {
        setProfile({
          ...profile,
          profile: updatedProfile,
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating notifications:', error)
      throw error
    }
  }

  // Weight tracking operations
  const addWeightEntry = async (weight: number, date: string, notes?: string) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      const entryId = await profileService.addWeightEntry({
        userId: firebaseUser.uid,
        weight,
        date,
        notes
      })
      
      // Refresh weight history
      const updatedWeights = await profileService.getWeightHistory(firebaseUser.uid)
      setWeightHistory(updatedWeights)
      
      // Update stats
      const updatedStats = await profileService.getUserStats(firebaseUser.uid)
      setStats(updatedStats)
      
      return entryId
    } catch (error) {
      console.error('Error adding weight entry:', error)
      throw error
    }
  }

  const updateWeightEntry = async (id: string, updates: Partial<WeightEntry>) => {
    try {
      await profileService.updateWeightEntry(id, updates)
      
      // Refresh weight history
      const updatedWeights = await profileService.getWeightHistory(firebaseUser?.uid!)
      setWeightHistory(updatedWeights)
    } catch (error) {
      console.error('Error updating weight entry:', error)
      throw error
    }
  }

  const deleteWeightEntry = async (id: string) => {
    try {
      await profileService.deleteWeightEntry(id)
      
      // Refresh weight history
      const updatedWeights = await profileService.getWeightHistory(firebaseUser?.uid!)
      setWeightHistory(updatedWeights)
      
      // Update stats
      const updatedStats = await profileService.getUserStats(firebaseUser?.uid!)
      setStats(updatedStats)
    } catch (error) {
      console.error('Error deleting weight entry:', error)
      throw error
    }
  }

  // Body measurements operations
  const addBodyMeasurement = async (
    type: BodyMeasurement['type'], 
    measurement: number, 
    date: string, 
    notes?: string
  ) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      const measurementId = await profileService.addBodyMeasurement({
        userId: firebaseUser.uid,
        type,
        measurement,
        date,
        notes
      })
      
      // Refresh measurements
      const updatedMeasurements = await profileService.getBodyMeasurements(firebaseUser.uid)
      setBodyMeasurements(updatedMeasurements)
      
      return measurementId
    } catch (error) {
      console.error('Error adding body measurement:', error)
      throw error
    }
  }

  // Workout logging operations
  const logWorkout = async (workoutData: Omit<WorkoutLog, 'id' | 'userId' | 'createdAt'>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      const workoutId = await profileService.logWorkout({
        userId: firebaseUser.uid,
        ...workoutData
      })
      
      // Refresh workout history
      const updatedWorkouts = await profileService.getWorkoutHistory(firebaseUser.uid)
      setWorkoutHistory(updatedWorkouts)
      
      // Update progress
      const currentProgress = profile?.progress || {}
      await updateProgress({
        ...currentProgress,
        totalWorkoutsCompleted: (currentProgress.totalWorkoutsCompleted || 0) + 1
      })
      
      // Update stats
      const updatedStats = await profileService.getUserStats(firebaseUser.uid)
      setStats(updatedStats)
      
      return workoutId
    } catch (error) {
      console.error('Error logging workout:', error)
      throw error
    }
  }

  // Progress photos operations
  const addProgressPhoto = async (imageUrl: string, type: ProgressPhoto['type'], date: string, notes?: string) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      const photoId = await profileService.addProgressPhoto({
        userId: firebaseUser.uid,
        imageUrl,
        type,
        date,
        notes
      })
      
      // Refresh photos
      const updatedPhotos = await profileService.getProgressPhotos(firebaseUser.uid)
      setProgressPhotos(updatedPhotos)
      
      return photoId
    } catch (error) {
      console.error('Error adding progress photo:', error)
      throw error
    }
  }

  // Utility functions
  const calculateBMI = () => {
    const height = profile?.profile?.height
    const weight = weightHistory[0]?.weight || profile?.profile?.weight
    
    if (height && weight) {
      return (weight / ((height / 100) ** 2)).toFixed(1)
    }
    return null
  }

  const getBMICategory = () => {
    const bmi = calculateBMI()
    if (!bmi) return null
    
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return 'Underweight'
    if (bmiValue < 25) return 'Normal weight'
    if (bmiValue < 30) return 'Overweight'
    return 'Obese'
  }

  const getWeightTrend = () => {
    if (weightHistory.length < 2) return null
    
    const recent = weightHistory.slice(0, 5) // Last 5 entries
    const older = weightHistory.slice(-5) // First 5 entries
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.weight, 0) / recent.length
    const olderAvg = older.reduce((sum, entry) => sum + entry.weight, 0) / older.length
    
    const change = recentAvg - olderAvg
    
    if (Math.abs(change) < 0.5) return 'stable'
    return change > 0 ? 'increasing' : 'decreasing'
  }

  return {
    // Data
    profile,
    weightHistory,
    bodyMeasurements,
    workoutHistory,
    progressPhotos,
    stats,
    loading,
    error,
    
    // Profile operations
    updateProfile,
    updateProgress,
    updatePreferences,
    updateNotificationSettings,
    
    // Weight tracking
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    
    // Body measurements
    addBodyMeasurement,
    
    // Workout logging
    logWorkout,
    
    // Progress photos
    addProgressPhoto,
    
    // Utilities
    calculateBMI,
    getBMICategory,
    getWeightTrend,
    
    // Refresh data
    refreshData: fetchProfileData
  }
}