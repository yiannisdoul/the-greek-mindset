export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  permissions: string[];
  lastLogin?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  description: string;
  period: string;
  year?: number;
  significance: string;
  imageUrl?: string;
  category: 'ancient' | 'classical' | 'hellenistic' | 'byzantine' | 'modern';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeographyItem {
  id: string;
  name: string;
  description: string;
  type: 'city' | 'region' | 'island' | 'mountain' | 'sea' | 'landmark';
  coordinates?: {
    lat: number;
    lng: number;
  };
  significance: string;
  imageUrl?: string;
  facts?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MythologyItem {
  id: string;
  name: string;
  type: 'god' | 'goddess' | 'hero' | 'monster' | 'story' | 'place';
  description: string;
  origin: string;
  symbols?: string[];
  relatedFigures?: string[];
  stories?: string[];
  imageUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhilosophyItem {
  id: string;
  philosopher: string;
  concept: string;
  description: string;
  quote?: string;
  school: 'pre-socratic' | 'classical' | 'hellenistic' | 'neoplatonic' | 'other';
  timeframe: string;
  significance: string;
  imageUrl?: string;
  relatedConcepts?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  description: string;
  muscleGroup: 'chest' | 'shoulders' | 'arms' | 'back' | 'core' | 'legs';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reps: string;
  sets?: number;
  duration?: string; // For time-based exercises like plank
  instructions: string[];
  demoUrl?: string; // URL for demo video
  tips?: string[];
  equipment?: string;
  targetMuscles: string[];
  benefits?: string[];
  imageUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DanceItem {
  id: string;
  name: string;
  description: string;
  origin: string; // Region or island of origin
  type: 'traditional' | 'folk' | 'ceremonial' | 'festive' | 'wedding' | 'religious';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  music: string; // Traditional music associated
  occasions?: string[]; // When it's typically performed
  steps: string[]; // Basic steps description
  demoUrl?: string; // URL for demo video
  instructions?: string[]; // How to perform the dance
  tips?: string[];
  costumes?: string[]; // Traditional costume descriptions
  instruments?: string[]; // Traditional instruments used
  history?: string; // Historical background
  benefits?: string[]; // Physical/cultural benefits
  imageUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'main' | 'dessert' | 'salad' | 'soup' | 'beverage' | 'bread' | 'snack';
  cuisine: 'mainland' | 'islands' | 'crete' | 'cyprus' | 'pontian' | 'constantinople';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  ingredients: string[]; // List of ingredients with quantities
  instructions: string[]; // Step-by-step cooking instructions
  nutritionalInfo?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
  };
  dietaryRestrictions?: string[]; // vegetarian, vegan, gluten-free, etc.
  nutritionalBenefits?: string[]; // Health benefits
  historicalBackground?: string; // Cultural and historical context
  occasions?: string[]; // When it's typically served
  tips?: string[]; // Cooking tips and tricks
  variations?: string[]; // Recipe variations
  pairing?: string[]; // What to serve it with
  equipment?: string[]; // Special equipment needed
  imageUrl?: string;
  videoUrl?: string; // Cooking demo video
  featured?: boolean;
  seasonal?: string; // spring, summer, fall, winter
  region?: string; // Specific Greek region
  createdAt: string;
  updatedAt: string;
}

export type ContentType = 'history' | 'geography' | 'mythology' | 'philosophy' | 'exercises' | 'dances' | 'recipes';

export interface CrudFormProps<T> {
  item?: T;
  onSubmit: (item: T) => void;
  onCancel: () => void;
  isEditing?: boolean;
}