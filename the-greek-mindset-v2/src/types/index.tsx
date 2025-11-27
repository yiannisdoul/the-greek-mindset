
export interface Exercise {
  id: string
  name: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  muscleGroups: string[]
  equipment: string[]
  instructions: string[]
  videoUrl?: string
  imageUrl?: string
  reps?: string
  duration?: string
  progression?: Exercise[]
}

export interface Workout {
  id: string
  name: string
  description: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  exercises: Exercise[]
  restBetweenSets?: number
  restBetweenExercises?: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  subject: 'history' | 'geography' | 'mythology' | 'philosophy'
   category: 'history' | 'geography' | 'mythology' | 'philosophy';
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  imageUrl?: string
}

export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  category: string
  tags: string[]
  imageUrl?: string
  readTime: number
}

export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  rating: number;
  reviews: number;
  tags: string[];
  price: number
  imageUrl: string
  inStock: boolean
  featured?: boolean
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type ProductCategory = 'all' | 'books' | 'fitness' | 'decor' | 'stationery';
export interface WorkoutExercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
}
export interface UserProgress {
  userId: string;
  quizScores: {
    [category: string]: number[];
  };
  workoutHistory: {
    workoutId: string;
    completedAt: Date;
    duration: number;
  }[];
  achievements: string[];
}