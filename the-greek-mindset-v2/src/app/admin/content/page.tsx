'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contentService } from '@/lib/content-service';
import { ContentBlock, CONTENT_TEMPLATES } from '@/types/content';
import { 
  Edit3, 
  Save, 
  X, 
  RefreshCw, 
  FileText,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Trash2,
  RotateCcw
} from 'lucide-react';

export default function ContentManagement() {
  const { adminUser } = useAdminAuth();
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBlocks, setEditingBlocks] = useState<Set<string>>(new Set());
  const [tempContent, setTempContent] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pages = Object.keys(CONTENT_TEMPLATES);

  useEffect(() => {
    console.log('useEffect triggered - selectedPage:', selectedPage, 'adminUser:', !!adminUser);
    loadPageContent();
  }, [selectedPage, adminUser]);

  const loadPageContent = async () => {
    console.log('loadPageContent called - adminUser:', !!adminUser, 'selectedPage:', selectedPage);
    
    try {
      setLoading(true);
      if (adminUser) {
        console.log('Admin user exists, loading content...');
        const adminId = adminUser.id || adminUser.email;
        console.log('Admin ID for loadPageContent:', adminId);
        
        const content = await contentService.getPageContent(selectedPage);
        console.log('Content loaded:', content.length, 'blocks');
        setContentBlocks(content);
      } else {
        console.log('No admin user, skipping content load');
        setContentBlocks([]);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      showMessage('error', 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const startEditing = (blockId: string, currentContent: string) => {
    setEditingBlocks(prev => new Set(prev).add(blockId));
    setTempContent(prev => ({ ...prev, [blockId]: currentContent }));
  };

  const cancelEditing = (blockId: string) => {
    setEditingBlocks(prev => {
      const newSet = new Set(prev);
      newSet.delete(blockId);
      return newSet;
    });
    setTempContent(prev => {
      const { [blockId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const saveContent = async (blockId: string) => {
    if (!adminUser || !tempContent[blockId]) return;

    try {
      setSaving(true);
      const adminId = adminUser.id || adminUser.email;
      await contentService.updateContent(blockId, {
        key: contentBlocks.find(b => b.id === blockId)?.key || '',
        content: tempContent[blockId],
        updatedBy: adminId
      });

      // Update local state
      setContentBlocks(prev => 
        prev.map(block => 
          block.id === blockId 
            ? { ...block, content: tempContent[blockId], updatedAt: new Date() }
            : block
        )
      );

      cancelEditing(blockId);
      showMessage('success', 'Content updated successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      showMessage('error', 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const saveAllChanges = async () => {
    if (!adminUser || Object.keys(tempContent).length === 0) return;

    try {
      setSaving(true);
      const adminId = adminUser.id || adminUser.email;
      const updates = Object.entries(tempContent).map(([blockId, content]) => ({
        id: blockId,
        content,
        updatedBy: adminId
      }));

      await contentService.bulkUpdateContent(updates);

      // Update local state
      setContentBlocks(prev => 
        prev.map(block => {
          const newContent = tempContent[block.id];
          return newContent 
            ? { ...block, content: newContent, updatedAt: new Date() }
            : block;
        })
      );

      setEditingBlocks(new Set());
      setTempContent({});
      showMessage('success', `Updated ${updates.length} content blocks`);
    } catch (error) {
      console.error('Error saving all changes:', error);
      showMessage('error', 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const resetPageToDefaults = async () => {
    if (!adminUser || !window.confirm('This will reset all content on this page to defaults. Are you sure?')) {
      return;
    }

    try {
      setSaving(true);
      const adminId = adminUser.id || adminUser.email;
      await contentService.resetPageToDefaults(selectedPage, adminId);
      await loadPageContent();
      setEditingBlocks(new Set());
      setTempContent({});
      showMessage('success', 'Page content reset to defaults');
    } catch (error) {
      console.error('Error resetting page:', error);
      showMessage('error', 'Failed to reset page content');
    } finally {
      setSaving(false);
    }
  };

  const deleteAllContent = async () => {
    if (!adminUser || !window.confirm('This will DELETE ALL content across all pages. This cannot be undone. Are you sure?')) {
      return;
    }
    
    if (!window.confirm('FINAL WARNING: This will remove all dynamic content. Type "DELETE" to confirm this is really what you want.') || 
        prompt('Type "DELETE" to confirm:') !== 'DELETE') {
      return;
    }

    try {
      setSaving(true);
      const adminId = adminUser.id || adminUser.email;
      await contentService.deleteAllContent(adminId);
      await loadPageContent();
      setEditingBlocks(new Set());
      setTempContent({});
      showMessage('success', 'All content has been deleted');
    } catch (error) {
      console.error('Error deleting all content:', error);
      showMessage('error', 'Failed to delete all content');
    } finally {
      setSaving(false);
    }
  };

  const resetAllContentToDefaults = async () => {
    if (!adminUser || !window.confirm('This will reset ALL content on ALL pages to defaults. Are you sure?')) {
      return;
    }

    try {
      setSaving(true);
      const adminId = adminUser.id || adminUser.email;
      await contentService.resetAllContentToDefaults(adminId);
      await loadPageContent();
      setEditingBlocks(new Set());
      setTempContent({});
      showMessage('success', 'All content reset to defaults across all pages');
    } catch (error) {
      console.error('Error resetting all content:', error);
      showMessage('error', 'Failed to reset all content');
    } finally {
      setSaving(false);
    }
  };

  const getTemplate = () => CONTENT_TEMPLATES[selectedPage];

  const groupContentBySection = () => {
    const template = getTemplate();
    const grouped: Record<string, ContentBlock[]> = {};

    Object.keys(template.sections).forEach(sectionKey => {
      grouped[sectionKey] = contentBlocks.filter(block => block.section === sectionKey);
    });

    return grouped;
  };

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage dynamic content for all pages (Homepage, Mind, Body, FAQ, About, Contact) • <a href="/admin/faq" className="text-blue-600 hover:text-blue-800">FAQ Management →</a>
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {Object.keys(tempContent).length > 0 && (
                <Button 
                  onClick={saveAllChanges}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save All Changes ({Object.keys(tempContent).length})
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={resetPageToDefaults}
                  variant="outline"
                  disabled={saving}
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Page
                </Button>
                
                <Button 
                  onClick={resetAllContentToDefaults}
                  variant="outline"
                  disabled={saving}
                  size="sm"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Pages
                </Button>
                
                <Button 
                  onClick={deleteAllContent}
                  variant="outline"
                  disabled={saving}
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Content
                </Button>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </motion.div>
          )}

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-red-800 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </h2>
            <div className="text-sm text-red-700 space-y-2">
              <p><strong>Reset Page:</strong> Resets current page content to defaults</p>
              <p><strong>Reset All Pages:</strong> Resets ALL pages (homepage, mind, body) to defaults</p>
              <p><strong>Delete All Content:</strong> Removes ALL dynamic content (requires confirmation)</p>
            </div>
          </div>

          {/* Page Selector */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Page</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`p-3 text-left rounded-lg border-2 transition-colors capitalize ${
                    selectedPage === page
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-5 w-5 mb-2" />
                  <div className="font-medium">{page}</div>
                  <div className="text-sm text-gray-500">
                    {contentBlocks.filter(b => b.page === page).length || 0} blocks
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-lg p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-500">Loading content...</p>
            </div>
          ) : contentBlocks.length === 0 ? (
            <div className="bg-white shadow-sm rounded-lg p-12 text-center">
              <p className="text-gray-500 mb-4">No content found for "{selectedPage}" page.</p>
              <Button 
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Initialize button clicked!');
                  console.log('AdminUser state:', adminUser);
                  console.log('Selected page:', selectedPage);
                  
                  if (!adminUser) {
                    console.log('No admin user found');
                    showMessage('error', 'Admin authentication required');
                    return;
                  }

                  const adminId = adminUser.id || adminUser.email;
                  console.log('Admin ID resolved to:', adminId);
                  
                  if (!adminId) {
                    console.log('Admin ID is empty');
                    showMessage('error', 'Admin ID not found');
                    return;
                  }

                  try {
                    console.log('Starting initialization...');
                    setSaving(true);
                    showMessage('success', 'Starting content initialization...');
                    
                    console.log('Calling contentService.ensurePageContentExists...');
                    await contentService.ensurePageContentExists(selectedPage, adminId);
                    console.log('Content initialization completed');
                    
                    console.log('Loading page content...');
                    await loadPageContent();
                    console.log('Page content loaded');
                    
                    showMessage('success', `Successfully initialized content for ${selectedPage} page`);
                  } catch (error) {
                    console.error('Detailed error during initialization:', error);
                    showMessage('error', `Failed to initialize content: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    console.log('Initialization process completed, setting saving to false');
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Initializing...
                  </>
                ) : (
                  'Initialize Content'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Debug info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Found {contentBlocks.length} content blocks for "{selectedPage}" page
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  Admin: {adminUser ? adminUser.email : 'Not authenticated'} | 
                  Loading: {loading ? 'Yes' : 'No'} | 
                  Saving: {saving ? 'Yes' : 'No'}
                </p>
              </div>
              
              {Object.entries(groupContentBySection()).map(([sectionKey, blocks]) => {
                const sectionInfo = getTemplate().sections[sectionKey];
                
                return (
                  <div key={sectionKey} className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        {sectionInfo.name} ({blocks.length} blocks)
                      </h3>
                      <p className="text-sm text-gray-500">{sectionInfo.description}</p>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {blocks.map((block) => {
                        const isEditing = editingBlocks.has(block.id);
                        const currentContent = tempContent[block.id] || block.content;
                        const blockTemplate = sectionInfo.blocks.find(b => b.key === block.key);
                        
                        return (
                          <div key={block.id} className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {blockTemplate?.label || block.key}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">Key: {block.key}</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => saveContent(block.id)}
                                      disabled={saving}
                                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                    >
                                      <Save className="h-4 w-4" />
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => cancelEditing(block.id)}
                                      disabled={saving}
                                      className="flex items-center gap-2"
                                    >
                                      <X className="h-4 w-4" />
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEditing(block.id, block.content)}
                                    className="flex items-center gap-2"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                    Edit
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {isEditing ? (
                              <div className="space-y-3">
                                <textarea
                                  value={currentContent}
                                  onChange={(e) => setTempContent(prev => ({
                                    ...prev,
                                    [block.id]: e.target.value
                                  }))}
                                  placeholder={blockTemplate?.placeholder}
                                  rows={block.contentType === 'text' && currentContent.length > 100 ? 4 : 3}
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                />
                                <div className="text-xs text-gray-500">
                                  {currentContent.length} characters
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {block.content}
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-3 text-xs text-gray-500">
                              Last updated: {block.updatedAt.toLocaleDateString()} at {block.updatedAt.toLocaleTimeString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
}