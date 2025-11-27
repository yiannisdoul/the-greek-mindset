'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, MobileNavbar } from '@/components/layout/navbar';
import Link from 'next/link';
import { Brain, Search, Filter, Star, Quote, Clock, Users, BookOpen, X, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { PhilosophyItem } from '@/types/admin';
import { usePhilosophyData } from '@/hooks/use-philosophy-data';
import { useAuth } from '@/hooks/use-auth';
import { useUserProgress } from '@/hooks/use-user-progress';

const schoolColors = {
  'pre-socratic': 'bg-purple-100 text-purple-800 border-purple-200',
  'classical': 'bg-blue-100 text-blue-800 border-blue-200', 
  'hellenistic': 'bg-green-100 text-green-800 border-green-200',
  'neoplatonic': 'bg-amber-100 text-amber-800 border-amber-200',
  'other': 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function PhilosophyPage() {
  const { items: philosophyItems, loading } = usePhilosophyData();
  const { user } = useAuth();
  const { userProfile } = useUserProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PhilosophyItem | null>(null);

  // Filter items
  const filteredItems = philosophyItems.filter(item => {
    const matchesSearch = item.philosopher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = selectedSchool === 'all' || item.school === selectedSchool;
    return matchesSearch && matchesSchool;
  });

  const featuredItems = philosophyItems.filter(item => item.featured).slice(0, 3);

  // Get unique schools
  const schools = Array.from(new Set(philosophyItems.map(item => item.school)));
  const schoolCounts = schools.reduce((acc, school) => {
    acc[school] = philosophyItems.filter(item => item.school === school).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-stone-600">Loading philosophy content...</p>
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
              Greek Philosophy
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Explore the profound wisdom and revolutionary ideas of ancient Greek philosophers who laid the 
              foundation for Western thought and continue to influence our understanding of life, ethics, and reality.
            </p>
          </motion.div>

          {/* User Progress Dashboard */}
          {user && userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
            >
              <h3 className="text-lg font-semibold text-greek-blue mb-4">Your Philosophy Journey</h3>
              <Progress value={userProfile.completedItems.length * 10} className="w-full mb-2" />
              <p className="text-sm text-gray-600 mb-4">
                {userProfile.completedItems?.length || 0} philosophy concepts explored
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-greek-gold">{userProfile.statistics?.totalPoints || 0}</div>
                  <div className="text-xs text-gray-600">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userProfile.completedItems.length}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-greek-blue">{userProfile.statistics?.currentLevel || 1}</div>
                  <div className="text-xs text-gray-600">Level</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Philosophy Items */}
          {featuredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-greek-gold/20"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="bg-greek-gold/20 text-greek-gold border-greek-gold">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    <Badge className={`${schoolColors[item.school]}`}>
                      {item.school.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.philosopher}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="text-left">
                      <h3 className="font-bold text-stone-800">{item.philosopher}</h3>
                      <p className="text-sm text-stone-600">{item.concept}</p>
                    </div>
                  </div>
                  
                  <p className="text-stone-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{item.timeframe}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search philosophers, concepts, or teachings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-greek-gold/30 focus:ring-greek-gold focus:border-greek-gold"
                />
              </div>

              {/* School Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedSchool === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSchool('all')}
                  className={selectedSchool === 'all' ? "bg-greek-gold hover:bg-greek-gold/90" : "border-greek-gold text-greek-blue hover:bg-greek-gold/10"}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  All Schools ({philosophyItems.length})
                </Button>
                {schools.map(school => (
                  <Button
                    key={school}
                    variant={selectedSchool === school ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSchool(school)}
                    className={selectedSchool === school ? "bg-greek-gold hover:bg-greek-gold/90 capitalize" : "border-greek-gold text-greek-blue hover:bg-greek-gold/10 capitalize"}
                  >
                    {school.replace('-', ' ')} ({schoolCounts[school]})
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Philosophy Items Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-greek-gold/20"
          >
            <h2 className="text-3xl font-bold text-greek-blue mb-8 flex items-center gap-2">
              <Brain className="h-7 w-7 text-greek-blue" />
              All Philosophy ({filteredItems.length})
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-greek-gold/20 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.philosopher}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-greek-blue group-hover:text-greek-gold transition-colors">
                        {item.philosopher}
                      </h3>
                      <p className="text-sm text-gray-600">{item.concept}</p>
                    </div>
                  </div>
                  {item.featured && <Star className="h-4 w-4 text-greek-gold fill-current" />}
                </div>

                <Badge className={`${schoolColors[item.school]} mb-3`}>
                  {item.school.replace('-', ' ')}
                </Badge>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                
                {item.quote && (
                  <div className="bg-greek-gold/5 rounded-lg p-3 mb-4">
                    <Quote className="h-4 w-4 text-greek-gold mb-1" />
                    <p className="text-gray-700 text-sm italic line-clamp-2">"{item.quote}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.timeframe}</span>
                  </div>
                  {item.relatedConcepts && item.relatedConcepts.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{item.relatedConcepts.length} related</span>
                    </div>
                  )}
                </div>
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No philosophy items found matching your criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSchool('all');
                  }}
                  className="mt-4 border-greek-gold text-greek-blue hover:bg-greek-gold/10"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>

        </div>
      </main>

      {/* Philosophy Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {selectedItem.imageUrl && (
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.philosopher}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-3xl font-bold text-stone-800">{selectedItem.philosopher}</h2>
                  <p className="text-stone-500">{selectedItem.concept}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <Badge className={`${schoolColors[selectedItem.school]} mb-4`}>
                {selectedItem.school.replace('-', ' ')}
              </Badge>
              <p className="text-stone-700 leading-relaxed mb-4">{selectedItem.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-stone-800 mb-2">Historical Significance</h3>
              <p className="text-stone-600">{selectedItem.significance}</p>
            </div>

            {selectedItem.quote && (
              <div className="mb-6">
                <h3 className="font-semibold text-stone-800 mb-2">Famous Quote</h3>
                <div className="bg-greek-gold/5 rounded-lg p-4">
                  <Quote className="h-5 w-5 text-greek-gold mb-2" />
                  <p className="text-stone-700 italic">"{selectedItem.quote}"</p>
                </div>
              </div>
            )}

            {selectedItem.relatedConcepts && selectedItem.relatedConcepts.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-stone-800 mb-2">Related Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.relatedConcepts.map((concept, index) => (
                    <Badge key={index} variant="outline" className="bg-greek-blue/10 text-greek-blue">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <Button 
                className="flex-1 bg-greek-gold hover:bg-greek-gold/90"
                onClick={() => setSelectedItem(null)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
              
              {user && (
                <div className="text-sm text-gray-600 mt-2">
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