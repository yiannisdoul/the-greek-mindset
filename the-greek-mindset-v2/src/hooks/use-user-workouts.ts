'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { workoutService } from '@/lib/workout-service'
import { UserWorkout, UserWorkoutPlan } from '@/types/workout'

export function useUserWorkouts() {
  const { user, firebaseUser } = useAuth()
  const [userWorkouts, setUserWorkouts] = useState<UserWorkout[]>([])
  const [workoutPlans, setWorkoutPlans] = useState<UserWorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user workouts
  const fetchUserWorkouts = async () => {
    if (!firebaseUser?.uid) return

    try {
      setLoading(true)
      setError(null)
      const workouts = await workoutService.getUserWorkouts(firebaseUser.uid)
      setUserWorkouts(workouts)
    } catch (err) {
      console.error('Error fetching user workouts:', err)
      setError('Failed to load workouts')
    } finally {
      setLoading(false)
    }
  }

  // Fetch workout plans
  const fetchWorkoutPlans = async () => {
    if (!firebaseUser?.uid) return

    try {
      const plans = await workoutService.getUserWorkoutPlans(firebaseUser.uid)
      setWorkoutPlans(plans)
    } catch (err) {
      console.error('Error fetching workout plans:', err)
    }
  }

  useEffect(() => {
    if (firebaseUser?.uid) {
      fetchUserWorkouts()
      fetchWorkoutPlans()
    }
  }, [firebaseUser?.uid])

  // Create a new workout
  const createWorkout = async (
    name: string, 
    exercises: any[], 
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      setError(null)
      const workoutData = workoutService.createWorkoutFromExercises(
        firebaseUser.uid,
        name,
        exercises,
        difficulty
      )
      
      const workoutId = await workoutService.createUserWorkout(workoutData)
      
      // Refresh the list
      await fetchUserWorkouts()
      
      return workoutId
    } catch (error) {
      console.error('Error creating workout:', error)
      setError('Failed to create workout')
      throw error
    }
  }

  // Add exercise to existing workout
  const addExerciseToWorkout = async (workoutId: string, exercise: any) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      setError(null)
      const exerciseData = {
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        difficulty: exercise.difficulty,
        sets: 3,
        reps: exercise.reps || '10-12',
        duration: exercise.duration,
        notes: exercise.description
      }
      
      await workoutService.addExerciseToWorkout(workoutId, exerciseData)
      
      // Refresh the list
      await fetchUserWorkouts()
    } catch (error) {
      console.error('Error adding exercise to workout:', error)
      setError('Failed to add exercise to workout')
      throw error
    }
  }

  // Remove exercise from workout
  const removeExerciseFromWorkout = async (workoutId: string, exerciseIndex: number) => {
    try {
      setError(null)
      await workoutService.removeExerciseFromWorkout(workoutId, exerciseIndex)
      
      // Refresh the list
      await fetchUserWorkouts()
    } catch (error) {
      console.error('Error removing exercise from workout:', error)
      setError('Failed to remove exercise from workout')
      throw error
    }
  }

  // Update workout
  const updateWorkout = async (workoutId: string, updates: Partial<UserWorkout>) => {
    try {
      setError(null)
      await workoutService.updateUserWorkout(workoutId, updates)
      
      // Refresh the list
      await fetchUserWorkouts()
    } catch (error) {
      console.error('Error updating workout:', error)
      setError('Failed to update workout')
      throw error
    }
  }

  // Delete workout
  const deleteWorkout = async (workoutId: string) => {
    try {
      setError(null)
      await workoutService.deleteUserWorkout(workoutId)
      
      // Refresh the list
      await fetchUserWorkouts()
    } catch (error) {
      console.error('Error deleting workout:', error)
      setError('Failed to delete workout')
      throw error
    }
  }

  // Create workout plan
  const createWorkoutPlan = async (plan: Omit<UserWorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated')
    
    try {
      setError(null)
      const planId = await workoutService.createWorkoutPlan({
        ...plan,
        userId: firebaseUser.uid
      })
      
      // Refresh the list
      await fetchWorkoutPlans()
      
      return planId
    } catch (error) {
      console.error('Error creating workout plan:', error)
      setError('Failed to create workout plan')
      throw error
    }
  }

  return {
    // Data
    userWorkouts,
    workoutPlans,
    loading,
    error,
    
    // Actions
    createWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateWorkout,
    deleteWorkout,
    createWorkoutPlan,
    
    // Refresh
    refreshWorkouts: fetchUserWorkouts,
    refreshPlans: fetchWorkoutPlans
  }
}