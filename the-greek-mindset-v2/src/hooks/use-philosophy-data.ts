import { useState, useEffect } from 'react';
import { PhilosophyItem } from '@/types/admin';
import { philosophyService } from '@/lib/firestore';

interface UsePhilosophyDataReturn {
  items: PhilosophyItem[];
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  createItem: (item: Omit<PhilosophyItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PhilosophyItem>;
  updateItem: (id: string, item: Partial<PhilosophyItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export function usePhilosophyData(): UsePhilosophyDataReturn {
  const [items, setItems] = useState<PhilosophyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const philosophyItems = await philosophyService.getAll();
      setItems(philosophyItems);
    } catch (err) {
      console.error('Error loading philosophy items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load philosophy items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<PhilosophyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<PhilosophyItem> => {
    try {
      const newItem = await philosophyService.create(item);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error('Error creating philosophy item:', err);
      const error = err instanceof Error ? err.message : 'Failed to create philosophy item';
      setError(error);
      throw new Error(error);
    }
  };

  const updateItem = async (id: string, item: Partial<PhilosophyItem>): Promise<void> => {
    try {
      await philosophyService.update(id, item);
      setItems(prev => prev.map(existingItem => 
        existingItem.id === id 
          ? { ...existingItem, ...item, updatedAt: new Date().toISOString() }
          : existingItem
      ));
    } catch (err) {
      console.error('Error updating philosophy item:', err);
      const error = err instanceof Error ? err.message : 'Failed to update philosophy item';
      setError(error);
      throw new Error(error);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      await philosophyService.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting philosophy item:', err);
      const error = err instanceof Error ? err.message : 'Failed to delete philosophy item';
      setError(error);
      throw new Error(error);
    }
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return {
    items,
    loading,
    error,
    refreshItems,
    createItem,
    updateItem,
    deleteItem,
  };
}