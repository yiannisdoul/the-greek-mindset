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
import { RecipeItem } from '@/types/admin';
import { ChefHat, Clock, Users, Utensils, Play, Plus, Trash2, Timer, Heart } from 'lucide-react';
import { useGreekCooking } from '@/hooks/use-greek-cooking';

// Form validation schema
const recipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  category: z.enum(['appetizer', 'main', 'dessert', 'salad', 'soup', 'beverage', 'bread', 'snack']),
  cuisine: z.enum(['mainland', 'islands', 'crete', 'cyprus', 'pontian', 'constantinople']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  prepTime: z.number().min(1, 'Prep time must be at least 1 minute').max(480, 'Prep time too long'),
  cookTime: z.number().min(0, 'Cook time cannot be negative').max(480, 'Cook time too long'),
  servings: z.number().min(1, 'Must serve at least 1 person').max(20, 'Too many servings'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    protein: z.string().optional(),
    carbs: z.string().optional(),
    fat: z.string().optional(),
    fiber: z.string().optional(),
  }).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  nutritionalBenefits: z.array(z.string()).optional(),
  historicalBackground: z.string().optional(),
  occasions: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional(),
  pairing: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  seasonal: z.string().optional(),
  region: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const columns: Array<{
  key: keyof RecipeItem | 'actions';
  label: string;
  sortable?: boolean;
  render?: (value: any, item: RecipeItem) => React.ReactNode;
}> = [
  {
    key: 'name',
    label: 'Recipe',
    sortable: true,
    render: (value: string, item: RecipeItem) => (
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
          <div className="text-sm text-gray-500">{item.cuisine} • {item.region || 'Traditional'}</div>
        </div>
      </div>
    )
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (value: string) => (
      <Badge variant={
        value === 'main' ? 'default' :
        value === 'appetizer' ? 'secondary' :
        value === 'dessert' ? 'success' :
        value === 'salad' ? 'outline' :
        value === 'soup' ? 'warning' : 'destructive'
      }>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Badge>
    )
  },
  {
    key: 'difficulty',
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
    key: 'totalTime',
    label: 'Total Time',
    sortable: true,
    render: (value: number, item: RecipeItem) => (
      <div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Timer className="h-3 w-3" />
          {value} min
        </div>
        <div className="text-xs text-gray-500">
          Prep: {item.prepTime}m • Cook: {item.cookTime}m
        </div>
      </div>
    )
  },
  {
    key: 'servings',
    label: 'Servings',
    sortable: true,
    render: (value: number) => (
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {value}
      </div>
    )
  },
  {
    key: 'featured',
    label: 'Featured',
    sortable: true,
    render: (value: boolean) => (
      <Badge variant={value ? 'success' : 'outline'}>
        {value ? 'Yes' : 'No'}
      </Badge>
    )
  }
];

