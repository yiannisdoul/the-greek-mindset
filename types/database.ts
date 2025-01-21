export interface UserProfile {
    id: string
    name: string
    email: string
    bio?: string
    avatarUrl?: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Article {
    id: string
    title: string
    content: string
    author: string
    authorId: string
    createdAt: Date
    updatedAt: Date
    tags: string[]
    imageUrl?: string
  }
  
  export interface WorkoutPlan {
    id: string
    title: string
    description: string
    difficulty: "beginner" | "intermediate" | "advanced"
    duration: number // in weeks
    exercises: {
      name: string
      sets: number
      reps: number
      restTime: number // in seconds
    }[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
    stock: number
    createdAt: Date
    updatedAt: Date
  }
  
  