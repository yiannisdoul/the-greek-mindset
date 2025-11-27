import { useState, useEffect } from 'react';
import { MythologyItem } from '@/types/admin';
import { mythologyService } from '@/lib/firestore';

interface UseMythologyDataReturn {
  items: MythologyItem[];
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  createItem: (item: Omit<MythologyItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MythologyItem>;
  updateItem: (id: string, item: Partial<MythologyItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export function useMythologyData(): UseMythologyDataReturn {
  const [items, setItems] = useState<MythologyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const mythologyItems = await mythologyService.getAll();
      setItems(mythologyItems);
    } catch (err) {
      console.error('Error loading mythology items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mythology items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<MythologyItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MythologyItem> => {
    try {
      const newItem = await mythologyService.create(item);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error('Error creating mythology item:', err);
      const error = err instanceof Error ? err.message : 'Failed to create mythology item';
      setError(error);
      throw new Error(error);
    }
  };

  const updateItem = async (id: string, item: Partial<MythologyItem>): Promise<void> => {
    try {
      await mythologyService.update(id, item);
      setItems(prev => prev.map(existingItem => 
        existingItem.id === id 
          ? { ...existingItem, ...item, updatedAt: new Date().toISOString() }
          : existingItem
      ));
    } catch (err) {
      console.error('Error updating mythology item:', err);
      const error = err instanceof Error ? err.message : 'Failed to update mythology item';
      setError(error);
      throw new Error(error);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      await mythologyService.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting mythology item:', err);
      const error = err instanceof Error ? err.message : 'Failed to delete mythology item';
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