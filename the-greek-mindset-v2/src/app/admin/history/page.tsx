'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal, ConfirmDialog } from '@/components/admin/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HistoryItem } from '@/types/admin';
import { Calendar, Tag, Star, ExternalLink, Upload, Download } from 'lucide-react';
import { historyService } from '@/lib/firestore';

// Form validation schema
const historySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  period: z.string().min(1, 'Period is required'),
  year: z.number().optional(),
  significance: z.string().min(1, 'Significance is required'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  category: z.enum(['ancient', 'classical', 'hellenistic', 'byzantine', 'modern']),
  featured: z.boolean().default(false),
});

type HistoryFormData = z.infer<typeof historySchema>;

// Mock data - in real app this would come from your backend
const mockHistoryData: HistoryItem[] = [
  {
    id: '1',
    title: 'Battle of Marathon',
    description: 'The famous battle where the Greeks defeated the Persian Empire',
    period: '490 BC',
    year: -490,
    significance: 'Marked the beginning of Greek victory over Persian expansion',
    category: 'ancient',
    featured: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Golden Age of Athens',
    description: 'Period of cultural and political flourishing under Pericles',
    period: '461-429 BC',
    year: -461,
    significance: 'Peak of Athenian democracy, arts, and philosophy',
    category: 'classical',
    featured: true,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    title: 'Alexander the Great Conquests',
    description: 'The expansion of the Greek Empire under Alexander',
    period: '336-323 BC',
    year: -336,
    significance: 'Spread Greek culture throughout the known world',
    category: 'hellenistic',
    featured: false,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

const columns = [
  {
    key: 'title' as keyof HistoryItem,
    label: 'Title',
    sortable: true,
    render: (value: string, item: HistoryItem) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{item.period}</div>
      </div>
    ),
  },
  {
    key: 'category' as keyof HistoryItem,
    label: 'Category',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline" className="capitalize">
        {value}
      </Badge>
    ),
  },
  {
    key: 'featured' as keyof HistoryItem,
    label: 'Status',
    sortable: true,
  },
  {
    key: 'updatedAt' as keyof HistoryItem,
    label: 'Last Updated',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'actions' as keyof HistoryItem,
    label: 'Actions',
    width: 'w-32',
  },
];

export default function HistoryAdminPage() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Firestore on component mount
  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await historyService.getAll();
      setData(items);
    } catch (err) {
      setError('Failed to load history data');
      console.error('Error loading history data:', err);
      // Fallback to localStorage if Firestore fails
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin-history-data');
      if (stored) {
        try {
          const localData = JSON.parse(stored);
          setData(localData);
        } catch (error) {
          console.error('Error parsing stored history data:', error);
          setData(mockHistoryData);
        }
      } else {
        setData(mockHistoryData);
      }
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HistoryFormData>({
    resolver: zodResolver(historySchema),
  });

  const handleAdd = () => {
    setEditingItem(null);
    reset({
      title: '',
      description: '',
      period: '',
      year: undefined,
      significance: '',
      imageUrl: '',
      category: 'ancient',
      featured: false,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: HistoryItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description,
      period: item.period,
      year: item.year,
      significance: item.significance,
      imageUrl: item.imageUrl || '',
      category: item.category,
      featured: item.featured || false,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (item: HistoryItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleFeatured = async (item: HistoryItem) => {
    try {
      const updatedItem = { ...item, featured: !item.featured };
      
      // Update in Firestore
      await historyService.update(item.id!, { featured: updatedItem.featured });
      
      // Update local state
      setData(prev =>
        prev.map(i =>
          i.id === item.id
            ? { ...i, featured: !i.featured, updatedAt: new Date().toISOString() }
            : i
        )
      );
    } catch (error) {
      console.error('Error updating featured status:', error);
      setError('Failed to update featured status');
    }
  };

  // Migration function to move localStorage data to Firestore
  const migrateToFirestore = async () => {
    try {
      setLoading(true);
      await historyService.migrateFromLocalStorage();
      await loadHistoryData(); // Reload data from Firestore
      alert('Successfully migrated data to Firestore!');
    } catch (error) {
      console.error('Migration error:', error);
      setError('Failed to migrate data to Firestore');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: HistoryFormData) => {
    try {
      setLoading(true);
      
      if (editingItem) {
        // Update existing item in Firestore
        await historyService.update(editingItem.id!, formData);
        
        // Update local state
        setData(prev =>
          prev.map(item =>
            item.id === editingItem.id
              ? {
                  ...item,
                  ...formData,
                  updatedAt: new Date().toISOString(),
                }
              : item
          )
        );
      } else {
        // Create new item in Firestore
        const newId = await historyService.create(formData);
        
        // Add to local state
        const newItem: HistoryItem = {
          id: newId,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setData(prev => [newItem, ...prev]);
      }

      setIsFormOpen(false);
      reset();
    } catch (error) {
      console.error('Error saving history item:', error);
      setError('Failed to save history item');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setLoading(true);
      
      // Delete from Firestore
      await historyService.delete(deletingItem.id!);
      
      // Update local state
      setData(prev => prev.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting history item:', error);
      setError('Failed to delete history item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRouteGuard requiredPermission="history.crud">
      <AdminLayout>
        <div className="p-6">
          {/* Header with Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">History Management</h1>
              <p className="text-gray-600 mt-1">Manage historical events, periods, and figures</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={migrateToFirestore}
                variant="outline"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Migrate to Firestore</span>
              </Button>
              <Button
                onClick={loadHistoryData}
                variant="outline" 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Reload Data</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <DataTable
            title="History Management"
            data={data}
            columns={columns}
            searchPlaceholder="Search history items..."
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
          />
          )}

          {/* Form Modal */}
          <FormModal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              reset();
            }}
            title={editingItem ? 'Edit History Item' : 'Add New History Item'}
            size="lg"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="Enter history event title"
                    error={errors.title?.message}
                  />
                </div>

                {/* Period and Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period *
                  </label>
                  <Input
                    {...register('period')}
                    placeholder="e.g., 490 BC, 5th century BC"
                    error={errors.period?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year (numeric)
                  </label>
                  <Input
                    type="number"
                    {...register('year', { valueAsNumber: true })}
                    placeholder="e.g., -490 (for 490 BC)"
                    error={errors.year?.message}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greek-blue focus:outline-none focus:ring-1 focus:ring-greek-blue"
                  >
                    <option value="ancient">Ancient</option>
                    <option value="classical">Classical</option>
                    <option value="hellenistic">Hellenistic</option>
                    <option value="byzantine">Byzantine</option>
                    <option value="modern">Modern</option>
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <Input
                    {...register('imageUrl')}
                    placeholder="https://example.com/image.jpg"
                    error={errors.imageUrl?.message}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greek-blue focus:outline-none focus:ring-1 focus:ring-greek-blue"
                    placeholder="Describe the historical event..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Significance */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Historical Significance *
                  </label>
                  <textarea
                    {...register('significance')}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greek-blue focus:outline-none focus:ring-1 focus:ring-greek-blue"
                    placeholder="Why is this event significant in Greek history?"
                  />
                  {errors.significance && (
                    <p className="text-sm text-red-600 mt-1">{errors.significance.message}</p>
                  )}
                </div>

                {/* Featured */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('featured')}
                      className="rounded border-gray-300 text-greek-blue focus:ring-greek-blue"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Feature this item on the main page
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-greek-blue hover:bg-blue-700"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </FormModal>

          {/* Delete Confirmation */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            title="Delete History Item"
            description={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
          />
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}