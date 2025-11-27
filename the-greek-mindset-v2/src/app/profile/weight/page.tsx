'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CartProvider } from '@/hooks/use-cart'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { WeightModal } from '@/components/profile/ProfileModals'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Scale,
  Target,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  BarChart3,
  Award,
  Clock,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
  createdAt: Date;
}

export default function WeightLogPage() {
  const { user } = useAuth()
  const {
    profile,
    weightHistory,
    loading,
    addWeightEntry,
    calculateBMI,
    getBMICategory,
    getWeightTrend
  } = useProfile()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months' | 'year' | 'all'>('month')

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
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to track your weight progress</p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-greek-gold hover:bg-greek-gold/90">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleAddWeight = async (weight: number, date: string, notes?: string) => {
    await addWeightEntry(weight, date, notes)
    setIsModalOpen(false)
  }

  // Filter weight history based on time range
  const getFilteredWeightHistory = () => {
    if (timeRange === 'all') return weightHistory

    const now = new Date()
    const ranges = {
      week: 7,
      month: 30,
      '3months': 90,
      year: 365
    }
    
    const daysBack = ranges[timeRange]
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
    
    return weightHistory.filter(entry => 
      new Date(entry.date) >= cutoffDate
    )
  }

  const filteredHistory = getFilteredWeightHistory()
  
  // Calculate weight statistics
  const currentWeight = weightHistory[0]?.weight
  const previousWeight = weightHistory[1]?.weight
  const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : 0
  const weightChangePercentage = previousWeight ? ((weightChange / previousWeight) * 100) : 0
  
  // Calculate goal progress (based on goal type)
  const startingWeight = weightHistory[weightHistory.length - 1]?.weight || currentWeight
  const goalType = profile?.profile?.goals
  
  // Estimate target weight based on goal (simplified calculation)
  const targetWeight = currentWeight && goalType ? (
    goalType === 'lose' ? currentWeight * 0.9 : // 10% weight loss goal
    goalType === 'gain' ? currentWeight * 1.1 :  // 10% weight gain goal
    currentWeight // maintain current weight
  ) : currentWeight
  
  const totalWeightToChange = startingWeight && targetWeight ? Math.abs(startingWeight - targetWeight) : 0
  const weightChanged = startingWeight && currentWeight ? Math.abs(startingWeight - currentWeight) : 0
  const progressPercentage = totalWeightToChange ? Math.min(100, (weightChanged / totalWeightToChange) * 100) : 0

  // Get trend for the selected period
  const trend = getWeightTrend()
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'increasing': return 'text-red-600 bg-red-50 border-red-200'
      case 'decreasing': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTrendText = () => {
    switch (trend) {
      case 'increasing': return 'Weight Increasing'
      case 'decreasing': return 'Weight Decreasing'
      default: return 'Weight Stable'
    }
  }

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
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Profile
                </Link>
              </Button>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-greek-blue mb-2 flex items-center gap-3">
                    <Scale className="h-8 w-8 text-greek-gold" />
                    Weight Tracker
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Monitor your weight progress and achieve your fitness goals
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-greek-gold hover:bg-greek-gold/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Log Weight
                  </Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Current Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Current Weight */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Current Weight</h3>
                <Scale className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentWeight ? `${currentWeight} kg` : 'No data'}
              </div>
              {weightChange !== 0 && (
                <div className={`flex items-center mt-2 text-sm ${weightChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {weightChange > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(weightChange).toFixed(1)} kg ({Math.abs(weightChangePercentage).toFixed(1)}%)
                </div>
              )}
            </div>

            {/* BMI */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">BMI</h3>
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {calculateBMI() || '--'}
              </div>
              {getBMICategory() && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {getBMICategory()}
                  </Badge>
                </div>
              )}
            </div>

            {/* Trend */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Trend</h3>
                {getTrendIcon()}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {getTrendText()}
              </div>
              <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium border ${getTrendColor()}`}>
                Last {filteredHistory.length} entries
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Progress</h3>
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {Math.round(progressPercentage)}%
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {weightChanged > 0 ? `${weightChanged.toFixed(1)} kg changed` : 'Towards goal'}
              </div>
            </div>
          </motion.div>

          {/* Time Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-greek-gold" />
                Weight History
              </h2>
              
              <div className="flex gap-2">
                {[
                  { key: 'week', label: '1W' },
                  { key: 'month', label: '1M' },
                  { key: '3months', label: '3M' },
                  { key: 'year', label: '1Y' },
                  { key: 'all', label: 'All' }
                ].map((range) => (
                  <Button
                    key={range.key}
                    variant={timeRange === range.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range.key as any)}
                    className={timeRange === range.key ? "bg-greek-gold hover:bg-greek-gold/90" : ""}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Weight Chart Placeholder */}
            <div className="mt-6 h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium mb-2">Weight Progress Chart</p>
                <p className="text-sm">Visual representation of your weight journey</p>
                <p className="text-sm">over the selected time period</p>
                <p className="text-xs mt-2 text-gray-400">
                  {filteredHistory.length} entries in {timeRange === 'all' ? 'total' : timeRange}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Weight Entries List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-marble-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-greek-gold" />
                Recent Entries ({filteredHistory.length})
              </h3>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="space-y-3">
                {filteredHistory.map((entry, index) => {
                  const prevEntry = filteredHistory[index + 1]
                  const change = prevEntry ? entry.weight - prevEntry.weight : 0
                  
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <Scale className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-gray-900">{entry.weight} kg</span>
                            {change !== 0 && (
                              <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
                                change > 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
                              }`}>
                                {change > 0 ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {Math.abs(change).toFixed(1)} kg
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          {entry.notes && (
                            <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                              "{entry.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No weight entries</h3>
                <p className="text-gray-600 mb-4">
                  Start tracking your weight progress by logging your first entry
                </p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-greek-gold hover:bg-greek-gold/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Weight
                </Button>
              </div>
            )}

            {filteredHistory.length > 10 && (
              <div className="mt-6 text-center">
                <Button variant="outline">
                  Load More Entries
                </Button>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Highest Weight */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {weightHistory.length > 0 ? Math.max(...weightHistory.map(w => w.weight)).toFixed(1) : '--'}
              </div>
              <div className="text-sm text-gray-600">Highest Weight (kg)</div>
              {weightHistory.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(
                    weightHistory.find(w => w.weight === Math.max(...weightHistory.map(w => w.weight)))?.date || ''
                  ).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Lowest Weight */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {weightHistory.length > 0 ? Math.min(...weightHistory.map(w => w.weight)).toFixed(1) : '--'}
              </div>
              <div className="text-sm text-gray-600">Lowest Weight (kg)</div>
              {weightHistory.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(
                    weightHistory.find(w => w.weight === Math.min(...weightHistory.map(w => w.weight)))?.date || ''
                  ).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Total Entries */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-marble-200 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {weightHistory.length}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
              {weightHistory.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Since {new Date(weightHistory[weightHistory.length - 1]?.date || '').toLocaleDateString()}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Weight Log Modal */}
      <WeightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddWeight}
        currentWeight={currentWeight}
      />
    </div>
  )
}