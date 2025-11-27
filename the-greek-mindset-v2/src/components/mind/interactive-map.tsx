'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GeographyItem } from '@/types/admin';
import { 
  MapPin, 
  Mountain, 
  Waves, 
  Building, 
  Globe,
  Landmark,
  Star,
  Info,
  Navigation
} from 'lucide-react';

interface InteractiveMapProps {
  items: GeographyItem[];
  onItemClick: (item: GeographyItem) => void;
  selectedItem?: GeographyItem | null;
  userProgress?: Record<string, any>;
}

export function InteractiveMap({ items, onItemClick, selectedItem, userProgress }: InteractiveMapProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<GeographyItem | null>(null);

  const types = [
    { id: 'all', label: 'All Locations', icon: Globe, color: 'gray' },
    { id: 'city', label: 'Cities', icon: Building, color: 'blue' },
    { id: 'landmark', label: 'Landmarks', icon: Landmark, color: 'amber' },
    { id: 'island', label: 'Islands', icon: MapPin, color: 'green' },
    { id: 'mountain', label: 'Mountains', icon: Mountain, color: 'stone' },
    { id: 'sea', label: 'Seas', icon: Waves, color: 'blue' },
    { id: 'region', label: 'Regions', icon: Globe, color: 'purple' },
  ];

  const getTypeIcon = (type: GeographyItem['type']) => {
    const typeConfig = types.find(t => t.id === type);
    if (!typeConfig) return MapPin;
    return typeConfig.icon;
  };

  const getTypeColor = (type: GeographyItem['type']): string => {
    const colors: Record<string, string> = {
      city: 'bg-blue-100 text-blue-800 border-blue-200',
      landmark: 'bg-amber-100 text-amber-800 border-amber-200',
      island: 'bg-green-100 text-green-800 border-green-200',
      mountain: 'bg-stone-100 text-stone-800 border-stone-200',
      sea: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      region: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Filter items by type
  const filteredItems = useMemo(() => {
    return selectedType === 'all' 
      ? items 
      : items.filter(item => item.type === selectedType);
  }, [items, selectedType]);

  // Featured items
  const featuredItems = items.filter(item => item.featured);

  // Simple map representation (since we don't have a real map library)
  const MapGrid = () => {
    return (
      <div className="relative bg-gradient-to-b from-blue-100 via-blue-50 to-green-50 rounded-2xl p-8 min-h-[500px] overflow-hidden">
        {/* Greece Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 400 300" className="w-full h-full">
            {/* Simplified Greece outline */}
            <path
              d="M 50 150 Q 100 100 150 120 Q 200 140 250 130 Q 300 120 350 140 Q 380 160 360 200 Q 340 240 300 250 Q 250 260 200 240 Q 150 220 100 200 Q 50 180 50 150 Z"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              className="opacity-30"
            />
            {/* Islands */}
            <circle cx="180" cy="220" r="15" fill="#3B82F6" className="opacity-20" />
            <circle cx="220" cy="240" r="10" fill="#3B82F6" className="opacity-20" />
            <circle cx="160" cy="250" r="8" fill="#3B82F6" className="opacity-20" />
          </svg>
        </div>

        {/* Location pins */}
        <div className="relative z-10 space-y-4">
          {filteredItems.map((item, index) => {
            const Icon = getTypeIcon(item.type);
            const isSelected = selectedItem?.id === item.id;
            const isHovered = hoveredItem?.id === item.id;
            const isCompleted = userProgress?.[item.id]?.completed;
            
            // Simple positioning based on index and type
            const position = {
              top: `${20 + (index % 4) * 20}%`,
              left: `${15 + (index % 5) * 15}%`,
            };

            return (
              <motion.div
                key={item.id}
                className="absolute cursor-pointer"
                style={position}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredItem(item)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => onItemClick(item)}
              >
                <div className={`
                  relative group
                  ${isSelected ? 'z-30' : isHovered ? 'z-20' : 'z-10'}
                `}>
                  {/* Pin */}
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all
                      ${isSelected 
                        ? 'bg-greek-gold border-yellow-500 scale-125' 
                        : isHovered
                          ? 'bg-blue-500 border-blue-600 scale-110'
                          : 'bg-white border-gray-300 hover:bg-blue-50'
                      }
                      ${isCompleted ? 'ring-2 ring-green-500' : ''}
                    `}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={`
                      h-5 w-5 
                      ${isSelected || isHovered ? 'text-white' : 'text-gray-600'}
                    `} />
                    
                    {item.featured && (
                      <Star className="absolute -top-1 -right-1 h-4 w-4 text-greek-gold fill-current" />
                    )}
                  </motion.div>

                  {/* Tooltip */}
                  {(isHovered || isSelected) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-3 shadow-xl border min-w-48 z-40"
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <Badge className={`text-xs mt-1 ${getTypeColor(item.type)}`}>
                          {item.type}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        {isCompleted && (
                          <div className="text-xs text-green-600 mt-1">✓ Explored</div>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Star className="h-3 w-3 text-greek-gold fill-current" />
              <span>Featured</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-green-500"></div>
              <span>Explored</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-greek-gold"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Greek Geography Explorer</h2>
            <p className="text-stone-600">Discover ancient cities, landmarks, and natural wonders</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {types.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              const count = type.id === 'all' ? items.length : items.filter(item => item.type === type.id).length;

              return (
                <Button
                  key={type.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className={`${
                    isSelected ? 'bg-greek-gold hover:bg-greek-gold/90 text-white' : ''
                  } flex items-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{type.label}</span>
                  <Badge variant="secondary" className="text-xs bg-white/20">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <MapGrid />
      </div>

      {/* Featured Locations */}
      {featuredItems.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-greek-gold" />
            Featured Locations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredItems.slice(0, 3).map((item) => {
              const Icon = getTypeIcon(item.type);
              const isCompleted = userProgress?.[item.id]?.completed;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200 cursor-pointer"
                  onClick={() => onItemClick(item)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <Badge className={`text-xs mt-1 ${getTypeColor(item.type)}`}>
                        {item.type}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      {isCompleted && (
                        <div className="text-xs text-green-600 mt-2">✓ Explored</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-stone-800">{items.length}</div>
            <div className="text-sm text-stone-600">Total Locations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {items.filter(item => item.type === 'city').length}
            </div>
            <div className="text-sm text-stone-600">Cities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {items.filter(item => item.type === 'island').length}
            </div>
            <div className="text-sm text-stone-600">Islands</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {items.filter(item => item.type === 'landmark').length}
            </div>
            <div className="text-sm text-stone-600">Landmarks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
