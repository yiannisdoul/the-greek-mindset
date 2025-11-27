import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'
import { HistoryItem, GeographyItem, MythologyItem, PhilosophyItem, ExerciseItem, DanceItem, RecipeItem } from '@/types/admin'

// Collection names
const COLLECTIONS = {
  HISTORY: 'history',
  GEOGRAPHY: 'geography', 
  MYTHOLOGY: 'mythology',
  PHILOSOPHY: 'philosophy',
  EXERCISES: 'exercises',
  DANCES: 'dances',
  RECIPES: 'recipes',
} as const

// Convert Firestore document to HistoryItem
const convertFirestoreToHistory = (doc: QueryDocumentSnapshot<DocumentData>): HistoryItem => {
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    period: data.period,
    year: data.year,
    significance: data.significance,
    imageUrl: data.imageUrl || '',
    category: data.category,
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
  }
}

// Convert Firestore document to GeographyItem
const convertFirestoreToGeography = (doc: QueryDocumentSnapshot<DocumentData>): GeographyItem => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    type: data.type || 'city',
    coordinates: data.coordinates,
    significance: data.significance || '',
    imageUrl: data.imageUrl || '',
    facts: data.facts || [],
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
  }
}

// Convert Firestore document to MythologyItem
const convertFirestoreToMythology = (doc: QueryDocumentSnapshot<DocumentData>): MythologyItem => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name || '',
    type: data.type || 'god',
    description: data.description || '',
    origin: data.origin || '',
    symbols: data.symbols || [],
    relatedFigures: data.relatedFigures || [],
    stories: data.stories || [],
    imageUrl: data.imageUrl || '',
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
  }
}

// History CRUD operations
export const historyService = {
  // Get all history items
  async getAll(): Promise<HistoryItem[]> {
    try {
      const q = query(collection(db, COLLECTIONS.HISTORY), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(convertFirestoreToHistory)
    } catch (error) {
      console.error('Error fetching history items:', error)
      throw new Error('Failed to fetch history items')
    }
  },

  // Get history item by ID
  async getById(id: string): Promise<HistoryItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.HISTORY, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToHistory(docSnap as QueryDocumentSnapshot<DocumentData>)
      }
      return null
    } catch (error) {
      console.error('Error fetching history item:', error)
      throw new Error('Failed to fetch history item')
    }
  },

  // Create new history item
  async create(item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.HISTORY), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating history item:', error)
      throw new Error('Failed to create history item')
    }
  },

  // Update history item
  async update(id: string, item: Partial<HistoryItem>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.HISTORY, id)
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating history item:', error)
      throw new Error('Failed to update history item')
    }
  },

  // Delete history item
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.HISTORY, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting history item:', error)
      throw new Error('Failed to delete history item')
    }
  },

  // Get featured history items
  async getFeatured(): Promise<HistoryItem[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.HISTORY),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(convertFirestoreToHistory)
    } catch (error) {
      console.error('Error fetching featured history items:', error)
      throw new Error('Failed to fetch featured history items')
    }
  },

  // Search history items
  async search(searchTerm: string): Promise<HistoryItem[]> {
    try {
      // Note: Firestore doesn't have full-text search built-in
      // This is a basic implementation that searches titles
      // For better search, consider using Algolia or similar
      const q = query(collection(db, COLLECTIONS.HISTORY), orderBy('title'))
      const querySnapshot = await getDocs(q)
      
      const allItems = querySnapshot.docs.map(convertFirestoreToHistory)
      
      // Client-side filtering (consider server-side solution for production)
      return allItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.significance.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } catch (error) {
      console.error('Error searching history items:', error)
      throw new Error('Failed to search history items')
    }
  },

  // Migrate localStorage data to Firestore
  async migrateFromLocalStorage(): Promise<void> {
    try {
      if (typeof window === 'undefined') return

      const localData = localStorage.getItem('admin-history-data')
      if (!localData) return

      const items: HistoryItem[] = JSON.parse(localData)
      
      for (const item of items) {
        // Check if item already exists in Firestore
        const existing = await this.getById(item.id!)
        if (!existing) {
          // Remove the id to let Firestore generate a new one
          const { id, ...itemWithoutId } = item
          await this.create(itemWithoutId)
        }
      }

      console.log('Successfully migrated history data from localStorage to Firestore')
    } catch (error) {
      console.error('Error migrating history data:', error)
      throw new Error('Failed to migrate history data')
    }
  }
}

