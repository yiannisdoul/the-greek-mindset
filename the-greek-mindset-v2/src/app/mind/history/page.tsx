'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, MobileNavbar } from '@/components/layout/navbar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useHistoryData } from '@/hooks/use-history-data';
import { useUserProgress } from '@/hooks/use-user-progress';
import { HistoryItem } from '@/types/admin';
import { Timeline } from '@/components/mind/timeline';
import { QuizComponent } from '@/components/mind/quiz-component';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Star, 
  BookOpen, 
  Trophy, 
  Filter,
  Search,
  Play,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const { data: historyItems, loading, error } = useHistoryData();
  const { 
    userStats, 
    recordQuizAttempt, 
    recordReadingProgress,
    loading: progressLoading 
  } = useUserProgress();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number>(0);

  // Filter history items based on category and search
  const filteredItems = historyItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured items for hero section
  const featuredItems = historyItems.filter(item => item.featured);

  // Handle item selection and reading tracking
  const handleItemSelect = (item: HistoryItem) => {
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

  const categories = [
    { id: 'all', label: 'All Periods', color: 'gray' },
    { id: 'ancient', label: 'Ancient', color: 'blue' },
    { id: 'classical', label: 'Classical', color: 'green' },
    { id: 'hellenistic', label: 'Hellenistic', color: 'purple' },
    { id: 'byzantine', label: 'Byzantine', color: 'amber' },
    { id: 'modern', label: 'Modern', color: 'red' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen marble-texture flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-greek-gold mb-4 mx-auto"></div>
          <h2 className="text-2xl font-semibold text-greek-blue">Loading History...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen marble-texture flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-semibold mb-2">Error Loading History</h2>
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
              Greek History
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Journey through millennia of Greek civilization, from ancient myths to modern achievements.
            </p>
          </motion.div>
            
          {user && userStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
            >
              <h3 className="text-lg font-semibold text-greek-blue mb-4">Your Learning Progress</h3>
              <Progress value={userStats.completionRate || 0} className="w-full mb-2" />
              <p className="text-sm text-gray-600 mb-4">
                {userStats.totalTopicsCompleted || 0} of {userStats.totalTopicsStarted || 0} topics completed
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-greek-gold">{userStats.totalPoints || 0}</div>
                  <div className="text-xs text-gray-600">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.totalAchievements || 0}</div>
                  <div className="text-xs text-gray-600">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-greek-blue">{userStats.currentLevel || 1}</div>
                  <div className="text-xs text-gray-600">Level</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured History Items */}
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
                    <Badge variant="outline">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{item.period}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search history events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-greek-gold"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-greek-gold hover:bg-greek-gold/90" : ""}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* History Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
          >
            <Timeline 
              items={filteredItems}
              onItemClick={handleItemSelect}
              userProgress={{}}
            />
          </motion.div>
        </div>
      </main>

      {/* Quiz Modal */}
      {showQuiz && selectedItem && (
        <QuizComponent
          historyItem={selectedItem}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Item Detail Modal */}
      {selectedItem && !showQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-stone-800">{selectedItem.title}</h2>
                <p className="text-stone-500">{selectedItem.period}</p>
              </div>
              <button
                onClick={handleItemClose}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {selectedItem.imageUrl && (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
            )}

            <div className="mb-6">
              <Badge variant="outline" className="mb-4">
                {selectedItem.category}
              </Badge>
              <p className="text-stone-700 leading-relaxed mb-4">{selectedItem.description}</p>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-greek-gold hover:bg-greek-gold/90"
                onClick={() => setShowQuiz(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                Take Quiz
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