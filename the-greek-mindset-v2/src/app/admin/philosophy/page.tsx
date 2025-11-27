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
import { PhilosophyItem } from '@/types/admin';
import { Brain, School, Star, ExternalLink, Upload, Download } from 'lucide-react';
import { usePhilosophyData } from '@/hooks/use-philosophy-data';

// Form validation schema
const philosophySchema = z.object({
  philosopher: z.string().min(1, 'Philosopher name is required').max(200, 'Name too long'),
  concept: z.string().min(1, 'Concept is required').max(200, 'Concept too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  quote: z.string().optional().default(''),
  school: z.enum(['pre-socratic', 'classical', 'hellenistic', 'neoplatonic', 'other']),
  timeframe: z.string().min(1, 'Timeframe is required'),
  significance: z.string().min(1, 'Significance is required'),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  relatedConcepts: z.string().optional().default(''),
  featured: z.boolean().default(false),
});

type PhilosophyFormData = z.infer<typeof philosophySchema>;

const columns = [
  {
    key: 'philosopher' as keyof PhilosophyItem,
    label: 'Philosopher',
    sortable: true,
    render: (value: string, item: PhilosophyItem) => (
      <div className="flex items-center gap-3">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.philosopher}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.concept}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'school' as keyof PhilosophyItem,
    label: 'School',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline" className="capitalize">
        {value.replace('-', ' ')}
      </Badge>
    ),
  },
  {
    key: 'timeframe' as keyof PhilosophyItem,
    label: 'Timeframe',
    sortable: true,
    render: (value: string) => (
      <span className="text-sm text-gray-600">{value}</span>
    ),
  },
  {
    key: 'featured' as keyof PhilosophyItem,
    label: 'Featured',
    sortable: true,
    render: (value: boolean) => (
      <div className="flex items-center">
        {value ? (
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        ) : (
          <Star className="h-4 w-4 text-gray-300" />
        )}
      </div>
    ),
  },
];

