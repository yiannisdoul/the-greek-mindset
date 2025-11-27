import { useState, useEffect } from 'react'
import { historyService } from '@/lib/firestore'
import { HistoryItem } from '@/types/admin'

export const useHistoryData = () => {
  const [data, setData] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from Firestore
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await historyService.getAll()
      setData(items)
    } catch (err) {
      setError('Failed to load history data')
      console.error('Error loading history data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create new item
  const createItem = async (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      const newId = await historyService.create(item)
      
      const newItem: HistoryItem = {
        id: newId,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setData(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      setError('Failed to create history item')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update existing item
  const updateItem = async (id: string, updates: Partial<HistoryItem>) => {
    try {
      setLoading(true)
      await historyService.update(id, updates)
      
      setData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      )
    } catch (err) {
      setError('Failed to update history item')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      setLoading(true)
      await historyService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError('Failed to delete history item')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Toggle featured status
  const toggleFeatured = async (item: HistoryItem) => {
    try {
      const updatedFeatured = !item.featured
      await historyService.update(item.id!, { featured: updatedFeatured })
      
      setData(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, featured: updatedFeatured, updatedAt: new Date().toISOString() }
            : i
        )
      )
    } catch (err) {
      setError('Failed to update featured status')
      throw err
    }
  }

  // Migrate localStorage data to Firestore
  const migrateFromLocalStorage = async () => {
    try {
      setLoading(true)
      await historyService.migrateFromLocalStorage()
      await loadData() // Reload data from Firestore
    } catch (err) {
      setError('Failed to migrate data to Firestore')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    data,
    loading,
    error,
    setError,
    loadData,
    createItem,
    updateItem,
    deleteItem,
    toggleFeatured,
    migrateFromLocalStorage,
  }
}