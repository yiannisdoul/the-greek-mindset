export interface UserWorkout {
  id: string
  userId: string
  name: string
  exercises: {
    exerciseId: string
    name: string
    muscleGroup: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    sets?: number
    reps?: string
    duration?: string
    notes?: string
  }[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  totalExercises: number
  estimatedDuration: number // in minutes
  createdAt: string
  updatedAt: string
}

export interface UserWorkoutPlan {
  id: string
  userId: string
  name: string
  description?: string
  workouts: string[] // Array of workout IDs
  scheduleType: 'daily' | 'weekly' | 'custom'
  schedule?: {
    [day: string]: string // day: workoutId
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}
