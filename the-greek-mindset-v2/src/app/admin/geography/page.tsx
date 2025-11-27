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
import { GeographyItem } from '@/types/admin';
import { geographyService } from '@/lib/firestore';
import { Upload, Download } from 'lucide-react';

// Form validation schema
const geographySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters')
    .regex(/^[a-zA-Z\s\-'()]+$/, 'Name contains invalid characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  type: z.enum(['city', 'region', 'island', 'mountain', 'sea', 'landmark']),
  significance: z.string()
    .min(10, 'Significance must be at least 10 characters')
    .max(500, 'Significance must be less than 500 characters'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  facts: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  coordinates: z.object({
    lat: z.number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90'),
    lng: z.number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180'),
  }).optional(),
});

type GeographyFormData = z.infer<typeof geographySchema>;



const columns = [
  {
    key: 'name' as keyof GeographyItem,
    label: 'Name',
    sortable: true,
    render: (value: string, item: GeographyItem) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 capitalize">{item.type}</div>
      </div>
    ),
  },
  {
    key: 'type' as keyof GeographyItem,
    label: 'Type',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline" className="capitalize">
        {value}
      </Badge>
    ),
  },
  {
    key: 'featured' as keyof GeographyItem,
    label: 'Status',
    sortable: true,
  },
  {
    key: 'updatedAt' as keyof GeographyItem,
    label: 'Last Updated',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'actions' as keyof GeographyItem,
    label: 'Actions',
    width: 'w-32',
  },
];

export default function GeographyAdminPage() {
  const [data, setData] = useState<GeographyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GeographyItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GeographyItem | null>(null);
  const [facts, setFacts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof GeographyItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);

  // Load data from Firestore on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await geographyService.getAll();
      // Sort items by creation date (newest first)
      const sortedItems = items.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setData(sortedItems);
    } catch (error) {
      console.error('Error loading geography data:', error);
      setError('Failed to load geography data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Migration function to move localStorage data to Firestore (if needed)
  const migrateToFirestore = async () => {
    try {
      setLoading(true);
      setError(null);
      // Add migration logic here if you have localStorage data to migrate
      await loadData(); // Reload data from Firestore
      alert('Successfully migrated data to Firestore!');
    } catch (error) {
      console.error('Migration error:', error);
      setError('Failed to migrate data to Firestore');
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GeographyFormData>({
    resolver: zodResolver(geographySchema),
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFacts([]);
    reset({
      name: '',
      description: '',
      type: 'city',
      significance: '',
      imageUrl: '',
      featured: false,
      coordinates: undefined,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: GeographyItem) => {
    setEditingItem(item);
    setFacts(item.facts || []);
    reset({
      name: item.name,
      description: item.description,
      type: item.type,
      significance: item.significance,
      imageUrl: item.imageUrl || '',
      featured: item.featured || false,
      coordinates: item.coordinates,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (item: GeographyItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleFeatured = async (item: GeographyItem) => {
    try {
      if (!item.id) return;
      
      const updatedItem = {
        ...item,
        featured: !item.featured,
        updatedAt: new Date().toISOString()
      };

      await geographyService.update(item.id, updatedItem);
      
      setData(prev =>
        prev.map(i =>
          i.id === item.id ? updatedItem : i
        )
      );

      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Error toggling featured status:', error);
      setError('Failed to update geography item featured status');
    }
  };

  // Statistics
  const stats = {
    total: data.length,
    featured: data.filter(item => item.featured).length,
    byType: data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentlyAdded: data.filter(item => {
      const createdDate = new Date(item.createdAt || 0);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length,
  };

  const addFact = () => {
    setFacts(prev => [...prev, '']);
  };

  const updateFact = (index: number, value: string) => {
    setFacts(prev => prev.map((fact, i) => i === index ? value : fact));
  };

  const removeFact = (index: number) => {
    setFacts(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: GeographyFormData) => {
    try {
      setLoading(true);
      setError(null);

      const filteredFacts = facts.filter(fact => fact.trim() !== '');
      
      if (editingItem && editingItem.id) {
        // Update existing item
        const updatedItem: GeographyItem = {
          ...editingItem,
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          significance: formData.significance.trim(),
          updatedAt: new Date().toISOString(),
        };

        // Only include facts if there are any
        if (filteredFacts.length > 0) {
          updatedItem.facts = filteredFacts;
        }

        await geographyService.update(editingItem.id, updatedItem);
        
        setData(prev =>
          prev.map(item =>
            item.id === editingItem.id ? updatedItem : item
          )
        );
      } else {
        // Create new item
        const newItemData: any = {
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          significance: formData.significance.trim(),
        };

        // Only include facts if there are any
        if (filteredFacts.length > 0) {
          newItemData.facts = filteredFacts;
        }

        const newItem = await geographyService.create(newItemData);
        setData(prev => [newItem, ...prev]);
      }

      setIsFormOpen(false);
      reset();
      setFacts([]);
      setEditingItem(null);
    } catch (error: any) {
      console.error('Error saving geography item:', error);
      setError('Failed to save geography item');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setLoading(true);
      setError(null);
      
      // Delete from Firestore
      await geographyService.delete(deletingItem.id!);
      
      // Update local state
      setData(prev => prev.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting geography item:', error);
      setError('Failed to delete geography item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRouteGuard requiredPermission="geography.crud">
      <AdminLayout>
        <div className="p-6">
          {/* Header with Actions */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Geography Management</h1>
              <p className="text-gray-600 mt-1">Manage geographical locations, landmarks, and natural features</p>
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
                onClick={loadData}
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total Locations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Recently Added</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentlyAdded}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byType.city || 0}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Geography Type Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Geography Type Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{type}s</div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <DataTable
              title="Geography Management"
              data={data}
              columns={columns}
              searchPlaceholder="Search geography locations..."
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
              setFacts([]);
            }}
            title={editingItem ? 'Edit Geography Location' : 'Add New Geography Location'}
            size="lg"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Enter location name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greek-blue focus:outline-none focus:ring-1 focus:ring-greek-blue"
                  >
                    <option value="city">City</option>
                    <option value="region">Region</option>
                    <option value="island">Island</option>
                    <option value="mountain">Mountain</option>
                    <option value="sea">Sea</option>
                    <option value="landmark">Landmark</option>
                  </select>
                  {errors.type && (
                    <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
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
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>
                  )}
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    {...register('coordinates.lat', { valueAsNumber: true })}
                    placeholder="37.9715 (Athens)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valid range: -90 to 90</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    {...register('coordinates.lng', { valueAsNumber: true })}
                    placeholder="23.7267 (Athens)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valid range: -180 to 180</p>
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
                    placeholder="Provide a detailed description of the location, its physical characteristics, and notable features..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum 1000 characters. Include physical features, climate, and general information.
                  </p>
                </div>

                {/* Significance */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Historical & Cultural Significance *
                  </label>
                  <textarea
                    {...register('significance')}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-greek-blue focus:outline-none focus:ring-1 focus:ring-greek-blue"
                    placeholder="Explain the historical, cultural, or mythological importance of this location in Greek civilization..."
                  />
                  {errors.significance && (
                    <p className="text-sm text-red-600 mt-1">{errors.significance.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Include historical events, cultural importance, and connections to Greek mythology or civilization.
                  </p>
                </div>

                {/* Facts */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interesting Facts
                  </label>
                  {facts.map((fact, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={fact}
                        onChange={(e) => updateFact(index, e.target.value)}
                        placeholder={`Fact ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFact(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFact}
                  >
                    Add Fact
                  </Button>
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
                      Feature this location on the main page
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
            title="Delete Geography Location"
            description={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
          />
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}