// Geography CRUD operations
export const geographyService = {
  // Get all geography items
  async getAll(): Promise<GeographyItem[]> {
    try {
      console.log('geographyService.getAll: Fetching from collection:', COLLECTIONS.GEOGRAPHY)
      
      const collectionRef = collection(db, COLLECTIONS.GEOGRAPHY)
      const querySnapshot = await getDocs(collectionRef)
      
      console.log('geographyService.getAll: Found', querySnapshot.docs.length, 'documents')
      
      if (querySnapshot.docs.length === 0) {
        console.log('geographyService.getAll: No documents found - make sure to add some in the admin panel')
        return []
      }
      
      const items = querySnapshot.docs.map(convertFirestoreToGeography)
      
      // Sort by creation date (newest first)
      items.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return dateB - dateA
      })
      
      console.log('geographyService.getAll: Successfully loaded', items.length, 'geography items')
      return items
    } catch (error) {
      console.error('geographyService.getAll: Error fetching geography items:', error)
      throw new Error(`Failed to fetch geography items: ${error}`)
    }
  },

  // Get geography item by ID
  async getById(id: string): Promise<GeographyItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.GEOGRAPHY, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToGeography(docSnap as QueryDocumentSnapshot<DocumentData>)
      }
      return null
    } catch (error) {
      console.error('Error fetching geography item:', error)
      throw new Error('Failed to fetch geography item')
    }
  },

  // Get featured geography items
  async getFeatured(): Promise<GeographyItem[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.GEOGRAPHY),
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(convertFirestoreToGeography)
    } catch (error) {
      console.error('Error fetching featured geography items:', error)
      throw new Error('Failed to fetch featured geography items')
    }
  },

  // Get geography items by type
  async getByType(type: GeographyItem['type']): Promise<GeographyItem[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.GEOGRAPHY),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(convertFirestoreToGeography)
    } catch (error) {
      console.error('Error fetching geography items by type:', error)
      throw new Error('Failed to fetch geography items by type')
    }
  },

  // Create new geography item
  async create(item: Omit<GeographyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GeographyItem> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.GEOGRAPHY), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      // Fetch the created document to return the full item
      const createdDoc = await getDoc(docRef)
      if (createdDoc.exists()) {
        return convertFirestoreToGeography(createdDoc as QueryDocumentSnapshot<DocumentData>)
      }
      
      throw new Error('Failed to retrieve created geography item')
    } catch (error) {
      console.error('Error creating geography item:', error)
      throw new Error('Failed to create geography item')
    }
  },

  // Update geography item
  async update(id: string, item: Partial<GeographyItem>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.GEOGRAPHY, id)
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating geography item:', error)
      throw new Error('Failed to update geography item')
    }
  },

  // Delete geography item
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.GEOGRAPHY, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting geography item:', error)
      throw new Error('Failed to delete geography item')
    }
  }
}

// Mythology CRUD operations
export const mythologyService = {
  // Get all mythology items
  async getAll(): Promise<MythologyItem[]> {
    try {
      const q = query(collection(db, COLLECTIONS.MYTHOLOGY), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(convertFirestoreToMythology)
    } catch (error) {
      console.error('Error fetching mythology items:', error)
      throw new Error('Failed to fetch mythology items')
    }
  },

  // Get mythology item by ID
  async getById(id: string): Promise<MythologyItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.MYTHOLOGY, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToMythology(docSnap as QueryDocumentSnapshot<DocumentData>)
      }
      return null
    } catch (error) {
      console.error('Error fetching mythology item:', error)
      throw new Error('Failed to fetch mythology item')
    }
  },

  // Create new mythology item
  async create(item: Omit<MythologyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MythologyItem> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MYTHOLOGY), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      // Fetch the created document to return the complete item
      const createdDoc = await getDoc(docRef)
      if (createdDoc.exists()) {
        return convertFirestoreToMythology(createdDoc as QueryDocumentSnapshot<DocumentData>)
      }
      
      throw new Error('Failed to retrieve created mythology item')
    } catch (error) {
      console.error('Error creating mythology item:', error)
      throw new Error('Failed to create mythology item')
    }
  },

  // Update mythology item
  async update(id: string, item: Partial<MythologyItem>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.MYTHOLOGY, id)
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating mythology item:', error)
      throw new Error('Failed to update mythology item')
    }
  },

  // Delete mythology item
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.MYTHOLOGY, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting mythology item:', error)
      throw new Error('Failed to delete mythology item')
    }
  }
}