export default function PhilosophyAdminPage() {
  const { items: philosophyItems, loading, error, createItem, updateItem, deleteItem } = usePhilosophyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PhilosophyItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<PhilosophyItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PhilosophyFormData>({
    resolver: zodResolver(philosophySchema),
    defaultValues: {
      philosopher: '',
      concept: '',
      description: '',
      quote: '',
      school: 'classical',
      timeframe: '',
      significance: '',
      imageUrl: '',
      relatedConcepts: '',
      featured: false,
    },
  });

  // Filter items based on search and type filter
  const filteredItems = philosophyItems.filter(item => {
    const matchesSearch = item.philosopher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.school === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (item: PhilosophyItem) => {
    setEditingItem(item);
    // Transform arrays back to comma-separated strings for the form
    const formData: PhilosophyFormData = {
      philosopher: item.philosopher,
      concept: item.concept,
      description: item.description,
      quote: item.quote || '',
      school: item.school,
      timeframe: item.timeframe,
      significance: item.significance,
      imageUrl: item.imageUrl || '',
      relatedConcepts: item.relatedConcepts ? item.relatedConcepts.join(', ') : '',
      featured: item.featured || false,
    };
    form.reset(formData);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PhilosophyItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (item: PhilosophyItem) => {
    // You can implement view functionality here if needed
    console.log('Viewing item:', item);
  };

  const onSubmit = async (data: PhilosophyFormData) => {
    try {
      setIsSubmitting(true);
      // Transform comma-separated strings to arrays
      const transformedData = {
        ...data,
        relatedConcepts: data.relatedConcepts ? data.relatedConcepts.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
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
      console.error('Error saving philosophy item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingItem) {
      try {
        await deleteItem(deletingItem.id);
        setIsDeleteDialogOpen(false);
        setDeletingItem(null);
      } catch (error) {
        console.error('Error deleting philosophy item:', error);
      }
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(philosophyItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'philosophy-data.json';
    link.click();
  };

  // Calculate statistics
  const stats = {
    total: philosophyItems.length,
    featured: philosophyItems.filter(item => item.featured).length,
    schools: {
      preSocratic: philosophyItems.filter(item => item.school === 'pre-socratic').length,
      classical: philosophyItems.filter(item => item.school === 'classical').length,
      hellenistic: philosophyItems.filter(item => item.school === 'hellenistic').length,
      neoplatonic: philosophyItems.filter(item => item.school === 'neoplatonic').length,
      other: philosophyItems.filter(item => item.school === 'other').length,
    },
  };

  if (error) {
    return (
      <AdminRouteGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading philosophy data</p>
              <p className="text-gray-500">{error}</p>
            </div>
          </div>
        </AdminLayout>
      </AdminRouteGuard>
    );
  }

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Philosophy Management</h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage Greek philosophers, concepts, and teachings
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-greek-blue hover:bg-blue-700 flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Add Philosophy Item
              </Button>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.featured}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Classical</p>
                  <p className="text-3xl font-bold text-green-600">{stats.schools.classical}</p>
                </div>
                <School className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pre-Socratic</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.schools.preSocratic}</p>
                </div>
                <ExternalLink className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search philosophy items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Schools</option>
                  <option value="pre-socratic">Pre-Socratic</option>
                  <option value="classical">Classical</option>
                  <option value="hellenistic">Hellenistic</option>
                  <option value="neoplatonic">Neoplatonic</option>
                  <option value="other">Other</option>
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
              title="Philosophy Items"
              data={filteredItems}
              columns={columns as any}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onAdd={() => setIsFormOpen(true)}
              searchPlaceholder="Search philosophy items..."
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
            title={editingItem ? 'Edit Philosophy Item' : 'Create Philosophy Item'}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Philosopher Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Philosopher/Name *
                  </label>
                  <Input
                    {...form.register('philosopher')}
                    placeholder="e.g., Socrates, Plato"
                    className={form.formState.errors.philosopher ? 'border-red-500' : ''}
                  />
                  {form.formState.errors.philosopher && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.philosopher.message}</p>
                  )}
                </div>

                {/* School Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School *
                  </label>
                  <select
                    {...form.register('school')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      form.formState.errors.school ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="pre-socratic">Pre-Socratic</option>
                    <option value="classical">Classical</option>
                    <option value="hellenistic">Hellenistic</option>
                    <option value="neoplatonic">Neoplatonic</option>
                    <option value="other">Other</option>
                  </select>
                  {form.formState.errors.school && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.school.message}</p>
                  )}
                </div>
              </div>

              {/* Concept Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Concept *
                </label>
                <Input
                  {...form.register('concept')}
                  placeholder="e.g., Socratic Method, Stoicism"
                  className={form.formState.errors.concept ? 'border-red-500' : ''}
                />
                {form.formState.errors.concept && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.concept.message}</p>
                )}
              </div>

              {/* Timeframe Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeframe *
                </label>
                <Input
                  {...form.register('timeframe')}
                  placeholder="e.g., 470-399 BCE"
                  className={form.formState.errors.timeframe ? 'border-red-500' : ''}
                />
                {form.formState.errors.timeframe && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.timeframe.message}</p>
                )}
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

              {/* Significance Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Significance *
                </label>
                <textarea
                  {...form.register('significance')}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.formState.errors.significance ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Why is this important to philosophy?"
                />
                {form.formState.errors.significance && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.significance.message}</p>
                )}
              </div>

              {/* Quote Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Famous Quote
                </label>
                <Input
                  {...form.register('quote')}
                  placeholder="Enter a famous quote (optional)"
                />
              </div>

              {/* Related Concepts Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Concepts
                  <span className="text-gray-500 text-xs ml-1">(comma-separated)</span>
                </label>
                <Input
                  {...form.register('relatedConcepts')}
                  placeholder="e.g., Virtue Ethics, Knowledge, Truth"
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
                  disabled={isSubmitting}
                  className="bg-greek-blue hover:bg-blue-700"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                </Button>
              </div>
            </form>
          </FormModal>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setDeletingItem(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Philosophy Item"
            description={`Are you sure you want to delete "${deletingItem?.philosopher}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
          />
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}