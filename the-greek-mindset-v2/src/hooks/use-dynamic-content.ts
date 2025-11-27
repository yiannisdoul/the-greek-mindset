// src/hooks/use-dynamic-content.ts
import { useState, useEffect, useCallback } from 'react';
import { contentService } from '@/lib/content-service';
import { ContentBlock } from '@/types/content';

interface UseDynamicContentReturn {
  content: Record<string, string>;
  loading: boolean;
  error: string | null;
  refreshContent: () => Promise<void>;
  getContent: (key: string, fallback?: string) => string;
}

/**
 * Hook to fetch and manage dynamic content for a specific page
 * @param page - The page identifier (e.g., 'homepage', 'mind', 'body')
 * @param autoRefresh - Whether to auto-refresh content periodically
 */
export function useDynamicContent(page: string, autoRefresh: boolean = false): UseDynamicContentReturn {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    try {
      setError(null);
      const contentMap = await contentService.getContentMap(page);
      setContent(contentMap);
    } catch (err) {
      console.error('Error loading dynamic content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const refreshContent = useCallback(async () => {
    setLoading(true);
    await loadContent();
  }, [loadContent]);

  const getContent = useCallback((key: string, fallback?: string): string => {
    return content[key] || fallback || '';
  }, [content]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadContent();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, loadContent]);

  return {
    content,
    loading,
    error,
    refreshContent,
    getContent
  };
}

/**
 * Hook to get content for all pages (useful for admin interfaces)
 */
export function useAllDynamicContent(): UseDynamicContentReturn {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    try {
      setError(null);
      const contentMap = await contentService.getContentMap();
      setContent(contentMap);
    } catch (err) {
      console.error('Error loading all dynamic content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshContent = useCallback(async () => {
    setLoading(true);
    await loadContent();
  }, [loadContent]);

  const getContent = useCallback((key: string, fallback?: string): string => {
    return content[key] || fallback || '';
  }, [content]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return {
    content,
    loading,
    error,
    refreshContent,
    getContent
  };
}

/**
 * Hook for managing content in admin interfaces
 */
export function useContentManagement(page?: string) {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContentBlocks = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const blocks = page 
        ? await contentService.getPageContent(page)
        : await contentService.getAllContent();
      setContentBlocks(blocks);
    } catch (err) {
      console.error('Error loading content blocks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content blocks');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const updateContent = useCallback(async (blockId: string, content: string, updatedBy: string) => {
    try {
      const block = contentBlocks.find(b => b.id === blockId);
      if (!block) throw new Error('Content block not found');

      await contentService.updateContent(blockId, {
        key: block.key,
        content,
        updatedBy
      });

      // Update local state
      setContentBlocks(prev => 
        prev.map(b => 
          b.id === blockId 
            ? { ...b, content, updatedAt: new Date(), lastUpdatedBy: updatedBy }
            : b
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to update content');
      return false;
    }
  }, [contentBlocks]);

  const bulkUpdateContent = useCallback(async (updates: Array<{ id: string; content: string; updatedBy: string }>) => {
    try {
      await contentService.bulkUpdateContent(updates);
      
      // Update local state
      const updateMap = new Map(updates.map(u => [u.id, u]));
      setContentBlocks(prev => 
        prev.map(block => {
          const update = updateMap.get(block.id);
          return update 
            ? { ...block, content: update.content, updatedAt: new Date(), lastUpdatedBy: update.updatedBy }
            : block;
        })
      );

      return true;
    } catch (err) {
      console.error('Error bulk updating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to bulk update content');
      return false;
    }
  }, []);

  const resetToDefaults = useCallback(async (targetPage: string, adminUserId: string) => {
    try {
      await contentService.resetPageToDefaults(targetPage, adminUserId);
      if (!page || page === targetPage) {
        await loadContentBlocks();
      }
      return true;
    } catch (err) {
      console.error('Error resetting to defaults:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset to defaults');
      return false;
    }
  }, [page, loadContentBlocks]);

  useEffect(() => {
    loadContentBlocks();
  }, [loadContentBlocks]);

  return {
    contentBlocks,
    loading,
    error,
    refreshContent: loadContentBlocks,
    updateContent,
    bulkUpdateContent,
    resetToDefaults
  };
}