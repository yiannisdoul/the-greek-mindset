import { useState, useEffect } from 'react'
import { geographyService } from '@/lib/firestore'
import { GeographyItem } from '@/types/admin'

export const useGeographyData = () => {
  const [data, setData] = useState<GeographyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from Firestore
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('useGeographyData: Starting to load data...')
      const items = await geographyService.getAll()
      console.log('useGeographyData: Loaded items:', items)
      setData(items)
    } catch (err) {
      console.error('useGeographyData: Error loading geography data:', err)
      setError('Failed to load geography data')
    } finally {
      setLoading(false)
    }
  }

  // Create new item
  const createItem = async (item: Omit<GeographyItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      const newItem = await geographyService.create(item)
      setData(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      setError('Failed to create geography item')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update existing item
  const updateItem = async (id: string, updates: Partial<GeographyItem>) => {
    try {
      setLoading(true)
      await geographyService.update(id, updates)
      
      setData(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      ))
    } catch (err) {
      setError('Failed to update geography item')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete item
  const deleteItem = async (id: string) => {
    try {
      setLoading(true)
      await geographyService.delete(id)
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError('Failed to delete geography item')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  return {
    items: data,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshData: loadData,
  }
}

// Hook for specific geography item
export const useGeographyItem = (id?: string) => {
  const [item, setItem] = useState<GeographyItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadItem = async () => {
      try {
        setLoading(true)
        setError(null)
        const geographyItem = await geographyService.getById(id)
        setItem(geographyItem)
      } catch (err) {
        setError('Failed to load geography item')
        console.error('Error loading geography item:', err)
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [id])

  return { item, loading, error }
}

// Hook for featured geography items
export const useFeaturedGeography = () => {
  const [items, setItems] = useState<GeographyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const featuredItems = await geographyService.getFeatured()
        setItems(featuredItems)
      } catch (err) {
        setError('Failed to load featured geography items')
        console.error('Error loading featured geography items:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedItems()
  }, [])

  return { items, loading, error }
}