// Convert Firestore document to PhilosophyItem
const convertFirestoreToPhilosophy = (doc: QueryDocumentSnapshot<DocumentData>): PhilosophyItem => {
  const data = doc.data()
  return {
    id: doc.id,
    philosopher: data.philosopher || '',
    concept: data.concept || '',
    description: data.description || '',
    quote: data.quote || '',
    school: data.school || 'other',
    timeframe: data.timeframe || '',
    significance: data.significance || '',
    imageUrl: data.imageUrl || '',
    relatedConcepts: data.relatedConcepts || [],
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  }
}

// Philosophy CRUD operations
export const philosophyService = {
  // Get all philosophy items
  async getAll(): Promise<PhilosophyItem[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PHILOSOPHY), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(convertFirestoreToPhilosophy)
    } catch (error) {
      console.error('Error fetching philosophy items:', error)
      throw new Error('Failed to fetch philosophy items')
    }
  },

  // Get philosophy item by ID
  async getById(id: string): Promise<PhilosophyItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PHILOSOPHY, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToPhilosophy(docSnap as QueryDocumentSnapshot<DocumentData>)
      }
      return null
    } catch (error) {
      console.error('Error fetching philosophy item:', error)
      throw new Error('Failed to fetch philosophy item')
    }
  },

  // Create new philosophy item
  async create(item: Omit<PhilosophyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PhilosophyItem> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.PHILOSOPHY), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      // Fetch the created document to return the complete item
      const createdDoc = await getDoc(docRef)
      if (createdDoc.exists()) {
        return convertFirestoreToPhilosophy(createdDoc as QueryDocumentSnapshot<DocumentData>)
      }
      
      throw new Error('Failed to retrieve created philosophy item')
    } catch (error) {
      console.error('Error creating philosophy item:', error)
      throw new Error('Failed to create philosophy item')
    }
  },

  // Update philosophy item
  async update(id: string, item: Partial<PhilosophyItem>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.PHILOSOPHY, id)
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating philosophy item:', error)
      throw new Error('Failed to update philosophy item')
    }
  },

  // Delete philosophy item
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.PHILOSOPHY, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting philosophy item:', error)
      throw new Error('Failed to delete philosophy item')
    }
  }
}

// Convert Firestore document to ExerciseItem
const convertFirestoreToExercise = (doc: QueryDocumentSnapshot<DocumentData>): ExerciseItem => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    muscleGroup: data.muscleGroup || 'chest',
    difficulty: data.difficulty || 'beginner',
    reps: data.reps || '',
    sets: data.sets,
    duration: data.duration,
    instructions: data.instructions || [],
    demoUrl: data.demoUrl || '',
    tips: data.tips || [],
    equipment: data.equipment || '',
    targetMuscles: data.targetMuscles || [],
    benefits: data.benefits || [],
    imageUrl: data.imageUrl || '',
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
  }
}

// Convert Firestore document to DanceItem
const convertFirestoreToDance = (doc: QueryDocumentSnapshot<DocumentData>): DanceItem => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    origin: data.origin || '',
    type: data.type || 'traditional',
    difficulty: data.difficulty || 'beginner',
    music: data.music || '',
    occasions: data.occasions || [],
    steps: data.steps || [],
    demoUrl: data.demoUrl || '',
    instructions: data.instructions || [],
    tips: data.tips || [],
    costumes: data.costumes || [],
    instruments: data.instruments || [],
    history: data.history || '',
    benefits: data.benefits || [],
    imageUrl: data.imageUrl || '',
    featured: data.featured || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
  }
}

