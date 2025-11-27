// src/app/profile/page.tsx
'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CartProvider } from '@/hooks/use-cart'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { useUserProgress } from '@/hooks/use-user-progress'
import { useProfile } from '@/hooks/use-profile'
import { WeightModal, MeasurementModal } from '@/components/profile/ProfileModals'
import { 
  User, 
  Settings, 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  Book,
  MapPin,
  Zap,
  Scroll,
  Dumbbell,
  Calendar,
  Trophy,
  Heart,
  Flame,
  CheckCircle,
  Plus,
  Edit3,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, updateProfile: authUpdateProfile, logout } = useAuth()
  const { 
    userProfile, 
    userStats, 
    recommendations, 
    loading: progressLoading 
  } = useUserProgress()

  const {
    profile,
    weightHistory,
    bodyMeasurements,
    workoutHistory,
    stats,
    loading: profileLoading,
    updateProfile,
    updatePreferences,
    updateNotificationSettings,
    addWeightEntry,
    addBodyMeasurement,
    calculateBMI,
    getBMICategory,
    getWeightTrend
  } = useProfile()
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('progress')
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false)
  
  const [profileData, setProfileData] = useState({
    height: user?.profile?.height || profile?.profile?.height || '',
    weight: user?.profile?.weight || profile?.profile?.weight || '',
    age: user?.profile?.age || profile?.profile?.age || '',
    gender: user?.profile?.gender || profile?.profile?.gender || 'other',
    goals: user?.profile?.goals || profile?.profile?.goals || 'maintain'
  })

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen marble-texture flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-marble-200"
        >
          <div className="w-16 h-16 bg-greek-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your profile and track your progress</p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-greek-gold hover:bg-greek-gold/90">
              <a href="/auth/login">Sign In</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/auth/signup">Create Account</a>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        height: Number(profileData.height) || undefined,
        weight: Number(profileData.weight) || undefined,
        age: Number(profileData.age) || undefined,
        gender: profileData.gender as 'male' | 'female' | 'other',
        goals: profileData.goals as 'gain' | 'maintain' | 'lose'
      })
      
      // Also update auth context for backwards compatibility
      await authUpdateProfile({
        height: Number(profileData.height) || undefined,
        weight: Number(profileData.weight) || undefined,
        age: Number(profileData.age) || undefined,
        gender: profileData.gender as 'male' | 'female' | 'other',
        goals: profileData.goals as 'gain' | 'maintain' | 'lose'
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const handleAddWeight = async (weight: number, date: string, notes?: string) => {
    await addWeightEntry(weight, date, notes)
  }

  const handleAddMeasurement = async (type: string, measurement: number, date: string, notes?: string) => {
    await addBodyMeasurement(type as any, measurement, date, notes)
  }

  const progress = userStats ? {
    history: userStats.completionRate || 0,
    geography: 8, // Will be updated when geography tracking is added
    mythology: 22, // Will be updated when mythology tracking is added
    philosophy: 12, // Will be updated when philosophy tracking is added
    overall: userStats.completionRate || 0
  } : {
    history: 0,
    geography: 0,
    mythology: 0,
    philosophy: 0,
    overall: 0
  }

  const achievements = [
    { id: 1, title: 'Knowledge Seeker', description: 'Joined The Greek Mindset', icon: '🧠', earned: true, date: '2024-01-15' },
    { id: 2, title: 'History Novice', description: 'Completed first history quiz', icon: '🏛️', earned: true, date: '2024-01-16' },
    { id: 3, title: 'Spartan Recruit', description: 'Completed first workout', icon: '⚔️', earned: true, date: '2024-01-17' },
    { id: 4, title: 'Philosophy Student', description: 'Read 5 philosophy articles', icon: '📚', earned: false, progress: 2 },
    { id: 5, title: 'Geography Explorer', description: 'Explore 10 ancient cities', icon: '🗺️', earned: false, progress: 3 },
    { id: 6, title: 'Mythology Master', description: 'Learn about 20 Greek gods', icon: '⚡', earned: false, progress: 8 },
  ]

  const mockWorkoutHistory = [
    { id: 1, name: 'Morning Spartan', duration: 20, date: '2024-01-17', completed: true },
    { id: 2, name: 'Warrior Training', duration: 35, date: '2024-01-15', completed: true },
    { id: 3, name: 'Core Strength', duration: 15, date: '2024-01-14', completed: true },
  ]

  const quizResults = [
    { id: 1, subject: 'History', title: 'Ancient Athens', score: 85, maxScore: 100, date: '2024-01-16' },
    { id: 2, subject: 'Mythology', title: 'Olympic Gods', score: 92, maxScore: 100, date: '2024-01-15' },
    { id: 3, subject: 'Philosophy', title: 'Socratic Method', score: 78, maxScore: 100, date: '2024-01-14' },
  ]

  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-greek-gold to-greek-gold/80 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-greek-blue mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 mb-4 text-lg">
                  Continue your journey of mind and body development
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-greek-gold">
                      {Math.round(progress.overall)}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {userStats?.totalAchievements || achievements.filter(a => a.earned).length}
                    </div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {userStats?.totalPoints || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {userStats?.totalQuizzesTaken || 0}
                    </div>
                    <div className="text-sm text-gray-600">Quizzes Taken</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {userStats?.currentLevel || 1}
                    </div>
                    <div className="text-sm text-gray-600">Current Level</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="body" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Body</span>
              </TabsTrigger>
              <TabsTrigger value="workouts" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span className="hidden sm:inline">Workouts</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Knowledge Progress */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Book className="h-6 w-6 text-greek-gold" />
                    Knowledge Progress
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Individual Subject Progress */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Scroll className="h-5 w-5 text-amber-600" />
                            <span className="font-medium text-lg">History</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-600">{progress.history}%</span>
                        </div>
                        <Progress value={progress.history} className="h-3" />
                        <p className="text-sm text-gray-500 mt-1">Next: The Persian Wars</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-lg">Geography</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-600">{progress.geography}%</span>
                        </div>
                        <Progress value={progress.geography} className="h-3" />
                        <p className="text-sm text-gray-500 mt-1">Next: Ancient Sparta</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-lg">Mythology</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-600">{progress.mythology}%</span>
                        </div>
                        <Progress value={progress.mythology} className="h-3" />
                        <p className="text-sm text-gray-500 mt-1">Next: Heroes of Troy</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Book className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-lg">Philosophy</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-600">{progress.philosophy}%</span>
                        </div>
                        <Progress value={progress.philosophy} className="h-3" />
                        <p className="text-sm text-gray-500 mt-1">Next: Plato's Republic</p>
                      </div>
                    </div>

                    {/* Overall Progress Circle */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#D4AF37"
                            strokeWidth="2"
                            strokeDasharray={`${progress.overall}, 100`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-greek-gold mb-1">
                              {Math.round(progress.overall)}%
                            </div>
                            <div className="text-sm text-gray-600">Overall Progress</div>
                            <div className="text-xs text-gray-500 mt-1">Keep going!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Quiz Results */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-greek-gold" />
                    Recent Quiz Results
                  </h3>
                  <div className="space-y-3">
                    {quizResults.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            quiz.score >= 90 ? 'bg-green-500' : 
                            quiz.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <h4 className="font-medium">{quiz.title}</h4>
                            <p className="text-sm text-gray-600">{quiz.subject}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {quiz.score}/{quiz.maxScore}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(quiz.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Award className="h-5 w-5 text-greek-gold" />
                    Achievements
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.earned
                            ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className={`font-semibold ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                              {achievement.title}
                            </h4>
                            {achievement.earned && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                <span className="text-xs">Earned</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                        {!achievement.earned && achievement.progress && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/10</span>
                            </div>
                            <Progress value={(achievement.progress / 10) * 100} className="h-2" />
                          </div>
                        )}
                        {achievement.earned && (
                          <div className="text-xs text-green-500 mt-1">
                            Earned: {new Date(achievement.date!).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Recommendations */}
                {recommendations && recommendations.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Target className="h-6 w-6 text-greek-gold" />
                      Recommended for You
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {recommendations.slice(0, 4).map((rec, index) => (
                        <div key={rec.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(rec.confidence * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Book className="h-3 w-3 mr-1" />
                            Explore Topic
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Body Tracker Tab */}
            <TabsContent value="body">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-greek-gold" />
                    Body Progress Tracker
                  </h2>
                  
                  <div className="mb-6 p-4 bg-gradient-to-r from-greek-gold/10 to-greek-blue/10 rounded-lg border border-greek-gold/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Detailed Weight Tracking</h4>
                        <p className="text-sm text-gray-600">Track your weight progress with charts, trends, and detailed history</p>
                      </div>
                      <Button asChild size="sm" className="bg-greek-gold hover:bg-greek-gold/90">
                        <Link href="/profile/weight">
                          View Tracker
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Current Stats */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Current Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">Height</span>
                          </div>
                          <span className="text-greek-blue font-semibold">
                            {profile?.profile?.height ? `${profile.profile.height} cm` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium">Current Weight</span>
                          </div>
                          <div className="text-right">
                            <div className="text-greek-blue font-semibold">
                              {weightHistory[0]?.weight ? `${weightHistory[0].weight} kg` : 
                               profile?.profile?.weight ? `${profile.profile.weight} kg` : 'Not set'}
                            </div>
                            {weightHistory.length > 1 && (
                              <div className="text-xs text-gray-500">
                                {getWeightTrend() === 'increasing' && '↗️ Increasing'}
                                {getWeightTrend() === 'decreasing' && '↘️ Decreasing'}
                                {getWeightTrend() === 'stable' && '➡️ Stable'}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="font-medium">Goal</span>
                          </div>
                          <span className="text-greek-blue font-semibold capitalize">
                            {profile?.profile?.goals ? `${profile.profile.goals} weight` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="font-medium">BMI</span>
                          </div>
                          <div className="text-right">
                            <div className="text-greek-blue font-semibold">
                              {calculateBMI() || 'Calculate'}
                            </div>
                            {getBMICategory() && (
                              <div className="text-xs text-gray-500">
                                {getBMICategory()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Chart Placeholder */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Progress Visualization</h3>
                      <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center text-gray-500">
                          <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="font-medium mb-2">Progress Chart</p>
                          <p className="text-sm">Track your weight and measurements</p>
                          <p className="text-sm">over time to see your progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Button 
                    asChild
                    className="h-24 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex-col"
                  >
                    <Link href="/profile/weight">
                      <div className="text-3xl mb-2">⚖️</div>
                      <div>Weight Tracker</div>
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => setIsMeasurementModalOpen(true)}
                    className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-col"
                  >
                    <div className="text-3xl mb-2">📐</div>
                    <div>Measurements</div>
                  </Button>
                  <Button className="h-24 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex-col">
                    <div className="text-3xl mb-2">📸</div>
                    <div>Progress Photo</div>
                  </Button>
                  <Button className="h-24 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex-col">
                    <div className="text-3xl mb-2">📝</div>
                    <div>Add Notes</div>
                  </Button>
                </div>

                {/* Weight History */}
                {weightHistory.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Weight History
                    </h3>
                    <div className="space-y-2">
                      {weightHistory.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{entry.weight} kg</div>
                            <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</div>
                          </div>
                          {entry.notes && (
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {entry.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {weightHistory.length > 5 && (
                        <Button asChild variant="outline" className="flex-1">
                          <Link href="/profile/weight">
                            View All Entries ({weightHistory.length})
                          </Link>
                        </Button>
                      )}
                      <Button asChild className="bg-greek-gold hover:bg-greek-gold/90">
                        <Link href="/profile/weight">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Entry
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Body Measurements */}
                {bodyMeasurements.length > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      Recent Measurements
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {['waist', 'chest', 'arms', 'thighs'].map((type) => {
                        const measurement = bodyMeasurements.find(m => m.type === type)
                        return (
                          <div key={type} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize">{type}</span>
                              <span className="text-blue-600 font-semibold">
                                {measurement ? `${measurement.measurement} cm` : 'No data'}
                              </span>
                            </div>
                            {measurement && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(measurement.date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Body Goals */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Health Goals
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Cardiovascular</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Resting Heart Rate</span>
                          <span className="font-medium">-- bpm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Target Zone</span>
                          <span className="font-medium">120-150 bpm</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Strength</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Push-ups (max)</span>
                          <span className="font-medium">-- reps</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Plank (max)</span>
                          <span className="font-medium">-- sec</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Flexibility</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sit & Reach</span>
                          <span className="font-medium">-- cm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shoulder Mobility</span>
                          <span className="font-medium">Good</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Workouts Tab */}
            <TabsContent value="workouts">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-greek-gold" />
                    Workout Dashboard
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Quick Start Templates */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Quick Start Templates</h3>
                      <div className="space-y-3">
                        <div className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-green-800">Morning Spartan</h4>
                              <p className="text-sm text-green-600">20 min • Beginner • Bodyweight</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-gray-600">150-200 calories</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Start</Button>
                          </div>
                        </div>
                        <div className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-yellow-800">Warrior Training</h4>
                              <p className="text-sm text-yellow-600">35 min • Intermediate • Mixed</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-gray-600">300-400 calories</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">Start</Button>
                          </div>
                        </div>
                        <div className="p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-red-800">Elite Challenge</h4>
                              <p className="text-sm text-red-600">45 min • Advanced • High Intensity</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                <span className="text-xs text-gray-600">500-600 calories</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">Start</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Custom Workout Builder */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Build Custom Workout</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Workout Name
                          </label>
                          <Input placeholder="My Custom Spartan Workout" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration (min)
                            </label>
                            <Input type="number" placeholder="30" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Difficulty
                            </label>
                            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Target Muscle Groups
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs'].map((muscle) => (
                              <label key={muscle} className="flex items-center">
                                <input type="checkbox" className="mr-2 rounded border-gray-300 text-greek-gold" />
                                {muscle}
                              </label>
                            ))}
                          </div>
                        </div>
                        <Button className="w-full bg-greek-gold hover:bg-greek-gold/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Workout
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workout History */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-greek-gold" />
                    Recent Workouts
                  </h3>
                  
                  {workoutHistory.length > 0 ? (
                    <div className="space-y-4">
                      {workoutHistory.map((workout) => (
                        <div key={workout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{workout.workoutName}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {workout.duration} min
                                </span>
                                <span>{new Date(workout.completedAt).toLocaleDateString()}</span>
                                <Badge variant="outline" className="text-xs">
                                  {workout.difficulty}
                                </Badge>
                                {workout.caloriesBurned && (
                                  <span className="flex items-center gap-1 text-orange-600">
                                    <Flame className="h-3 w-3" />
                                    {workout.caloriesBurned} cal
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit3 className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" className="bg-greek-blue hover:bg-greek-blue/90">
                              Repeat
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No workouts completed yet</p>
                      <p className="text-sm mb-4">Start your first Spartan workout to begin tracking your progress</p>
                      <Button asChild className="bg-greek-gold hover:bg-greek-gold/90">
                        <a href="/body/spartan-workout">Start First Workout</a>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Workout Statistics */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats?.totalWorkouts || 0}</div>
                    <div className="text-sm text-gray-600">Total Workouts</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats?.totalTimeSpent || 0}
                    </div>
                    <div className="text-sm text-gray-600">Minutes Trained</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {workoutHistory.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Calories Burned</div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stats?.currentStreak || 0}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Profile Settings Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Settings className="h-6 w-6 text-greek-gold" />
                      Profile Settings
                    </h2>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleSaveProfile}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="bg-greek-gold hover:bg-greek-gold/90"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <User className="h-5 w-5 text-greek-blue" />
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <Input 
                            value={profile?.name || user?.name || ''} 
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-gray-50' : ''}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <Input 
                            value={profile?.email || user?.email || ''} 
                            disabled
                            className="bg-gray-50"
                          />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age
                          </label>
                          <Input 
                            type="number"
                            value={profileData.age}
                            onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-gray-50' : ''}
                            placeholder="Enter your age"
                            min="13"
                            max="120"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select 
                            value={profileData.gender}
                            onChange={(e) => setProfileData({...profileData, gender: e.target.value as 'male' | 'female' | 'other'})}
                            disabled={!isEditing}
                            className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Body Metrics & Goals */}
                    <div>
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Target className="h-5 w-5 text-greek-blue" />
                        Body Metrics & Goals
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Height (cm)
                          </label>
                          <Input 
                            type="number"
                            value={profileData.height}
                            onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-gray-50' : ''}
                            placeholder="Enter your height in centimeters"
                            min="100"
                            max="250"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (kg)
                          </label>
                          <Input 
                            type="number"
                            value={profileData.weight}
                            onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                            disabled={!isEditing}
                            className={!isEditing ? 'bg-gray-50' : ''}
                            placeholder="Enter your weight in kilograms"
                            min="30"
                            max="300"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fitness Goal
                          </label>
                          <select 
                            value={profileData.goals}
                            onChange={(e) => setProfileData({...profileData, goals: e.target.value as 'gain' | 'maintain' | 'lose'})}
                            disabled={!isEditing}
                            className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
                          >
                            <option value="lose">Lose Weight</option>
                            <option value="maintain">Maintain Weight</option>
                            <option value="gain">Gain Weight/Muscle</option>
                          </select>
                        </div>
                        
                        {/* BMI Calculator */}
                        {profileData.height && profileData.weight && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-2">Calculated BMI</h4>
                            <div className="text-2xl font-bold text-blue-600">
                              {((Number(profileData.weight) / ((Number(profileData.height) / 100) ** 2)).toFixed(1))}
                            </div>
                            <p className="text-sm text-blue-600 mt-1">
                              {(() => {
                                const bmi = Number(profileData.weight) / ((Number(profileData.height) / 100) ** 2);
                                if (bmi < 18.5) return "Underweight";
                                if (bmi < 25) return "Normal weight";
                                if (bmi < 30) return "Overweight";
                                return "Obese";
                              })()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Account Actions</h3>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        Change Password
                      </Button>
                      <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        Download Data
                      </Button>
                      <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                        Privacy Settings
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Preferences</h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Notifications</h4>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Workout reminders</span>
                          <input 
                            type="checkbox" 
                            checked={profile?.profile?.notifications?.workoutReminders ?? true}
                            onChange={(e) => updateNotificationSettings({ workoutReminders: e.target.checked })}
                            className="rounded border-gray-300 text-greek-gold" 
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Progress updates</span>
                          <input 
                            type="checkbox" 
                            checked={profile?.profile?.notifications?.progressUpdates ?? true}
                            onChange={(e) => updateNotificationSettings({ progressUpdates: e.target.checked })}
                            className="rounded border-gray-300 text-greek-gold" 
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">New content alerts</span>
                          <input 
                            type="checkbox" 
                            checked={profile?.profile?.notifications?.newContent ?? false}
                            onChange={(e) => updateNotificationSettings({ newContent: e.target.checked })}
                            className="rounded border-gray-300 text-greek-gold" 
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Email newsletters</span>
                          <input 
                            type="checkbox" 
                            checked={profile?.profile?.notifications?.emailNewsletter ?? false}
                            onChange={(e) => updateNotificationSettings({ emailNewsletter: e.target.checked })}
                            className="rounded border-gray-300 text-greek-gold" 
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Display Settings</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select 
                            value={profile?.profile?.preferences?.language || 'en'}
                            onChange={(e) => updatePreferences({ language: e.target.value as any })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="en">English</option>
                            <option value="el">Greek (Ελληνικά)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Units
                          </label>
                          <select 
                            value={profile?.profile?.preferences?.units || 'metric'}
                            onChange={(e) => updatePreferences({ units: e.target.value as any })}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="metric">Metric (kg, cm)</option>
                            <option value="imperial">Imperial (lbs, ft/in)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSubmit={handleAddWeight}
        currentWeight={weightHistory[0]?.weight || profile?.profile?.weight}
      />

      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        onSubmit={handleAddMeasurement}
      />
    </div>
  )
}