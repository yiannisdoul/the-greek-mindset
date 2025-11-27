'use client';

import React from 'react';
import { useDynamicContent } from '@/hooks/use-dynamic-content';

export default function ContentTestPage() {
  const { content, loading, error, getContent } = useDynamicContent('homepage');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dynamic Content Test</h1>
      
      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">Debug Information:</h2>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Content Keys Found: {Object.keys(content).length}</p>
        <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>

      {/* Test Content Display */}
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Hero Title:</h3>
          <p className="text-lg">"{getContent('homepage.hero.title', 'DEFAULT: The Greek Mindset')}"</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">Body Title:</h3>
          <p className="text-lg">"{getContent('homepage.body.title', 'DEFAULT: BODY')}"</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">Mind Title:</h3>
          <p className="text-lg">"{getContent('homepage.mind.title', 'DEFAULT: MIND')}"</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">All Content Keys:</h3>
          <ul className="text-sm">
            {Object.entries(content).map(([key, value]) => (
              <li key={key} className="mb-1">
                <strong>{key}:</strong> {String(value).substring(0, 100)}...
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}