// src/hooks/use-faq-items.ts
import { useState, useEffect } from 'react';
import { FAQItem } from '@/types/content';
import { contentService } from '@/lib/content-service';

export function useFAQItems() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [faqsByCategory, setFaqsByCategory] = useState<{ [category: string]: FAQItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFAQItems();
  }, []);

  const loadFAQItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await contentService.getFAQItems();
      const grouped = await contentService.getFAQItemsByCategory();
      
      setFaqItems(items);
      setFaqsByCategory(grouped);
    } catch (err) {
      console.error('Error loading FAQ items:', err);
      setError('Failed to load FAQ items');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadFAQItems();
  };

  return {
    faqItems,
    faqsByCategory,
    loading,
    error,
    refetch
  };
}