'use client'

import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { UserWorkout, UserWorkoutPlan } from '@/types/workout'

class WorkoutService {
  
  // User Workout CRUD Operations
  async createUserWorkout(workout: Omit<UserWorkout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'user_workouts'), {
        ...workout,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating user workout:', error)
      throw new Error('Failed to create workout')
    }
  }

  async getUserWorkouts(userId: string): Promise<UserWorkout[]> {
    try {
      const q = query(
        collection(db, 'user_workouts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as UserWorkout[]
    } catch (error) {
      console.error('Error fetching user workouts:', error)
      throw new Error('Failed to fetch workouts')
    }
  }

  async getUserWorkoutById(id: string): Promise<UserWorkout | null> {
    try {
      const docSnap = await getDoc(doc(db, 'user_workouts', id))
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as UserWorkout
      }
      return null
    } catch (error) {
      console.error('Error fetching user workout:', error)
      throw new Error('Failed to fetch workout')
    }
  }

  async updateUserWorkout(id: string, updates: Partial<UserWorkout>): Promise<void> {
    try {
      await updateDoc(doc(db, 'user_workouts', id), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating user workout:', error)
      throw new Error('Failed to update workout')
    }
  }

  async deleteUserWorkout(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'user_workouts', id))
    } catch (error) {
      console.error('Error deleting user workout:', error)
      throw new Error('Failed to delete workout')
    }
  }

  // Add exercise to existing workout
  async addExerciseToWorkout(workoutId: string, exercise: UserWorkout['exercises'][0]): Promise<void> {
    try {
      const workoutDoc = await this.getUserWorkoutById(workoutId)
      if (!workoutDoc) {
        throw new Error('Workout not found')
      }

      const updatedExercises = [...workoutDoc.exercises, exercise]
      await this.updateUserWorkout(workoutId, {
        exercises: updatedExercises,
        totalExercises: updatedExercises.length,
        estimatedDuration: this.calculateEstimatedDuration(updatedExercises)
      })
    } catch (error) {
      console.error('Error adding exercise to workout:', error)
      throw new Error('Failed to add exercise to workout')
    }
  }

  // Remove exercise from workout
  async removeExerciseFromWorkout(workoutId: string, exerciseIndex: number): Promise<void> {
    try {
      const workoutDoc = await this.getUserWorkoutById(workoutId)
      if (!workoutDoc) {
        throw new Error('Workout not found')
      }

      const updatedExercises = workoutDoc.exercises.filter((_, index) => index !== exerciseIndex)
      await this.updateUserWorkout(workoutId, {
        exercises: updatedExercises,
        totalExercises: updatedExercises.length,
        estimatedDuration: this.calculateEstimatedDuration(updatedExercises)
      })
    } catch (error) {
      console.error('Error removing exercise from workout:', error)
      throw new Error('Failed to remove exercise from workout')
    }
  }

  // Workout Plan CRUD Operations
  async createWorkoutPlan(plan: Omit<UserWorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'user_workout_plans'), {
        ...plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating workout plan:', error)
      throw new Error('Failed to create workout plan')
    }
  }

  async getUserWorkoutPlans(userId: string): Promise<UserWorkoutPlan[]> {
    try {
      const q = query(
        collection(db, 'user_workout_plans'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as UserWorkoutPlan[]
    } catch (error) {
      console.error('Error fetching workout plans:', error)
      throw new Error('Failed to fetch workout plans')
    }
  }

  // Utility functions
  private calculateEstimatedDuration(exercises: UserWorkout['exercises']): number {
    // Basic estimation: 2-3 minutes per exercise + rest time
    const baseTimePerExercise = 2.5 // minutes
    const restTime = exercises.length > 1 ? (exercises.length - 1) * 1 : 0 // 1 minute rest between exercises
    return Math.round(exercises.length * baseTimePerExercise + restTime)
  }

  // Helper method to create a workout from selected exercises
  createWorkoutFromExercises(
    userId: string, 
    name: string, 
    exercises: any[], 
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Omit<UserWorkout, 'id' | 'createdAt' | 'updatedAt'> {
    const workoutExercises = exercises.map(exercise => ({
      exerciseId: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      difficulty: exercise.difficulty,
      sets: this.getDefaultSets(difficulty),
      reps: exercise.reps || this.getDefaultReps(difficulty),
      duration: exercise.duration,
      notes: exercise.description
    }))

    return {
      userId,
      name,
      exercises: workoutExercises,
      difficulty,
      totalExercises: exercises.length,
      estimatedDuration: this.calculateEstimatedDuration(workoutExercises)
    }
  }

  private getDefaultSets(difficulty: 'beginner' | 'intermediate' | 'advanced'): number {
    switch (difficulty) {
      case 'beginner': return 2
      case 'intermediate': return 3
      case 'advanced': return 4
      default: return 3
    }
  }

  private getDefaultReps(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
    switch (difficulty) {
      case 'beginner': return '8-10'
      case 'intermediate': return '10-12'
      case 'advanced': return '12-15'
      default: return '10-12'
    }
  }
}

export const workoutService = new WorkoutService()