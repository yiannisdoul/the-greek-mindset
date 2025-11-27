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
import { DanceItem } from '@/types/admin';
import { Music, Play, MapPin, Users, Clock, Plus, Trash2 } from 'lucide-react';
import { useGreekDancing } from '@/hooks/use-greek-dancing';

// Form validation schema
const danceSchema = z.object({
  name: z.string().min(1, 'Dance name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  origin: z.string().min(1, 'Origin is required').max(200, 'Origin too long'),
  type: z.enum(['traditional', 'folk', 'ceremonial', 'festive', 'wedding', 'religious']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  music: z.string().min(1, 'Associated music is required').max(200, 'Music name too long'),
  occasions: z.array(z.string()).optional(),
  steps: z.array(z.string()).min(1, 'At least one step description is required'),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  instructions: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
  costumes: z.array(z.string()).optional(),
  instruments: z.array(z.string()).optional(),
  history: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type DanceFormData = z.infer<typeof danceSchema>;

const columns = [
  {
    key: 'name' as keyof DanceItem,
    label: 'Dance',
    sortable: true,
    render: (value: string, item: DanceItem) => (
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
          <div className="text-sm text-gray-500">{item.origin}</div>
        </div>
      </div>
    )
  },
  {
    key: 'type' as keyof DanceItem,
    label: 'Type',
    sortable: true,
    render: (value: string) => (
      <Badge variant={
        value === 'traditional' ? 'default' :
        value === 'folk' ? 'secondary' :
        value === 'ceremonial' ? 'outline' :
        value === 'festive' ? 'success' :
        value === 'wedding' ? 'warning' : 'destructive'
      }>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  {
    key: 'difficulty' as keyof DanceItem,
    label: 'Difficulty',
    sortable: true,
    render: (value: string) => (
      <Badge variant={
        value === 'beginner' ? 'success' :
        value === 'intermediate' ? 'warning' : 'destructive'
      }>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  {
    key: 'music' as keyof DanceItem,
    label: 'Music',
    sortable: true,
    render: (value: string, item: DanceItem) => (
      <div>
        <div className="text-sm font-medium">{value}</div>
        {item.instruments && item.instruments.length > 0 && (
          <div className="text-xs text-gray-500">{item.instruments.slice(0, 2).join(', ')}</div>
        )}
      </div>
    )
  },
  {
    key: 'demoUrl' as keyof DanceItem,
    label: 'Demo',
    render: (value: string) => value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        <Play className="h-4 w-4" />
      </a>
    ) : (
      <span className="text-gray-400">No demo</span>
    )
  },
  {
    key: 'featured' as keyof DanceItem,
    label: 'Featured',
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'outline'}>
        {value ? 'Yes' : 'No'}
      </Badge>
    )
  }
];

export default function AdminDancesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDance, setSelectedDance] = useState<DanceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const { items: dances, loading, create, update, remove } = useGreekDancing();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<DanceFormData>({
    resolver: zodResolver(danceSchema),
    defaultValues: {
      type: 'traditional',
      difficulty: 'beginner',
      occasions: [''],
      steps: [''],
      instructions: [''],
      tips: [''],
      costumes: [''],
      instruments: [''],
      benefits: [''],
      featured: false,
    }
  });

  // Statistics
  const totalDances = dances.length;
  const dancesByType = dances.reduce((acc, dance) => {
    acc[dance.type] = (acc[dance.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dancesWithDemo = dances.filter(dance => dance.demoUrl).length;
  const featuredDances = dances.filter(dance => dance.featured).length;

  // Filtered dances
  const filteredDances = dances.filter(dance => {
    const matchesSearch = dance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dance.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dance.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || dance.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'all' || dance.difficulty === difficultyFilter;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  // Add/remove array field handlers
  const addArrayField = (fieldName: keyof DanceFormData) => {
    const currentValue = watch(fieldName) as string[] || [];
    setValue(fieldName, [...currentValue, ''] as any);
  };

  const removeArrayField = (fieldName: keyof DanceFormData, index: number) => {
    const currentValue = watch(fieldName) as string[] || [];
    setValue(fieldName, currentValue.filter((_, i) => i !== index) as any);
  };

  const handleCreate = async (data: DanceFormData) => {
    try {
      // Filter out empty strings from arrays
      const processedData = {
        ...data,
        occasions: data.occasions?.filter(item => item.trim()) || [],
        steps: data.steps.filter(item => item.trim()),
        instructions: data.instructions?.filter(item => item.trim()) || [],
        tips: data.tips?.filter(item => item.trim()) || [],
        costumes: data.costumes?.filter(item => item.trim()) || [],
        instruments: data.instruments?.filter(item => item.trim()) || [],
        benefits: data.benefits?.filter(item => item.trim()) || [],
      };
      
      await create(processedData);
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating dance:', error);
    }
  };

  const handleUpdate = async (data: DanceFormData) => {
    if (!selectedDance) return;
    
    try {
      // Filter out empty strings from arrays
      const processedData = {
        ...data,
        occasions: data.occasions?.filter(item => item.trim()) || [],
        steps: data.steps.filter(item => item.trim()),
        instructions: data.instructions?.filter(item => item.trim()) || [],
        tips: data.tips?.filter(item => item.trim()) || [],
        costumes: data.costumes?.filter(item => item.trim()) || [],
        instruments: data.instruments?.filter(item => item.trim()) || [],
        benefits: data.benefits?.filter(item => item.trim()) || [],
      };
      
      await update(selectedDance.id, processedData);
      setIsEditModalOpen(false);
      setSelectedDance(null);
      reset();
    } catch (error) {
      console.error('Error updating dance:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedDance) return;
    
    try {
      await remove(selectedDance.id);
      setIsDeleteDialogOpen(false);
      setSelectedDance(null);
    } catch (error) {
      console.error('Error deleting dance:', error);
    }
  };

  const handleEdit = (dance: DanceItem) => {
    setSelectedDance(dance);
    
    // Populate form with dance data
    reset({
      name: dance.name,
      description: dance.description,
      origin: dance.origin,
      type: dance.type,
      difficulty: dance.difficulty,
      music: dance.music,
      occasions: dance.occasions?.length ? dance.occasions : [''],
      steps: dance.steps.length ? dance.steps : [''],
      demoUrl: dance.demoUrl || '',
      instructions: dance.instructions?.length ? dance.instructions : [''],
      tips: dance.tips?.length ? dance.tips : [''],
      costumes: dance.costumes?.length ? dance.costumes : [''],
      instruments: dance.instruments?.length ? dance.instruments : [''],
      history: dance.history || '',
      benefits: dance.benefits?.length ? dance.benefits : [''],
      imageUrl: dance.imageUrl || '',
      featured: dance.featured || false,
    });
    
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (dance: DanceItem) => {
    setSelectedDance(dance);
    setIsDeleteDialogOpen(true);
  };

  const isEdit = !!selectedDance && isEditModalOpen;

  return (
    <>
      {/* Form Modal */}
      <FormModal
        isOpen={isEdit ? isEditModalOpen : isCreateModalOpen}
        onClose={() => {
          if (isEdit) {
            setIsEditModalOpen(false);
            setSelectedDance(null);
          } else {
            setIsCreateModalOpen(false);
          }
          reset();
        }}
        title={isEdit ? 'Edit Dance' : 'Create New Dance'}
      >
        <form onSubmit={handleSubmit(isEdit ? handleUpdate : handleCreate)} className="space-y-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dance Name *
              </label>
              <Input
                {...register('name')}
                placeholder="e.g. Sirtaki, Kalamatianos"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin *
              </label>
              <Input
                {...register('origin')}
                placeholder="e.g. Crete, Macedonia, Cyclades"
                className={errors.origin ? 'border-red-500' : ''}
              />
              {errors.origin && (
                <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                {...register('type')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="traditional">Traditional</option>
                <option value="folk">Folk</option>
                <option value="ceremonial">Ceremonial</option>
                <option value="festive">Festive</option>
                <option value="wedding">Wedding</option>
                <option value="religious">Religious</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty *
              </label>
              <select
                {...register('difficulty')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traditional Music *
              </label>
              <Input
                {...register('music')}
                placeholder="e.g. Zeibekiko, Hasapiko"
                className={errors.music ? 'border-red-500' : ''}
              />
              {errors.music && (
                <p className="mt-1 text-sm text-red-600">{errors.music.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Historical Background
              </label>
              <textarea
                {...register('history')}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Brief history of the dance..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={`w-full p-2 border border-gray-300 rounded-md ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Describe the dance, its characteristics, and cultural significance..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demo Video URL
              </label>
              <Input
                {...register('demoUrl')}
                placeholder="https://youtube.com/watch?v=..."
                className={errors.demoUrl ? 'border-red-500' : ''}
              />
              {errors.demoUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.demoUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <Input
                {...register('imageUrl')}
                placeholder="https://example.com/image.jpg"
                className={errors.imageUrl ? 'border-red-500' : ''}
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          {/* Dynamic Arrays */}
          <div className="space-y-4">
            {/* Steps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dance Steps *
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('steps')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              {(watch('steps') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`steps.${index}`)}
                    placeholder={`Step ${index + 1}...`}
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('steps', index)}
                    size="sm"
                    variant="outline"
                    disabled={(watch('steps') || []).length <= 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Occasions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Occasions
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('occasions')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Occasion
                </Button>
              </div>
              {(watch('occasions') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`occasions.${index}`)}
                    placeholder="e.g. Weddings, Festivals, Easter..."
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('occasions', index)}
                    size="sm"
                    variant="outline"
                    disabled={(watch('occasions') || []).length <= 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instructions
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('instructions')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Instruction
                </Button>
              </div>
              {(watch('instructions') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`instructions.${index}`)}
                    placeholder="How to perform this dance step..."
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('instructions', index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tips
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('tips')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tip
                </Button>
              </div>
              {(watch('tips') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`tips.${index}`)}
                    placeholder="Dance tip..."
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('tips', index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Costumes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Traditional Costumes
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('costumes')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Costume
                </Button>
              </div>
              {(watch('costumes') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`costumes.${index}`)}
                    placeholder="Traditional costume description..."
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('costumes', index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Instruments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Traditional Instruments
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('instruments')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Instrument
                </Button>
              </div>
              {(watch('instruments') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`instruments.${index}`)}
                    placeholder="e.g. Bouzouki, Clarinet, Violin..."
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('instruments', index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Benefits
                </label>
                <Button
                  type="button"
                  onClick={() => addArrayField('benefits')}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Benefit
                </Button>
              </div>
              {(watch('benefits') || ['']).map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    {...register(`benefits.${index}`)}
                    placeholder="Cultural or physical benefit..."
                  />
                  <Button
                    type="button"
                    onClick={() => removeArrayField('benefits', index)}
                    size="sm"
                    variant="outline"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              {...register('featured')}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Mark as Featured Dance
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isEdit) {
                  setIsEditModalOpen(false);
                  setSelectedDance(null);
                } else {
                  setIsCreateModalOpen(false);
                }
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              {isEdit ? 'Update Dance' : 'Create Dance'}
            </Button>
          </div>
        </div>
        </form>
      </FormModal>

      <AdminRouteGuard>
        <AdminLayout>
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Music className="h-8 w-8 text-red-600" />
                  Greek Dancing
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage traditional Greek dances, steps, and cultural information
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Dance
              </Button>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Total Dances</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalDances}</p>
                  </div>
                  <Music className="h-12 w-12 text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Dance Types</h3>
                    <p className="text-3xl font-bold text-green-600">{Object.keys(dancesByType).length}</p>
                  </div>
                  <Users className="h-12 w-12 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">With Demo Videos</h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {dancesWithDemo}
                    </p>
                  </div>
                  <Play className="h-12 w-12 text-purple-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Featured</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {featuredDances}
                    </p>
                  </div>
                  <MapPin className="h-12 w-12 text-yellow-600 opacity-20" />
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md border"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search dances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="traditional">Traditional</option>
                  <option value="folk">Folk</option>
                  <option value="ceremonial">Ceremonial</option>
                  <option value="festive">Festive</option>
                  <option value="wedding">Wedding</option>
                  <option value="religious">Religious</option>
                </select>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </motion.div>

            {/* Data Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DataTable<DanceItem>
                title="Dances"
                data={filteredDances}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                searchTerm={searchTerm}
                isLoading={loading}
              />
            </motion.div>
          </div>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedDance(null);
            }}
            onConfirm={handleDelete}
            title="Delete Dance"
            description={`Are you sure you want to delete "${selectedDance?.name}"? This action cannot be undone.`}
          />
        </AdminLayout>
      </AdminRouteGuard>
    </>
  );
}