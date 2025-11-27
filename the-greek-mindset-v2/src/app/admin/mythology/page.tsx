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
import { MythologyItem } from '@/types/admin';
import { Sparkles, Tag, Star, ExternalLink, Upload, Download } from 'lucide-react';
import { useMythologyData } from '@/hooks/use-mythology-data';

// Form validation schema
const mythologySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  type: z.enum(['god', 'goddess', 'hero', 'monster', 'story', 'place']),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  origin: z.string().min(1, 'Origin is required'),
  symbols: z.string().optional().default(''),
  relatedFigures: z.string().optional().default(''),
  stories: z.string().optional().default(''),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type MythologyFormData = z.infer<typeof mythologySchema>;

const columns = [
  {
    key: 'name' as keyof MythologyItem,
    label: 'Name',
    sortable: true,
    render: (value: string, item: MythologyItem) => (
      <div className="flex items-center gap-3">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 capitalize">{item.type}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'type' as keyof MythologyItem,
    label: 'Type',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline" className="capitalize">
        {value}
      </Badge>
    ),
  },
  {
    key: 'origin' as keyof MythologyItem,
    label: 'Origin',
    sortable: true,
    render: (value: string) => (
      <div className="max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
  },
  {
    key: 'featured' as keyof MythologyItem,
    label: 'Status',
    sortable: true,
    render: (value: boolean) => (
      <div>
        {value && (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>
    ),
  },
];

export default function MythologyAdminPage() {
  const { 
    items: mythologyItems, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useMythologyData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MythologyItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MythologyItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const form = useForm<MythologyFormData>({
    resolver: zodResolver(mythologySchema),
    defaultValues: {
      name: '',
      type: 'god',
      description: '',
      origin: '',
      symbols: '',
      relatedFigures: '',
      stories: '',
      imageUrl: '',
      featured: false,
    },
  });

  // Filter items based on search and type filter
  const filteredItems = mythologyItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !typeFilter || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Statistics
  const stats = {
    total: mythologyItems.length,
    featured: mythologyItems.filter(item => item.featured).length,
    gods: mythologyItems.filter(item => item.type === 'god' || item.type === 'goddess').length,
    heroes: mythologyItems.filter(item => item.type === 'hero' || item.type === 'monster').length,
  };

  const handleCreate = () => {
    setEditingItem(null);
    form.reset();
    setIsFormOpen(true);
  };

  const handleEdit = (item: MythologyItem) => {
    setEditingItem(item);
    // Transform arrays back to comma-separated strings for the form
    const formData: MythologyFormData = {
      name: item.name,
      type: item.type,
      description: item.description,
      origin: item.origin,
      symbols: item.symbols ? item.symbols.join(', ') : '',
      relatedFigures: item.relatedFigures ? item.relatedFigures.join(', ') : '',
      stories: item.stories ? item.stories.join(', ') : '',
      imageUrl: item.imageUrl || '',
      featured: item.featured || false,
    };
    form.reset(formData);
    setIsFormOpen(true);
  };

  const handleDelete = (item: MythologyItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (item: MythologyItem) => {
    // You can implement view functionality here if needed
    console.log('Viewing item:', item);
  };

  const onSubmit = async (data: MythologyFormData) => {
    try {
      // Transform comma-separated strings to arrays
      const transformedData = {
        ...data,
        symbols: data.symbols ? data.symbols.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        relatedFigures: data.relatedFigures ? data.relatedFigures.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        stories: data.stories ? data.stories.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        imageUrl: data.imageUrl || undefined,
      };

      if (editingItem) {
        await updateItem(editingItem.id, transformedData);
      } else {
        await createItem(transformedData);
      }
      setIsFormOpen(false);
      form.reset();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving mythology item:', error);
    }
  };

  const confirmDelete = async () => {
    if (deletingItem) {
      try {
        await deleteItem(deletingItem.id);
        setIsDeleteDialogOpen(false);
        setDeletingItem(null);
      } catch (error) {
        console.error('Error deleting mythology item:', error);
      }
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(mythologyItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mythology-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminRouteGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greek-gold mx-auto mb-4"></div>
              <p className="text-gray-600">Loading mythology data...</p>
            </div>
          </div>
        </AdminLayout>
      </AdminRouteGuard>
    );
  }

  if (error) {
    return (
      <AdminRouteGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center text-red-600">
              <ExternalLink className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Failed to Load Mythology Data</h3>
              <p className="text-sm mt-2">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-greek-gold hover:bg-greek-gold/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        </AdminLayout>
      </AdminRouteGuard>
    );
  }

  const mythologyTypes = [
    { value: '', label: 'All Types' },
    { value: 'god', label: 'Gods' },
    { value: 'goddess', label: 'Goddesses' },
    { value: 'hero', label: 'Heroes' },
    { value: 'monster', label: 'Monsters' },
    { value: 'story', label: 'Stories' },
    { value: 'place', label: 'Places' },
  ];

  const formFields = [
    {
      name: 'name' as const,
      label: 'Name',
      type: 'text' as const,
      placeholder: 'Enter mythology figure name...',
      required: true,
    },
    {
      name: 'type' as const,
      label: 'Type',
      type: 'select' as const,
      options: mythologyTypes.slice(1), // Remove "All Types" option
      required: true,
    },
    {
      name: 'origin' as const,
      label: 'Origin',
      type: 'text' as const,
      placeholder: 'Enter origin or source...',
      required: true,
    },
    {
      name: 'description' as const,
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter detailed description...',
      required: true,
    },
    {
      name: 'symbols' as const,
      label: 'Symbols',
      type: 'array' as const,
      placeholder: 'Add symbols (e.g., Lightning bolt, Eagle)...',
    },
    {
      name: 'relatedFigures' as const,
      label: 'Related Figures',
      type: 'array' as const,
      placeholder: 'Add related figures...',
    },
    {
      name: 'stories' as const,
      label: 'Stories',
      type: 'array' as const,
      placeholder: 'Add related stories...',
    },
    {
      name: 'imageUrl' as const,
      label: 'Image URL',
      type: 'url' as const,
      placeholder: 'https://example.com/image.jpg',
    },
    {
      name: 'featured' as const,
      label: 'Featured',
      type: 'checkbox' as const,
    },
  ];

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
                Mythology Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage Greek mythology figures, stories, and entities
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={handleCreate} className="bg-greek-gold hover:bg-greek-gold/90">
                <Upload className="h-4 w-4 mr-2" />
                Add Mythology Item
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.featured}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gods & Goddesses</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.gods}</p>
                </div>
                <Tag className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Heroes & Monsters</p>
                  <p className="text-3xl font-bold text-green-600">{stats.heroes}</p>
                </div>
                <ExternalLink className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search mythology items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greek-gold"
                >
                  {mythologyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <DataTable
              title="Mythology Items"
              data={filteredItems}
              columns={columns as any}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onAdd={() => setIsFormOpen(true)}
              searchPlaceholder="Search mythology items..."
              isLoading={loading}
            />
          </motion.div>

          {/* Form Modal */}
          <FormModal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingItem(null);
              form.reset();
            }}
            title={editingItem ? 'Edit Mythology Item' : 'Create Mythology Item'}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <Input
                    {...form.register('name')}
                    placeholder="Enter mythology item name"
                    className={form.formState.errors.name ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    {...form.register('type')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      form.formState.errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    <option value="god">God</option>
                    <option value="goddess">Goddess</option>
                    <option value="hero">Hero</option>
                    <option value="monster">Monster</option>
                    <option value="story">Story</option>
                    <option value="place">Place</option>
                  </select>
                  {form.formState.errors.type && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  {...form.register('description')}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.formState.errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter detailed description"
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Origin Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin *
                </label>
                <Input
                  {...form.register('origin')}
                  placeholder="e.g., Ancient Greece, Homer's Iliad"
                  className={form.formState.errors.origin ? 'border-red-500' : ''}
                />
                {form.formState.errors.origin && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.origin.message}</p>
                )}
              </div>

              {/* Symbols Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symbols
                  <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
                </label>
                <Input
                  {...form.register('symbols')}
                  placeholder="e.g., lightning bolt, eagle, oak tree"
                />
              </div>

              {/* Related Figures Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Figures
                  <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
                </label>
                <Input
                  {...form.register('relatedFigures')}
                  placeholder="e.g., Hera, Athena, Poseidon"
                />
              </div>

              {/* Stories Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stories
                  <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
                </label>
                <textarea
                  {...form.register('stories')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., The Trojan War, The Twelve Labors"
                />
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <Input
                  {...form.register('imageUrl')}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className={form.formState.errors.imageUrl ? 'border-red-500' : ''}
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center">
                <input
                  {...form.register('featured')}
                  type="checkbox"
                  id="featured"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured item (will appear prominently on the public page)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-greek-blue hover:bg-blue-700"
                >
                  {form.formState.isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                </Button>
              </div>
            </form>
          </FormModal>

          {/* Delete Confirmation */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setDeletingItem(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Mythology Item"
            description={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
          />
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}
