'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/types/admin';
import { 
  Clock, 
  Star, 
  Calendar, 
  MapPin,
  CheckCircle,
  PlayCircle,
  BookOpen
} from 'lucide-react';

interface TimelineProps {
  items: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
  userProgress: Record<string, any>;
}

export function Timeline({ items, onItemClick, userProgress }: TimelineProps) {
  const [sortBy, setSortBy] = useState<'chronological' | 'category'>('chronological');

  // Sort items based on selected criteria
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'chronological') {
      return (a.year || 0) - (b.year || 0);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      ancient: 'bg-blue-100 text-blue-800 border-blue-200',
      classical: 'bg-green-100 text-green-800 border-green-200',
      hellenistic: 'bg-purple-100 text-purple-800 border-purple-200',
      byzantine: 'bg-amber-100 text-amber-800 border-amber-200',
      modern: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatYear = (year?: number): string => {
    if (!year) return 'Unknown';
    return `${Math.abs(year)} ${year < 0 ? 'BC' : 'AD'}`;
  };

  return (
    <div className="space-y-6">
      {/* Timeline Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-stone-800">Historical Timeline</h2>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'chronological' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('chronological')}
            className={sortBy === 'chronological' ? 'bg-greek-gold hover:bg-greek-gold/90' : ''}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Chronological
          </Button>
          <Button
            variant={sortBy === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('category')}
            className={sortBy === 'category' ? 'bg-greek-gold hover:bg-greek-gold/90' : ''}
          >
            <MapPin className="h-4 w-4 mr-2" />
            By Period
          </Button>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-greek-gold via-amber-400 to-greek-gold opacity-30"></div>

        <div className="space-y-8">
          {sortedItems.map((item, index) => {
            const isCompleted = userProgress[item.id]?.completed;
            const hasAttempts = userProgress[item.id]?.quizAttempts?.length > 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Node */}
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-white border-4 border-greek-gold shadow-lg z-10"></div>

                {/* Content Card */}
                <div className="ml-16 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.featured && (
                            <Star className="h-4 w-4 text-greek-gold fill-current" />
                          )}
                          <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-stone-500">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{item.period}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h3>
                        <p className="text-stone-600 text-sm line-clamp-2">{item.description}</p>
                      </div>

                      {/* Progress Indicators */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isCompleted && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </div>
                        )}
                        {hasAttempts && !isCompleted && (
                          <div className="flex items-center gap-1 text-amber-600 text-xs">
                            <PlayCircle className="h-4 w-4" />
                            <span>In Progress</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Significance */}
                    {item.significance && (
                      <div className="bg-amber-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-amber-800">
                          <strong>Historical Significance:</strong> {item.significance}
                        </p>
                      </div>
                    )}

                    {/* Image */}
                    {item.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => onItemClick(item)}
                        className="flex-1 bg-greek-gold hover:bg-greek-gold/90"
                        size="sm"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                      
                      {/* Show year if available */}
                      {item.year && (
                        <div className="flex items-center justify-center px-3 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700">
                          {formatYear(item.year)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(isCompleted || hasAttempts) && (
                    <div className="h-1 bg-gradient-to-r from-transparent via-greek-gold to-transparent"></div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* End of Timeline */}
        <div className="relative mt-8">
          <div className="absolute left-6 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-greek-gold to-amber-500 shadow-lg"></div>
          <div className="ml-16 text-center py-6">
            <p className="text-stone-600 font-medium">
              You've reached the end of our historical journey!
            </p>
            <p className="text-stone-500 text-sm mt-1">
              More content coming soon...
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-stone-800">{items.length}</div>
            <div className="text-sm text-stone-600">Total Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(userProgress).filter(p => p?.completed).length}
            </div>
            <div className="text-sm text-stone-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {Object.values(userProgress).filter(p => p?.quizAttempts?.length > 0).length}
            </div>
            <div className="text-sm text-stone-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {items.filter(item => item.featured).length}
            </div>
            <div className="text-sm text-stone-600">Featured</div>
          </div>
        </div>
      </div>
    </div>
  );
}
