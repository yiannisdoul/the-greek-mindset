'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, MobileNavbar } from '@/components/layout/navbar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useGeographyData } from '@/hooks/use-geography-data';
import { useUserProgress } from '@/hooks/use-user-progress';
import { InteractiveMap } from '@/components/mind/interactive-map';
import { GeographyQuizComponent } from '@/components/mind/geography-quiz-component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { GeographyItem } from '@/types/admin';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  Award,
  BookOpen,
  Target,
  Compass,
  Globe,
  Mountain,
  Building,
  Landmark,
  Waves,
  ChevronRight,
  X,
  Play,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

export default function GeographyPage() {
  const { user } = useAuth();
  const { items: geographyItems, loading, error } = useGeographyData();
  const { 
    userProfile, 
    recordReadingProgress, 
    recordQuizAttempt, 
    getItemProgress 
  } = useUserProgress();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GeographyItem | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number>(0);

  // Geography types configuration
  const geographyTypes = [
    { id: 'all', label: 'All', icon: Globe, color: 'gray' },
    { id: 'city', label: 'Cities', icon: Building, color: 'blue' },
    { id: 'landmark', label: 'Landmarks', icon: Landmark, color: 'amber' },
    { id: 'island', label: 'Islands', icon: MapPin, color: 'green' },
    { id: 'mountain', label: 'Mountains', icon: Mountain, color: 'stone' },
    { id: 'sea', label: 'Seas', icon: Waves, color: 'blue' },
    { id: 'region', label: 'Regions', icon: Globe, color: 'purple' },
  ];

  // Filter and search items
  const filteredItems = useMemo(() => {
    if (!geographyItems) return [];
    
    let filtered = geographyItems;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [geographyItems, selectedType, searchTerm]);

  // Featured items
  const featuredItems = geographyItems?.filter(item => item.featured) || [];

  // User progress calculations (simplified for now)
  const progressStats = useMemo(() => {
    if (!geographyItems) return null;

    const totalItems = geographyItems.length;
    const readItems = userProfile?.completedItems?.length || 0;
    const completedQuizzes = userProfile?.statistics?.totalQuizzesTaken || 0;
    const averageScore = userProfile?.statistics?.averageScore || 0;

    return {
      totalItems,
      readItems,
      completedQuizzes,
      averageScore,
      progressPercentage: totalItems > 0 ? (readItems / totalItems) * 100 : 0
    };
  }, [geographyItems, userProfile]);

  // Handle item selection and reading tracking
  const handleItemSelect = (item: GeographyItem) => {
    setSelectedItem(item);
    setReadingStartTime(Date.now());
  };

  // Handle item close and record reading time
  const handleItemClose = () => {
    if (selectedItem && readingStartTime && user) {
      const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000);
      if (timeSpent > 10) { // Only record if spent more than 10 seconds
        recordReadingProgress(selectedItem.id, timeSpent, false);
      }
    }
    setSelectedItem(null);
    setReadingStartTime(0);
  };

  // Handle quiz completion
  const handleQuizComplete = async (score: number, answers: number[]) => {
    if (selectedItem && user) {
      try {
        const timeSpent = Math.floor((Date.now() - readingStartTime) / 1000);
        await recordQuizAttempt(selectedItem.id, answers, score, timeSpent);
        
        // Also mark reading as completed if quiz score is good
        if (score >= 70) {
          await recordReadingProgress(selectedItem.id, timeSpent, true);
        }
        
        setShowQuiz(false);
      } catch (error) {
        console.error('Error recording quiz completion:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greek-gold mx-auto mb-4"></div>
          <p className="text-stone-600">Loading geography content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading geography content: {error}</p>
          <p className="text-sm mt-2">Check console for more details</p>
        </div>
      </div>
    );
  }

  // If no items are loaded but no error
  if (!geographyItems || geographyItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 text-lg">No geography items found</p>
          <p className="text-sm text-stone-500 mt-2">Please add some geography items in the admin panel</p>
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
              Greek Geography
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Explore the magnificent landscapes, ancient cities, and natural wonders that shaped Greek civilization
            </p>
          </motion.div>

          {/* Progress Dashboard */}
          {user && progressStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
            >
              <h2 className="text-2xl font-bold text-greek-blue mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-greek-gold" />
                Your Geography Journey
              </h2>
            
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-greek-blue">{progressStats.readItems}</div>
                  <div className="text-sm text-gray-600">Locations Explored</div>
                  <Progress value={progressStats.progressPercentage} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-greek-gold">{progressStats.completedQuizzes}</div>
                  <div className="text-sm text-gray-600">Quizzes Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {progressStats.averageScore.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-greek-gold">{progressStats.totalItems}</div>
                  <div className="text-sm text-gray-600">Total Locations</div>
                </div>
              </div>

              {progressStats.progressPercentage > 0 && (
                <div className="bg-greek-gold/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-greek-gold" />
                    <span className="font-semibold text-greek-blue">Progress Milestone</span>
                  </div>
                  <p className="text-gray-600">
                    Great job! You've explored {progressStats.progressPercentage.toFixed(0)}% of Greek geography. 
                    {progressStats.progressPercentage > 50 && " You're becoming a true geography expert!"}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-greek-gold/30 focus:ring-greek-gold focus:border-greek-gold"
                  />
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {geographyTypes.map(type => {
                const Icon = type.icon;
                const count = type.id === 'all' ? geographyItems?.length || 0 : 
                  geographyItems?.filter(item => item.type === type.id).length || 0;

                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className={selectedType === type.id ? 'bg-greek-blue hover:bg-greek-blue/90' : 'border-greek-gold text-greek-blue hover:bg-greek-gold/10'}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {type.label}
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <InteractiveMap
            items={filteredItems}
            onItemClick={handleItemSelect}
            selectedItem={selectedItem}
            userProgress={{}}
          />
        </motion.div>

        {/* Featured Locations */}
        {featuredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-stone-800 mb-8 flex items-center gap-2">
              <Star className="h-7 w-7 text-greek-gold" />
              Featured Locations
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item, index) => {
                // Simplified progress checking for now
                const isRead = userProfile?.completedItems?.includes(item.id!) || false;
                const hasQuiz = false; // Will implement quiz tracking later
                const bestScore = 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-greek-gold/20 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleItemSelect(item)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-greek-blue group-hover:text-greek-gold transition-colors">
                        {item.name}
                      </h3>
                      <Star className="h-5 w-5 text-greek-gold fill-current" />
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge className="bg-greek-blue/10 text-greek-blue">
                        {item.type}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        {isRead && (
                          <Badge className="bg-green-100 text-green-800">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Read
                          </Badge>
                        )}
                        {hasQuiz && (
                          <Badge className="bg-amber-100 text-amber-800">
                            <Award className="h-3 w-3 mr-1" />
                            {bestScore}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-blue-200 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemSelect(item);
                        }}
                        className="flex-1"
                      >
                        <Compass className="h-4 w-4 mr-1" />
                        Explore
                      </Button>
                      {user && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setShowQuiz(true);
                            setReadingStartTime(Date.now());
                          }}
                          className="bg-greek-gold hover:bg-greek-gold/90"
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

          {/* All Locations Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-greek-gold/20"
          >
            <h2 className="text-3xl font-bold text-greek-blue mb-8 flex items-center gap-2">
              <MapPin className="h-7 w-7 text-greek-blue" />
              All Locations ({filteredItems.length})
            </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              // Simplified progress checking for now
              const isRead = userProfile?.completedItems?.includes(item.id!) || false;
              const hasQuiz = false; // Will implement quiz tracking later

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-greek-gold/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-greek-blue group-hover:text-greek-gold transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {item.featured && <Star className="h-4 w-4 text-greek-gold fill-current" />}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-greek-gold transition-colors" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-greek-blue/10 text-greek-blue">{item.type}</Badge>
                    <div className="flex items-center gap-1">
                      {isRead && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      {hasQuiz && <Award className="h-4 w-4 text-greek-gold" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No locations found matching your criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                  }}
                  className="mt-4 border-greek-gold text-greek-blue hover:bg-greek-gold/10"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>
          
          {/* Location Detail Modal */}
          <Dialog open={!!selectedItem && !showQuiz} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  {selectedItem.name}
                  {selectedItem.featured && <Star className="h-5 w-5 text-greek-gold fill-current" />}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <Badge className="mb-4 bg-blue-100 text-blue-800">
                    {selectedItem.type}
                  </Badge>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {user && (
                  <div className="flex gap-4 pt-4 border-t">
                    <Button 
                      onClick={() => setShowQuiz(true)}
                      className="bg-greek-blue hover:bg-greek-blue/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Take Quiz
                    </Button>
                    <Button variant="outline" onClick={handleItemClose} className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

          {/* Geography Quiz Modal */}
          {showQuiz && selectedItem && (
            <GeographyQuizComponent
              geographyItem={selectedItem!}
              onComplete={handleQuizComplete}
              onClose={() => setShowQuiz(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}