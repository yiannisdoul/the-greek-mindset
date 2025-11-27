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
import { ExerciseItem } from '@/types/admin';
import { Dumbbell, Play, Target, ExternalLink, Upload, Download, Filter } from 'lucide-react';
import { useBodyExercises } from '@/hooks/use-body-exercises';

// Form validation schema
const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  muscleGroup: z.enum(['chest', 'shoulders', 'arms', 'back', 'core', 'legs']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  reps: z.string().min(1, 'Reps/duration is required'),
  sets: z.number().min(1).max(10).optional(),
  duration: z.string().optional(),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tips: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  targetMuscles: z.array(z.string()).min(1, 'At least one target muscle is required'),
  benefits: z.array(z.string()).optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

const columns = [
  {
    key: 'name' as keyof ExerciseItem,
    label: 'Exercise',
    sortable: true,
    render: (value: string, item: ExerciseItem) => (
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
          <div className="text-sm text-gray-500">{item.targetMuscles.slice(0, 2).join(', ')}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'muscleGroup' as keyof ExerciseItem,
    label: 'Muscle Group',
    sortable: true,
    render: (value: string) => (
      <Badge variant={
        value === 'chest' ? 'default' :
        value === 'shoulders' ? 'secondary' :
        value === 'arms' ? 'outline' :
        value === 'back' ? 'destructive' :
        value === 'core' ? 'success' : 'warning'
      }>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    ),
  },
  {
    key: 'difficulty' as keyof ExerciseItem,
    label: 'Difficulty',
    sortable: true,
    render: (value: string) => (
      <Badge variant={
        value === 'beginner' ? 'success' :
        value === 'intermediate' ? 'warning' : 'destructive'
      }>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    ),
  },
  {
    key: 'reps' as keyof ExerciseItem,
    label: 'Reps/Duration',
    sortable: false,
    render: (value: string, item: ExerciseItem) => (
      <div>
        <div className="text-sm font-medium">{value}</div>
        {item.sets && <div className="text-xs text-gray-500">{item.sets} sets</div>}
      </div>
    ),
  },
  {
    key: 'demoUrl' as keyof ExerciseItem,
    label: 'Demo',
    sortable: false,
    render: (value: string) => (
      value ? (
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
    ),
  },
  {
    key: 'featured' as keyof ExerciseItem,
    label: 'Featured',
    sortable: true,
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'outline'}>
        {value ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];

export default function AdminExercisesPage() {
  const {
    items: exercises,
    loading,
    error,
    refreshItems,
    createItem,
    updateItem,
    deleteItem,
  } = useBodyExercises();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: '',
      description: '',
      muscleGroup: 'chest',
      difficulty: 'beginner',
      reps: '',
      instructions: [''],
      targetMuscles: [''],
      tips: [''],
      benefits: [''],
      equipment: '',
      demoUrl: '',
      imageUrl: '',
      featured: false,
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = form;

  // Statistics
  const totalExercises = exercises.length;
  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    acc[exercise.muscleGroup] = (acc[exercise.muscleGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const exercisesByDifficulty = exercises.reduce((acc, exercise) => {
    acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtered exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = muscleGroupFilter === 'all' || exercise.muscleGroup === muscleGroupFilter;
    const matchesDifficulty = difficultyFilter === 'all' || exercise.difficulty === difficultyFilter;
    
    return matchesSearch && matchesMuscleGroup && matchesDifficulty;
  });

  const handleCreate = async (data: ExerciseFormData) => {
    try {
      // Filter out empty strings from arrays
      const cleanData = {
        ...data,
        instructions: data.instructions.filter(instruction => instruction.trim() !== ''),
        targetMuscles: data.targetMuscles.filter(muscle => muscle.trim() !== ''),
        tips: data.tips?.filter(tip => tip.trim() !== '') || [],
        benefits: data.benefits?.filter(benefit => benefit.trim() !== '') || [],
      };
      
      await createItem(cleanData);
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to create exercise:', error);
    }
  };

  const handleEdit = (exercise: ExerciseItem) => {
    setSelectedExercise(exercise);
    reset({
      name: exercise.name,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
      difficulty: exercise.difficulty,
      reps: exercise.reps,
      sets: exercise.sets,
      duration: exercise.duration,
      instructions: exercise.instructions,
      targetMuscles: exercise.targetMuscles,
      tips: exercise.tips || [],
      benefits: exercise.benefits || [],
      equipment: exercise.equipment || '',
      demoUrl: exercise.demoUrl || '',
      imageUrl: exercise.imageUrl || '',
      featured: exercise.featured || false,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: ExerciseFormData) => {
    if (!selectedExercise) return;
    
    try {
      // Filter out empty strings from arrays
      const cleanData = {
        ...data,
        instructions: data.instructions.filter(instruction => instruction.trim() !== ''),
        targetMuscles: data.targetMuscles.filter(muscle => muscle.trim() !== ''),
        tips: data.tips?.filter(tip => tip.trim() !== '') || [],
        benefits: data.benefits?.filter(benefit => benefit.trim() !== '') || [],
      };
      
      await updateItem(selectedExercise.id, cleanData);
      setIsEditModalOpen(false);
      setSelectedExercise(null);
      reset();
    } catch (error) {
      console.error('Failed to update exercise:', error);
    }
  };

  const handleDelete = (exercise: ExerciseItem) => {
    setSelectedExercise(exercise);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedExercise) return;
    
    try {
      await deleteItem(selectedExercise.id);
      setIsDeleteDialogOpen(false);
      setSelectedExercise(null);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    }
  };

  // Dynamic form field handlers
  const addArrayField = (fieldName: keyof Pick<ExerciseFormData, 'instructions' | 'targetMuscles' | 'tips' | 'benefits'>) => {
    const currentValue = watch(fieldName) || [];
    setValue(fieldName, [...currentValue, ''] as any);
  };

  const removeArrayField = (fieldName: keyof Pick<ExerciseFormData, 'instructions' | 'targetMuscles' | 'tips' | 'benefits'>, index: number) => {
    const currentValue = watch(fieldName) || [];
    setValue(fieldName, currentValue.filter((_, i) => i !== index) as any);
  };

  const renderFormModal = (isEdit: boolean) => (
    <FormModal
      isOpen={isEdit ? isEditModalOpen : isCreateModalOpen}
      onClose={() => {
        if (isEdit) {
          setIsEditModalOpen(false);
          setSelectedExercise(null);
        } else {
          setIsCreateModalOpen(false);
        }
        reset();
      }}
      title={isEdit ? 'Edit Exercise' : 'Create New Exercise'}
    >
      <form onSubmit={handleSubmit(isEdit ? handleUpdate : handleCreate)} className="space-y-6">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Name *
            </label>
            <Input
              {...register('name')}
              placeholder="e.g. Push-ups"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Muscle Group *
            </label>
            <select
              {...register('muscleGroup')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="chest">Chest</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="back">Back</option>
              <option value="core">Core</option>
              <option value="legs">Legs</option>
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
              Reps/Duration *
            </label>
            <Input
              {...register('reps')}
              placeholder="e.g. 3 sets x 8-12 reps"
              className={errors.reps ? 'border-red-500' : ''}
            />
            {errors.reps && (
              <p className="mt-1 text-sm text-red-600">{errors.reps.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sets (Optional)
            </label>
            <Input
              {...register('sets', { valueAsNumber: true })}
              type="number"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment (Optional)
            </label>
            <Input
              {...register('equipment')}
              placeholder="e.g. None, Dumbbells, Resistance bands"
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
            rows={3}
            className={`w-full p-2 border border-gray-300 rounded-md ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Describe the exercise and its benefits..."
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
          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Instructions *
              </label>
              <Button
                type="button"
                onClick={() => addArrayField('instructions')}
                size="sm"
                variant="outline"
              >
                Add Step
              </Button>
            </div>
            {(watch('instructions') || []).map((_, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  {...register(`instructions.${index}`)}
                  placeholder={`Step ${index + 1}...`}
                />
                <Button
                  type="button"
                  onClick={() => removeArrayField('instructions', index)}
                  size="sm"
                  variant="outline"
                  disabled={(watch('instructions') || []).length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Target Muscles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Target Muscles *
              </label>
              <Button
                type="button"
                onClick={() => addArrayField('targetMuscles')}
                size="sm"
                variant="outline"
              >
                Add Muscle
              </Button>
            </div>
            {(watch('targetMuscles') || []).map((_, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  {...register(`targetMuscles.${index}`)}
                  placeholder="e.g. Pectoralis major, Deltoids..."
                />
                <Button
                  type="button"
                  onClick={() => removeArrayField('targetMuscles', index)}
                  size="sm"
                  variant="outline"
                  disabled={(watch('targetMuscles') || []).length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Tips (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tips (Optional)
              </label>
              <Button
                type="button"
                onClick={() => addArrayField('tips')}
                size="sm"
                variant="outline"
              >
                Add Tip
              </Button>
            </div>
            {(watch('tips') || []).map((_, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  {...register(`tips.${index}`)}
                  placeholder="Exercise tip..."
                />
                <Button
                  type="button"
                  onClick={() => removeArrayField('tips', index)}
                  size="sm"
                  variant="outline"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Benefits (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Benefits (Optional)
              </label>
              <Button
                type="button"
                onClick={() => addArrayField('benefits')}
                size="sm"
                variant="outline"
              >
                Add Benefit
              </Button>
            </div>
            {(watch('benefits') || []).map((_, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  {...register(`benefits.${index}`)}
                  placeholder="Exercise benefit..."
                />
                <Button
                  type="button"
                  onClick={() => removeArrayField('benefits', index)}
                  size="sm"
                  variant="outline"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('featured')}
            id="featured"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured Exercise
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
                setSelectedExercise(null);
              } else {
                setIsCreateModalOpen(false);
              }
              reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            {isEdit ? 'Update Exercise' : 'Create Exercise'}
          </Button>
        </div>
      </div>
      </form>
    </FormModal>
  );

  return (
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
                <Dumbbell className="h-8 w-8 text-red-600" />
                Body Exercises Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage workout exercises, demo videos, and training content
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Add New Exercise
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
                  <h3 className="text-lg font-semibold text-gray-700">Total Exercises</h3>
                  <p className="text-3xl font-bold text-blue-600">{totalExercises}</p>
                </div>
                <Dumbbell className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Muscle Groups</h3>
                  <p className="text-3xl font-bold text-green-600">{Object.keys(exercisesByMuscleGroup).length}</p>
                </div>
                <Target className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">With Demo Videos</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {exercises.filter(e => e.demoUrl).length}
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
                    {exercises.filter(e => e.featured).length}
                  </p>
                </div>
                <ExternalLink className="h-12 w-12 text-yellow-600 opacity-20" />
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={muscleGroupFilter}
                onChange={(e) => setMuscleGroupFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Muscle Groups</option>
                <option value="chest">Chest</option>
                <option value="shoulders">Shoulders</option>
                <option value="arms">Arms</option>
                <option value="back">Back</option>
                <option value="core">Core</option>
                <option value="legs">Legs</option>
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
            <DataTable<ExerciseItem>
              title="Exercises"
              data={filteredExercises}
              columns={columns}
              searchPlaceholder="Search exercises..."
              onAdd={() => setIsCreateModalOpen(true)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loading}
            />
          </motion.div>

          {/* Modals */}
          {renderFormModal(false)}
          {renderFormModal(true)}

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedExercise(null);
            }}
            onConfirm={confirmDelete}
            title="Delete Exercise"
            description={`Are you sure you want to delete "${selectedExercise?.name}"? This action cannot be undone.`}
          />
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}