// Exercise Service
export const exerciseService = {
  // Get all exercises
  async getAll(): Promise<ExerciseItem[]> {
    try {
      const exerciseQuery = query(
        collection(db, COLLECTIONS.EXERCISES),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(exerciseQuery)
      return querySnapshot.docs.map(convertFirestoreToExercise)
    } catch (error) {
      console.error('Error fetching exercises:', error)
      throw new Error('Failed to fetch exercises')
    }
  },

  // Get exercise by ID
  async getById(id: string): Promise<ExerciseItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.EXERCISES, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToExercise(docSnap as QueryDocumentSnapshot<DocumentData>)
      } else {
        return null
      }
    } catch (error) {
      console.error('Error fetching exercise:', error)
      throw new Error('Failed to fetch exercise')
    }
  },

  // Get exercises by muscle group
  async getByMuscleGroup(muscleGroup: string): Promise<ExerciseItem[]> {
    try {
      const exerciseQuery = query(
        collection(db, COLLECTIONS.EXERCISES),
        where('muscleGroup', '==', muscleGroup),
        orderBy('difficulty', 'asc')
      )
      const querySnapshot = await getDocs(exerciseQuery)
      return querySnapshot.docs.map(convertFirestoreToExercise)
    } catch (error) {
      console.error('Error fetching exercises by muscle group:', error)
      throw new Error('Failed to fetch exercises by muscle group')
    }
  },

  // Create new exercise
  async create(item: Omit<ExerciseItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.EXERCISES), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating exercise:', error)
      throw new Error('Failed to create exercise')
    }
  },

  // Update exercise
  async update(id: string, item: Partial<ExerciseItem>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.EXERCISES, id)
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating exercise:', error)
      throw new Error('Failed to update exercise')
    }
  },

  // Delete exercise
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.EXERCISES, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting exercise:', error)
      throw new Error('Failed to delete exercise')
    }
  }
}

// Dance Service
export const danceService = {
  // Get all dances
  async getAll(): Promise<DanceItem[]> {
    try {
      const danceQuery = query(
        collection(db, COLLECTIONS.DANCES),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(danceQuery)
      return querySnapshot.docs.map(convertFirestoreToDance)
    } catch (error) {
      console.error('Error fetching dances:', error)
      throw new Error('Failed to fetch dances')
    }
  },

  // Get dance by ID
  async getById(id: string): Promise<DanceItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.DANCES, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToDance(docSnap as QueryDocumentSnapshot<DocumentData>)
      } else {
        return null
      }
    } catch (error) {
      console.error('Error fetching dance:', error)
      throw new Error('Failed to fetch dance')
    }
  },

  // Get dances by type
  async getByType(type: string): Promise<DanceItem[]> {
    try {
      const danceQuery = query(
        collection(db, COLLECTIONS.DANCES),
        where('type', '==', type),
        orderBy('difficulty', 'asc')
      )
      const querySnapshot = await getDocs(danceQuery)
      return querySnapshot.docs.map(convertFirestoreToDance)
    } catch (error) {
      console.error('Error fetching dances by type:', error)
      throw new Error('Failed to fetch dances by type')
    }
  },

  // Get dances by origin
  async getByOrigin(origin: string): Promise<DanceItem[]> {
    try {
      const danceQuery = query(
        collection(db, COLLECTIONS.DANCES),
        where('origin', '==', origin),
        orderBy('name', 'asc')
      )
      const querySnapshot = await getDocs(danceQuery)
      return querySnapshot.docs.map(convertFirestoreToDance)
    } catch (error) {
      console.error('Error fetching dances by origin:', error)
      throw new Error('Failed to fetch dances by origin')
    }
  },

  // Get dances by difficulty
  async getByDifficulty(difficulty: string): Promise<DanceItem[]> {
    try {
      const danceQuery = query(
        collection(db, COLLECTIONS.DANCES),
        where('difficulty', '==', difficulty),
        orderBy('name', 'asc')
      )
      const querySnapshot = await getDocs(danceQuery)
      return querySnapshot.docs.map(convertFirestoreToDance)
    } catch (error) {
      console.error('Error fetching dances by difficulty:', error)
      throw new Error('Failed to fetch dances by difficulty')
    }
  },

  // Create new dance
  async create(item: Omit<DanceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.DANCES), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating dance:', error)
      throw new Error('Failed to create dance')
    }
  },

  // Update dance
  async update(id: string, item: Partial<DanceItem>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.DANCES, id)
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating dance:', error)
      throw new Error('Failed to update dance')
    }
  },

  // Delete dance
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.DANCES, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting dance:', error)
      throw new Error('Failed to delete dance')
    }
  }
}

