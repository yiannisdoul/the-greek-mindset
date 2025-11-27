'use client';

import React from 'react';
import { useDynamicContent } from '@/hooks/use-dynamic-content';

interface DynamicContentTestProps {
  page: string;
  contentKey: string;
  fallback: string;
  className?: string;
}

export function DynamicContentTest({ page, contentKey, fallback, className }: DynamicContentTestProps) {
  const { getContent, loading, error } = useDynamicContent(page);

  if (error) {
    return (
      <div className={`${className} border-2 border-red-300 bg-red-50 p-2 rounded`}>
        <span className="text-red-800">Error loading content: {error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${className} border-2 border-blue-300 bg-blue-50 p-2 rounded`}>
        <span className="text-blue-800 opacity-75">{fallback} (Loading...)</span>
      </div>
    );
  }

  const dynamicContent = getContent(contentKey, fallback);
  const isDynamic = dynamicContent !== fallback;

  return (
    <div className={`${className} ${isDynamic ? 'border-2 border-green-300 bg-green-50' : ''} p-2 rounded`}>
      {dynamicContent}
      {process.env.NODE_ENV === 'development' && (
        <small className="ml-2 text-xs text-gray-500">
          [{isDynamic ? 'Dynamic' : 'Fallback'}]
        </small>
      )}
    </div>
  );
}

export function DynamicText({ page, contentKey, fallback, className }: DynamicContentTestProps) {
  const { getContent, loading } = useDynamicContent(page);

  if (loading) {
    return <span className={`${className} opacity-75`}>{fallback}</span>;
  }

  return <span className={className}>{getContent(contentKey, fallback)}</span>;
}