export default function AdminRecipesPage() {
  const { items, loading, error, create, update, remove } = useGreekCooking();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecipeItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: RecipeItem | null }>({
    isOpen: false,
    item: null
  });
  const [filteredItems, setFilteredItems] = useState<RecipeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(item => item.difficulty === difficultyFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, categoryFilter, difficultyFilter]);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'main',
      cuisine: 'mainland',
      difficulty: 'beginner',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      ingredients: [''],
      instructions: [''],
      dietaryRestrictions: [],
      nutritionalBenefits: [],
      occasions: [],
      tips: [],
      variations: [],
      pairing: [],
      equipment: [],
      imageUrl: '',
      videoUrl: '',
      featured: false,
      seasonal: '',
      region: '',
      historicalBackground: '',
      nutritionalInfo: {
        calories: 0,
        protein: '',
        carbs: '',
        fat: '',
        fiber: ''
      }
    }
  });

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      setIsSubmitting(true);
      
      // Clean nutritional info - remove undefined/empty values
      const cleanedNutritionalInfo = data.nutritionalInfo ? {
        ...(data.nutritionalInfo.calories !== undefined && data.nutritionalInfo.calories > 0 && { calories: data.nutritionalInfo.calories }),
        ...(data.nutritionalInfo.protein && data.nutritionalInfo.protein.trim() && { protein: data.nutritionalInfo.protein.trim() }),
        ...(data.nutritionalInfo.carbs && data.nutritionalInfo.carbs.trim() && { carbs: data.nutritionalInfo.carbs.trim() }),
        ...(data.nutritionalInfo.fat && data.nutritionalInfo.fat.trim() && { fat: data.nutritionalInfo.fat.trim() }),
        ...(data.nutritionalInfo.fiber && data.nutritionalInfo.fiber.trim() && { fiber: data.nutritionalInfo.fiber.trim() }),
      } : {};

      // Filter out empty strings from arrays
      const cleanedData = {
        ...data,
        ingredients: data.ingredients.filter(item => item.trim() !== ''),
        instructions: data.instructions.filter(item => item.trim() !== ''),
        dietaryRestrictions: data.dietaryRestrictions?.filter(item => item.trim() !== '') || [],
        nutritionalBenefits: data.nutritionalBenefits?.filter(item => item.trim() !== '') || [],
        occasions: data.occasions?.filter(item => item.trim() !== '') || [],
        tips: data.tips?.filter(item => item.trim() !== '') || [],
        variations: data.variations?.filter(item => item.trim() !== '') || [],
        pairing: data.pairing?.filter(item => item.trim() !== '') || [],
        equipment: data.equipment?.filter(item => item.trim() !== '') || [],
        totalTime: data.prepTime + data.cookTime, // Calculate total time
        // Only include optional text fields if they have content
        ...(data.historicalBackground && data.historicalBackground.trim() && { historicalBackground: data.historicalBackground.trim() }),
        ...(data.seasonal && data.seasonal.trim() && { seasonal: data.seasonal.trim() }),
        ...(data.region && data.region.trim() && { region: data.region.trim() }),
        // Only include nutritionalInfo if it has content
        ...(Object.keys(cleanedNutritionalInfo).length > 0 && { nutritionalInfo: cleanedNutritionalInfo }),
      };

      if (editingItem) {
        await update(editingItem.id, cleanedData);
      } else {
        await create(cleanedData as Omit<RecipeItem, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      setIsFormOpen(false);
      setEditingItem(null);
      form.reset();
    } catch (error) {
      console.error('Error saving recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: RecipeItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      category: item.category,
      cuisine: item.cuisine,
      difficulty: item.difficulty,
      prepTime: item.prepTime,
      cookTime: item.cookTime,
      servings: item.servings,
      ingredients: item.ingredients.length > 0 ? item.ingredients : [''],
      instructions: item.instructions.length > 0 ? item.instructions : [''],
      dietaryRestrictions: item.dietaryRestrictions || [],
      nutritionalBenefits: item.nutritionalBenefits || [],
      occasions: item.occasions || [],
      tips: item.tips || [],
      variations: item.variations || [],
      pairing: item.pairing || [],
      equipment: item.equipment || [],
      imageUrl: item.imageUrl || '',
      videoUrl: item.videoUrl || '',
      featured: item.featured || false,
      seasonal: item.seasonal || '',
      region: item.region || '',
      historicalBackground: item.historicalBackground || '',
      nutritionalInfo: {
        calories: item.nutritionalInfo?.calories || 0,
        protein: item.nutritionalInfo?.protein || '',
        carbs: item.nutritionalInfo?.carbs || '',
        fat: item.nutritionalInfo?.fat || '',
        fiber: item.nutritionalInfo?.fiber || ''
      }
    });
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      try {
        await remove(deleteConfirm.item.id);
        setDeleteConfirm({ isOpen: false, item: null });
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setIsSubmitting(false);
    form.reset();
  };

  // Dynamic array field handlers
  const addArrayField = (fieldName: keyof RecipeFormData, currentValue: string[]) => {
    form.setValue(fieldName, [...currentValue, ''] as any);
  };

  const removeArrayField = (fieldName: keyof RecipeFormData, index: number, currentValue: string[]) => {
    const newValue = currentValue.filter((_, i) => i !== index);
    form.setValue(fieldName, newValue as any);
  };

  const updateArrayField = (fieldName: keyof RecipeFormData, index: number, value: string, currentValue: string[]) => {
    const newValue = [...currentValue];
    newValue[index] = value;
    form.setValue(fieldName, newValue as any);
  };

  // Calculate statistics
  const stats = {
    total: items.length,
    featured: items.filter(item => item.featured).length,
    categories: Array.from(new Set(items.map(item => item.category))).length,
    avgTime: items.length > 0 ? Math.round(items.reduce((sum, item) => sum + item.totalTime, 0) / items.length) : 0,
  };

  if (loading) {
    return (
      <AdminRouteGuard>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ChefHat className="h-8 w-8 text-green-600" />
                Greek Cooking Recipes
              </h1>
              <p className="text-gray-600 mt-1">Manage traditional Greek recipes and cooking instructions</p>
            </div>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Total Recipes</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-gray-600">Featured</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.featured}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Categories</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.categories}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Avg Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.avgTime}m</p>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                <option value="appetizer">Appetizer</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="salad">Salad</option>
                <option value="soup">Soup</option>
                <option value="beverage">Beverage</option>
                <option value="bread">Bread</option>
                <option value="snack">Snack</option>
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <DataTable<RecipeItem>
              title="Recipes"
              data={filteredItems}
              columns={columns as any}
              onAdd={() => setIsFormOpen(true)}
              onEdit={handleEdit}
              onDelete={(item) => setDeleteConfirm({ isOpen: true, item })}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        <FormModal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingItem ? 'Edit Recipe' : 'Add New Recipe'}
          onSubmit={form.handleSubmit(handleSubmit)}
          submitText={editingItem ? 'Update Recipe' : 'Create Recipe'}
          isSubmitting={isSubmitting}
        >
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                <Input
                  {...form.register('name')}
                  placeholder="e.g., Moussaka, Greek Salad"
                  className={form.formState.errors.name ? 'border-red-500' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  {...form.register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="main">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="salad">Salad</option>
                  <option value="soup">Soup</option>
                  <option value="beverage">Beverage</option>
                  <option value="bread">Bread</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...form.register('description')}
                placeholder="Describe the dish, its flavors, and cultural significance"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${form.formState.errors.description ? 'border-red-500' : ''}`}
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                <select
                  {...form.register('cuisine')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="mainland">Mainland</option>
                  <option value="islands">Islands</option>
                  <option value="crete">Crete</option>
                  <option value="cyprus">Cyprus</option>
                  <option value="pontian">Pontian</option>
                  <option value="constantinople">Constantinople</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  {...form.register('difficulty')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
                <Input
                  type="number"
                  {...form.register('servings', { valueAsNumber: true })}
                  min={1}
                  max={20}
                  className={form.formState.errors.servings ? 'border-red-500' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (minutes)</label>
                <Input
                  type="number"
                  {...form.register('prepTime', { valueAsNumber: true })}
                  min={1}
                  className={form.formState.errors.prepTime ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (minutes)</label>
                <Input
                  type="number"
                  {...form.register('cookTime', { valueAsNumber: true })}
                  min={0}
                  className={form.formState.errors.cookTime ? 'border-red-500' : ''}
                />
              </div>
            </div>

            {/* Dynamic Ingredients Array */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('ingredients', form.watch('ingredients'))}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Ingredient
                </Button>
              </div>
              {form.watch('ingredients').map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={form.watch(`ingredients.${index}`)}
                    onChange={(e) => updateArrayField('ingredients', index, e.target.value, form.watch('ingredients'))}
                    placeholder="e.g., 2 lbs ground lamb, 1 large eggplant"
                  />
                  {form.watch('ingredients').length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('ingredients', index, form.watch('ingredients'))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {form.formState.errors.ingredients && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.ingredients.message}</p>
              )}
            </div>

            {/* Dynamic Instructions Array */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('instructions', form.watch('instructions'))}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              {form.watch('instructions').map((_, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500 pt-2">{index + 1}.</span>
                  <textarea
                    value={form.watch(`instructions.${index}`)}
                    onChange={(e) => updateArrayField('instructions', index, e.target.value, form.watch('instructions'))}
                    placeholder="Describe this cooking step in detail"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={2}
                  />
                  {form.watch('instructions').length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('instructions', index, form.watch('instructions'))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {form.formState.errors.instructions && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.instructions.message}</p>
              )}
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <Input
                  {...form.register('imageUrl')}
                  placeholder="https://example.com/recipe-image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <Input
                  {...form.register('videoUrl')}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <Input
                  {...form.register('region')}
                  placeholder="e.g., Attica, Macedonia, Aegean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <select
                  {...form.register('seasonal')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Any Season</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Historical Background</label>
              <textarea
                {...form.register('historicalBackground')}
                placeholder="Share the cultural and historical context of this recipe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={2}
              />
            </div>

            {/* Nutritional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Nutritional Information (Optional)</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Calories</label>
                  <Input
                    type="number"
                    {...form.register('nutritionalInfo.calories', { valueAsNumber: true })}
                    placeholder="320"
                    min={0}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Protein</label>
                  <Input
                    {...form.register('nutritionalInfo.protein')}
                    placeholder="15g"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Carbs</label>
                  <Input
                    {...form.register('nutritionalInfo.carbs')}
                    placeholder="45g"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fat</label>
                  <Input
                    {...form.register('nutritionalInfo.fat')}
                    placeholder="8g"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fiber</label>
                  <Input
                    {...form.register('nutritionalInfo.fiber')}
                    placeholder="3g"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register('featured')}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label className="text-sm font-medium text-gray-700">Featured Recipe</label>
            </div>
          </div>
        </FormModal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
          onConfirm={handleDelete}
          title="Delete Recipe"
          description={`Are you sure you want to delete "${deleteConfirm.item?.name}"? This action cannot be undone.`}
        />
      </AdminLayout>
    </AdminRouteGuard>
  );
}