// Convert Firestore document to RecipeItem
const convertFirestoreToRecipe = (doc: QueryDocumentSnapshot<DocumentData>): RecipeItem => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    category: data.category,
    cuisine: data.cuisine,
    difficulty: data.difficulty,
    prepTime: data.prepTime,
    cookTime: data.cookTime,
    totalTime: data.totalTime,
    servings: data.servings,
    ingredients: data.ingredients || [],
    instructions: data.instructions || [],
    nutritionalInfo: data.nutritionalInfo,
    dietaryRestrictions: data.dietaryRestrictions || [],
    nutritionalBenefits: data.nutritionalBenefits || [],
    historicalBackground: data.historicalBackground,
    occasions: data.occasions || [],
    tips: data.tips || [],
    variations: data.variations || [],
    pairing: data.pairing || [],
    equipment: data.equipment || [],
    imageUrl: data.imageUrl || '',
    videoUrl: data.videoUrl || '',
    featured: data.featured || false,
    seasonal: data.seasonal,
    region: data.region,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
  }
}

// Recipe service
export const recipeService = {
  // Get all recipes
  async getAll(): Promise<RecipeItem[]> {
    try {
      const querySnapshot = await getDocs(query(collection(db, COLLECTIONS.RECIPES), orderBy('createdAt', 'desc')))
      return querySnapshot.docs.map(convertFirestoreToRecipe)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      throw new Error('Failed to fetch recipes')
    }
  },

  // Get recipe by ID
  async getById(id: string): Promise<RecipeItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.RECIPES, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return convertFirestoreToRecipe(docSnap as QueryDocumentSnapshot<DocumentData>)
      }
      return null
    } catch (error) {
      console.error('Error fetching recipe:', error)
      throw new Error('Failed to fetch recipe')
    }
  },

  // Get recipes by category
  async getByCategory(category: string): Promise<RecipeItem[]> {
    try {
      const recipeQuery = query(
        collection(db, COLLECTIONS.RECIPES), 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(recipeQuery)
      return querySnapshot.docs.map(convertFirestoreToRecipe)
    } catch (error) {
      console.error('Error fetching recipes by category:', error)
      throw new Error('Failed to fetch recipes by category')
    }
  },

  // Get recipes by cuisine
  async getByCuisine(cuisine: string): Promise<RecipeItem[]> {
    try {
      const recipeQuery = query(
        collection(db, COLLECTIONS.RECIPES), 
        where('cuisine', '==', cuisine),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(recipeQuery)
      return querySnapshot.docs.map(convertFirestoreToRecipe)
    } catch (error) {
      console.error('Error fetching recipes by cuisine:', error)
      throw new Error('Failed to fetch recipes by cuisine')
    }
  },

  // Get recipes by difficulty
  async getByDifficulty(difficulty: string): Promise<RecipeItem[]> {
    try {
      const recipeQuery = query(
        collection(db, COLLECTIONS.RECIPES), 
        where('difficulty', '==', difficulty),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(recipeQuery)
      return querySnapshot.docs.map(convertFirestoreToRecipe)
    } catch (error) {
      console.error('Error fetching recipes by difficulty:', error)
      throw new Error('Failed to fetch recipes by difficulty')
    }
  },

  // Create new recipe
  async create(item: Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.RECIPES), {
        ...item,
        totalTime: item.prepTime + item.cookTime, // Auto-calculate total time
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating recipe:', error)
      throw new Error('Failed to create recipe')
    }
  },

  // Update recipe
  async update(id: string, item: Partial<RecipeItem>): Promise<void> {
    try {
      const updateData = { ...item }
      
      // Auto-calculate total time if prep or cook time is updated
      if (item.prepTime !== undefined || item.cookTime !== undefined) {
        const currentDoc = await this.getById(id)
        if (currentDoc) {
          const prepTime = item.prepTime !== undefined ? item.prepTime : currentDoc.prepTime
          const cookTime = item.cookTime !== undefined ? item.cookTime : currentDoc.cookTime
          updateData.totalTime = prepTime + cookTime
        }
      }
      
      const docRef = doc(db, COLLECTIONS.RECIPES, id)
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating recipe:', error)
      throw new Error('Failed to update recipe')
    }
  },

  // Delete recipe
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.RECIPES, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting recipe:', error)
      throw new Error('Failed to delete recipe')
    }
  }
}