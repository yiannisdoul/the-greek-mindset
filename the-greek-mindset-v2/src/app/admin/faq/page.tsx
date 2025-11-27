'use client'

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { contentService } from '@/lib/content-service';
import { FAQItem } from '@/types/content';
import { useAuth } from '@/hooks/use-auth';

export default function AdminFAQPage() {
  const { user } = useAuth();
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Form state
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    position: 1
  });

  const categories = [
    'Philosophy',
    'Fitness', 
    'Cooking',
    'Platform',
    'General'
  ];

  useEffect(() => {
    loadFAQItems();
  }, []);

  const loadFAQItems = async () => {
    try {
      setLoading(true);
      const items = await contentService.getFAQItems();
      setFaqItems(items);
    } catch (error) {
      console.error('Error loading FAQ items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = async () => {
    if (!user?.uid || !formData.question.trim() || !formData.answer.trim()) {
      return;
    }

    try {
      await contentService.addFAQItem({
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category || 'General',
        position: formData.position,
        isActive: true,
        createdBy: user.uid,
        lastUpdatedBy: user.uid
      });

      // Reset form
      setFormData({
        question: '',
        answer: '',
        category: '',
        position: 1
      });
      setShowAddForm(false);
      
      // Reload items
      await loadFAQItems();
    } catch (error) {
      console.error('Error adding FAQ item:', error);
    }
  };

  const handleUpdateFAQ = async (id: string, updates: Partial<FAQItem>) => {
    if (!user?.uid) return;

    try {
      await contentService.updateFAQItem(id, updates, user.uid);
      await loadFAQItems();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating FAQ item:', error);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!user?.uid) return;

    try {
      await contentService.deleteFAQItem(id, user.uid);
      await loadFAQItems();
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const initializeDefaultFAQs = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      await contentService.initializeDefaultFAQItems(user.uid);
      await loadFAQItems();
    } catch (error) {
      console.error('Error initializing default FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group FAQ items by category
  const groupedFAQs = faqItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as { [category: string]: FAQItem[] });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading FAQ items...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              FAQ Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage frequently asked questions displayed on the FAQ page
            </p>
          </div>
          
          <div className="flex gap-3">
            {faqItems.length === 0 && (
              <Button onClick={initializeDefaultFAQs} variant="outline">
                <HelpCircle className="h-4 w-4 mr-2" />
                Initialize Default FAQs
              </Button>
            )}
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ Item
            </Button>
          </div>
        </div>

        {/* Add FAQ Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New FAQ Item</h2>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="Enter the FAQ question..."
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <Input
                  type="number"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: parseInt(e.target.value) || 1})}
                  min="1"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  placeholder="Enter the detailed answer..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleAddFAQ}
                disabled={!formData.question.trim() || !formData.answer.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Add FAQ Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* FAQ Items by Category */}
        {Object.keys(groupedFAQs).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedFAQs).map(([category, items]) => (
              <div key={category} className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Badge variant="outline">{category}</Badge>
                    <span className="text-sm text-gray-500">({items.length} items)</span>
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => toggleExpanded(item.id)}
                          >
                            <h4 className="font-medium text-gray-900">{item.question}</h4>
                            {expandedItems.has(item.id) ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          
                          {expandedItems.has(item.id) && (
                            <div className="mt-3">
                              {editingItem === item.id ? (
                                <EditFAQForm
                                  item={item}
                                  onSave={(updates) => handleUpdateFAQ(item.id, updates)}
                                  onCancel={() => setEditingItem(null)}
                                  categories={categories}
                                />
                              ) : (
                                <div>
                                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                    <span>Position: {item.position}</span>
                                    <span>•</span>
                                    <span>Updated: {item.updatedAt.toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFAQ(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQ Items</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first FAQ item or initializing with defaults.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={initializeDefaultFAQs} variant="outline">
                <HelpCircle className="h-4 w-4 mr-2" />
                Initialize Default FAQs
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ Item
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// Edit FAQ Form Component
function EditFAQForm({ 
  item, 
  onSave, 
  onCancel, 
  categories 
}: { 
  item: FAQItem;
  onSave: (updates: Partial<FAQItem>) => void;
  onCancel: () => void;
  categories: string[];
}) {
  const [formData, setFormData] = useState({
    question: item.question,
    answer: item.answer,
    category: item.category,
    position: item.position
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
        <Input
          value={formData.question}
          onChange={(e) => setFormData({...formData, question: e.target.value})}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <Input
            type="number"
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: parseInt(e.target.value) || 1})}
            min="1"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
        <textarea
          value={formData.answer}
          onChange={(e) => setFormData({...formData, answer: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex gap-3">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}