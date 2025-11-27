import { useState, useEffect } from 'react';
import { ExerciseItem } from '@/types/admin';
import { exerciseService } from '@/lib/firestore';

interface UseBodyExercisesReturn {
  items: ExerciseItem[];
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  createItem: (item: Omit<ExerciseItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ExerciseItem>;
  updateItem: (id: string, item: Partial<ExerciseItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getByMuscleGroup: (muscleGroup: string) => Promise<ExerciseItem[]>;
}

export function useBodyExercises(): UseBodyExercisesReturn {
  const [items, setItems] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const exerciseItems = await exerciseService.getAll();
      setItems(exerciseItems);
    } catch (err) {
      console.error('Error loading exercise items:', err);
      setError(err instanceof Error ? err.message : 'Failed to load exercise items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<ExerciseItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExerciseItem> => {
    try {
      const id = await exerciseService.create(item);
      const newItem = { 
        ...item, 
        id, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      };
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error('Error creating exercise item:', err);
      const error = err instanceof Error ? err.message : 'Failed to create exercise item';
      setError(error);
      throw new Error(error);
    }
  };

  const updateItem = async (id: string, item: Partial<ExerciseItem>): Promise<void> => {
    try {
      await exerciseService.update(id, item);
      setItems(prev => prev.map(existingItem => 
        existingItem.id === id 
          ? { ...existingItem, ...item, updatedAt: new Date().toISOString() }
          : existingItem
      ));
    } catch (err) {
      console.error('Error updating exercise item:', err);
      const error = err instanceof Error ? err.message : 'Failed to update exercise item';
      setError(error);
      throw new Error(error);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      await exerciseService.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting exercise item:', err);
      const error = err instanceof Error ? err.message : 'Failed to delete exercise item';
      setError(error);
      throw new Error(error);
    }
  };

  const getByMuscleGroup = async (muscleGroup: string): Promise<ExerciseItem[]> => {
    try {
      return await exerciseService.getByMuscleGroup(muscleGroup);
    } catch (err) {
      console.error('Error fetching exercises by muscle group:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch exercises by muscle group');
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
    getByMuscleGroup,
  };
}