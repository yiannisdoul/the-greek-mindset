// src/app/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { CartProvider } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { useUserProgress } from '@/hooks/use-user-progress'
import { useDynamicContent } from '@/hooks/use-dynamic-content'
import { DynamicText } from '@/components/common/dynamic-text'
import { progressService } from '@/lib/progress-service'
import { QuizAttempt } from '@/types/quiz'
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle, 
  Target,
  Brain,
  History,
  MapPin,
  Star
} from 'lucide-react'

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { userProfile, userStats, loading: progressLoading } = useUserProgress();
  const { getContent, loading: contentLoading, error: contentError } = useDynamicContent('homepage');
  const [recentQuizzes, setRecentQuizzes] = useState<QuizAttempt[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Debug: Log content loading status
  React.useEffect(() => {
    console.log('Homepage - Content loading:', contentLoading, 'Error:', contentError);
    console.log('Sample content check:', {
      heroTitle: getContent('homepage.hero.title', 'DEFAULT_TITLE'),
      bodyTitle: getContent('homepage.body.title', 'DEFAULT_BODY')
    });
  }, [contentLoading, contentError, getContent]);

  // Fetch recent quiz attempts when user is available
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      if (!user) return;
      
      try {
        setLoadingQuizzes(true);
        const attempts = await progressService.getRecentQuizAttempts(user.uid, 5);
        setRecentQuizzes(attempts);
      } catch (error) {
        console.error('Error fetching recent quizzes:', error);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    fetchRecentQuizzes();
  }, [user]);

  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
      <Navbar />
    </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0">
        {/* Mission Statement Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-5xl mt-5 md:text-7xl font-bold text-greek-blue mb-6">
                {getContent('homepage.hero.title', 'The Greek Mindset')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-5xl mx-auto">
                {getContent('homepage.hero.subtitle', 'Ancient wisdom for modern living. Cultivate your mind and strengthen your body through the timeless principles of Greek philosophy and physical culture.')}
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-4 break-words">
                {getContent('homepage.hero.description', 'Embark on a journey of holistic development, where the pursuit of knowledge and physical excellence merge into a harmonious way of life. Discover the secrets that made ancient Greece the cradle of Western civilization and apply them to your modern existence.')}
              </p>
            </motion.div>

            {/* User Dashboard - Only show if logged in */}
            {user && !authLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16 max-w-6xl mx-auto"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-marble-200">
                  <h2 className="text-2xl font-bold text-greek-blue mb-6 text-center">
                    Welcome back, {user.name || user.email.split('@')[0]}!
                  </h2>
                  
                  {/* Progress Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">
                        {userStats?.completionRate || 0}%
                      </div>
                      <div className="text-sm text-blue-600">Completion Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">
                        {userStats?.totalTopicsCompleted || 0}
                      </div>
                      <div className="text-sm text-green-600">Topics Mastered</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                      <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-700">
                        {userProfile?.statistics?.totalPoints || 0}
                      </div>
                      <div className="text-sm text-yellow-600">Total Points</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-700">
                        {userProfile?.statistics?.currentLevel || 1}
                      </div>
                      <div className="text-sm text-purple-600">Current Level</div>
                    </div>
                  </div>

                  {/* Recent Quiz Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Knowledge Progress */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-greek-blue" />
                        Learning Progress
                      </h3>
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <History className="h-5 w-5 text-red-600 mr-2" />
                              <span className="text-sm font-medium">History</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {userStats?.categoryProgress?.history || 0}%
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${userStats?.categoryProgress?.history || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                              <span className="text-sm font-medium">Geography</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {userStats?.categoryProgress?.geography || 0}%
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${userStats?.categoryProgress?.geography || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-purple-600 mr-2" />
                              <span className="text-sm font-medium">Mythology</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {userStats?.categoryProgress?.mythology || 0}%
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${userStats?.categoryProgress?.mythology || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Brain className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-sm font-medium">Philosophy</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {userStats?.categoryProgress?.philosophy || 0}%
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${userStats?.categoryProgress?.philosophy || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Quiz Results */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-greek-blue" />
                        Recent Quiz Results
                      </h3>
                      <div className="space-y-3">
                        {loadingQuizzes ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-greek-blue mx-auto"></div>
                          </div>
                        ) : recentQuizzes.length > 0 ? (
                          recentQuizzes.map((quiz, index) => (
                            <div key={quiz.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  Quiz {quiz.id.slice(-8)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {quiz.completedAt ? new Date(quiz.completedAt).toLocaleDateString() : 'Recent'}
                                </div>
                              </div>
                              <div className={`text-sm font-bold ${
                                (quiz.score || 0) >= 80 ? 'text-green-600' : 
                                (quiz.score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {Math.round(quiz.score || 0)}%
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No recent quiz results. Start learning to see your progress!
                          </div>
                        )}
                      </div>
                      
                      {recentQuizzes.length > 0 && (
                        <div className="mt-4">
                          <Link href="/profile">
                            <Button variant="outline" className="w-full text-sm">
                              View All Results
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Choice Buttons */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Body Section */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="group h-full"
              >
                <Link href="/body">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-marble-200 h-full flex flex-col min-h-[480px]">
                    <div className="mb-6 flex justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        <span className="text-4xl">💪</span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-greek-blue mb-4">
                      {getContent('homepage.body.title', 'BODY')}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                      {getContent('homepage.body.description', 'Train like a Spartan warrior. Develop functional strength, agility, and endurance through ancient Greek training methods adapted for the modern world.')}
                    </p>
                    <div className="mt-6">
                      <Button className="bg-greek-gold hover:bg-greek-gold/90 text-white px-8 py-3 text-lg">
                        {getContent('homepage.body.buttonText', 'Begin Physical Training')}
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Mind Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="group h-full"
              >
                <Link href="/mind">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-marble-200 h-full flex flex-col min-h-[480px]">
                    <div className="mb-6 flex justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                        <span className="text-4xl">🧠</span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-greek-blue mb-4">
                      {getContent('homepage.mind.title', 'MIND')}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed flex-grow">
                      {getContent('homepage.mind.description', 'Explore the depths of Greek philosophy, history, and culture. Sharpen your intellect and gain wisdom that has guided humanity for millennia.')}
                    </p>
                    <div className="mt-6">
                      <Button className="bg-greek-blue hover:bg-greek-blue/90 text-white px-8 py-3 text-lg">
                        {getContent('homepage.mind.buttonText', 'Begin Mental Training')}
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Additional Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 mb-20"
            >
              <p className="text-lg text-gray-600 mb-6">
                "A sound mind in a sound body" - Juvenal
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/about">
                  <Button variant="outline" className="px-6 py-3">
                    Learn More About Us
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button variant="outline" className="px-6 py-3">
                    Explore Our Shop
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
