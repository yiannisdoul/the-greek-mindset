'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, MobileNavbar } from '@/components/layout/navbar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useMythologyData } from '@/hooks/use-mythology-data';
import { useUserProgress } from '@/hooks/use-user-progress';
import { MythologyItem } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  Star, 
  BookOpen, 
  Trophy, 
  Filter,
  Search,
  Play,
  CheckCircle,
  Sparkles,
  Crown,
  Sword,
  Zap,
  Eye,
  ArrowLeft
} from 'lucide-react';

export default function MythologyPage() {
  const { user } = useAuth();
  const { items: mythologyItems, loading, error } = useMythologyData();
  const { 
    userProfile, 
    recordReadingProgress, 
    recordQuizAttempt, 
    getItemProgress 
  } = useUserProgress();
  
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MythologyItem | null>(null);
  const [readingStartTime, setReadingStartTime] = useState<number>(0);

  // Filter mythology items based on type and search
  const filteredItems = mythologyItems.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.origin.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Featured items for hero section
  const featuredItems = mythologyItems.filter(item => item.featured);

  // Handle item selection and reading tracking
  const handleItemSelect = (item: MythologyItem) => {
    setSelectedItem(item);
    setReadingStartTime(Date.now());
  };

  // Handle item close and record reading time
  const handleItemClose = () => {
    if (selectedItem && readingStartTime && user) {
      const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000);
      if (timeSpent > 10) { // Only record if spent more than 10 seconds
        recordReadingProgress(selectedItem.id, timeSpent, true);
      }
    }
    setSelectedItem(null);
    setReadingStartTime(0);
  };

  const mythologyTypes = [
    { id: 'all', label: 'All Types', color: 'gray', icon: Sparkles },
    { id: 'god', label: 'Gods', color: 'blue', icon: Crown },
    { id: 'goddess', label: 'Goddesses', color: 'purple', icon: Crown },
    { id: 'hero', label: 'Heroes', color: 'green', icon: Sword },
    { id: 'monster', label: 'Monsters', color: 'red', icon: Eye },
    { id: 'story', label: 'Stories', color: 'amber', icon: BookOpen },
    { id: 'place', label: 'Places', color: 'stone', icon: Zap }
  ];

  // Get type icon
  const getTypeIcon = (type: string) => {
    const typeInfo = mythologyTypes.find(t => t.id === type);
    const Icon = typeInfo?.icon || Sparkles;
    return <Icon className="h-4 w-4" />;
  };

  // Get type color
  const getTypeColor = (type: string) => {
    const typeInfo = mythologyTypes.find(t => t.id === type);
    return typeInfo?.color || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-greek-gold mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-stone-700">Loading Mythology...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-semibold mb-2">Error Loading Mythology</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen marble-texture">
      <Navbar />
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/mind" className="inline-flex items-center text-greek-blue hover:text-greek-gold transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Mind Training
            </Link>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-greek-blue mb-6">
              Greek Mythology
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Explore the rich tapestry of Greek mythology - from powerful gods and goddesses 
              to legendary heroes and mythical creatures that have shaped Western culture.
            </p>
            
            {user && userProfile && (
              <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">Your Learning Progress</h3>
                <Progress value={userProfile.completedItems.length * 10} className="w-full mb-2" />
                <p className="text-sm text-stone-600">
                  {userProfile.completedItems?.length || 0} mythology figures explored
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-greek-gold">{userProfile.statistics?.totalPoints || 0}</div>
                    <div className="text-xs text-stone-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userProfile.completedItems.length}</div>
                    <div className="text-xs text-stone-600">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userProfile.statistics?.currentLevel || 1}</div>
                    <div className="text-xs text-stone-600">Level</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Featured Mythology Items */}
          {featuredItems.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {featuredItems.slice(0, 3).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-greek-gold/20 text-greek-gold border-greek-gold">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    <Badge variant="outline" className={`bg-${getTypeColor(item.type)}-100 text-${getTypeColor(item.type)}-800`}>
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                  </div>
                  
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{item.name}</h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-500">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">{item.origin}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search mythology figures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {mythologyTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type.id)}
                      className={selectedType === type.id ? "bg-greek-gold hover:bg-greek-gold/90" : ""}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mythology Grid */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-stone-800">{item.name}</h3>
                  <Badge variant="outline" className={`bg-${getTypeColor(item.type)}-100 text-${getTypeColor(item.type)}-800`}>
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </Badge>
                </div>
                
                <p className="text-stone-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                
                {item.symbols && item.symbols.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-stone-700 mb-2">Symbols:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.symbols.slice(0, 3).map((symbol, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                      {item.symbols.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.symbols.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-500">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{item.origin}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Explore
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-stone-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-700 mb-2">No mythology figures found</h3>
              <p className="text-stone-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-stone-800">{selectedItem?.name}</h2>
                <p className="text-stone-500">{selectedItem?.origin}</p>
              </div>
              <button
                onClick={handleItemClose}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {selectedItem?.imageUrl && (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name || 'Mythology item'}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}

            <div className="mb-6">
              <Badge variant="outline" className={`mb-4 bg-${getTypeColor(selectedItem?.type || 'gray')}-100 text-${getTypeColor(selectedItem?.type || 'gray')}-800`}>
                {getTypeIcon(selectedItem?.type || 'story')}
                <span className="ml-1 capitalize">{selectedItem?.type}</span>
              </Badge>
              <p className="text-stone-700 leading-relaxed mb-4">{selectedItem?.description}</p>
            </div>

            {selectedItem?.symbols && selectedItem.symbols.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-stone-900 mb-2">Symbols</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.symbols.map((symbol, index) => (
                    <Badge key={index} variant="outline">
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedItem?.relatedFigures && selectedItem.relatedFigures.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-stone-900 mb-2">Related Figures</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.relatedFigures.map((figure, index) => (
                    <Badge key={index} variant="outline">
                      {figure}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedItem?.stories && selectedItem.stories.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-stone-900 mb-2">Related Stories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.stories.map((story, index) => (
                    <Badge key={index} variant="outline">
                      {story}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-greek-gold hover:bg-greek-gold/90"
                onClick={handleItemClose}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
              
              {user && (
                <div className="text-sm text-stone-600 mt-2">
                  Track your progress and earn achievements!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}