// src/hooks/use-greek-cooking.ts
import { useState, useEffect } from 'react'
import { recipeService } from '@/lib/firestore'
import { RecipeItem } from '@/types/admin'

export interface UseGreekCookingReturn {
  items: RecipeItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getByCategory: (category: string) => Promise<RecipeItem[]>
  getByCuisine: (cuisine: string) => Promise<RecipeItem[]>
  getByDifficulty: (difficulty: string) => Promise<RecipeItem[]>
  create: (item: Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  update: (id: string, item: Partial<RecipeItem>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useGreekCooking = (): UseGreekCookingReturn => {
  const [items, setItems] = useState<RecipeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const recipes = await recipeService.getAll()
      setItems(recipes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchItems()
  }

  const getByCategory = async (category: string): Promise<RecipeItem[]> => {
    try {
      setError(null)
      return await recipeService.getByCategory(category)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch recipes by category'
      setError(errorMsg)
      console.error('Error fetching recipes by category:', err)
      return []
    }
  }

  const getByCuisine = async (cuisine: string): Promise<RecipeItem[]> => {
    try {
      setError(null)
      return await recipeService.getByCuisine(cuisine)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch recipes by cuisine'
      setError(errorMsg)
      console.error('Error fetching recipes by cuisine:', err)
      return []
    }
  }

  const getByDifficulty = async (difficulty: string): Promise<RecipeItem[]> => {
    try {
      setError(null)
      return await recipeService.getByDifficulty(difficulty)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch recipes by difficulty'
      setError(errorMsg)
      console.error('Error fetching recipes by difficulty:', err)
      return []
    }
  }

  const create = async (item: Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      setError(null)
      const id = await recipeService.create(item)
      await fetchItems() // Refresh the list
      return id
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create recipe'
      setError(errorMsg)
      console.error('Error creating recipe:', err)
      throw err
    }
  }

  const update = async (id: string, item: Partial<RecipeItem>): Promise<void> => {
    try {
      setError(null)
      await recipeService.update(id, item)
      await fetchItems() // Refresh the list
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update recipe'
      setError(errorMsg)
      console.error('Error updating recipe:', err)
      throw err
    }
  }

  const remove = async (id: string): Promise<void> => {
    try {
      setError(null)
      await recipeService.delete(id)
      await fetchItems() // Refresh the list
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete recipe'
      setError(errorMsg)
      console.error('Error deleting recipe:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return {
    items,
    loading,
    error,
    refresh,
    getByCategory,
    getByCuisine,
    getByDifficulty,
    create,
    update,
    remove,
  }
}