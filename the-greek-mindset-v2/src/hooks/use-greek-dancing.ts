import { useState, useEffect } from 'react'
import { danceService } from '@/lib/firestore'
import { DanceItem } from '@/types/admin'

export const useGreekDancing = () => {
  const [items, setItems] = useState<DanceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDances = async () => {
    try {
      setLoading(true)
      setError(null)
      const dances = await danceService.getAll()
      setItems(dances)
    } catch (err) {
      console.error('Error fetching dances:', err)
      setError('Failed to fetch dances')
    } finally {
      setLoading(false)
    }
  }

  const getByType = async (type: string): Promise<DanceItem[]> => {
    try {
      return await danceService.getByType(type)
    } catch (err) {
      console.error('Error fetching dances by type:', err)
      throw new Error('Failed to fetch dances by type')
    }
  }

  const getByOrigin = async (origin: string): Promise<DanceItem[]> => {
    try {
      return await danceService.getByOrigin(origin)
    } catch (err) {
      console.error('Error fetching dances by origin:', err)
      throw new Error('Failed to fetch dances by origin')
    }
  }

  const getByDifficulty = async (difficulty: string): Promise<DanceItem[]> => {
    try {
      return await danceService.getByDifficulty(difficulty)
    } catch (err) {
      console.error('Error fetching dances by difficulty:', err)
      throw new Error('Failed to fetch dances by difficulty')
    }
  }

  const create = async (dance: Omit<DanceItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      const id = await danceService.create(dance)
      await fetchDances() // Refresh the list
      return id
    } catch (err) {
      console.error('Error creating dance:', err)
      setError('Failed to create dance')
      throw err
    }
  }

  const update = async (id: string, dance: Partial<DanceItem>) => {
    try {
      setError(null)
      await danceService.update(id, dance)
      await fetchDances() // Refresh the list
    } catch (err) {
      console.error('Error updating dance:', err)
      setError('Failed to update dance')
      throw err
    }
  }

  const remove = async (id: string) => {
    try {
      setError(null)
      await danceService.delete(id)
      await fetchDances() // Refresh the list
    } catch (err) {
      console.error('Error deleting dance:', err)
      setError('Failed to delete dance')
      throw err
    }
  }

  const getById = async (id: string): Promise<DanceItem | null> => {
    try {
      return await danceService.getById(id)
    } catch (err) {
      console.error('Error fetching dance by ID:', err)
      throw new Error('Failed to fetch dance')
    }
  }

  useEffect(() => {
    fetchDances()
  }, [])

  return {
    items,
    loading,
    error,
    fetchDances,
    getByType,
    getByOrigin,
    getByDifficulty,
    create,
    update,
    remove,
    getById,
  }
}