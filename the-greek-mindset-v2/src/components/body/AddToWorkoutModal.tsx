'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Plus, Dumbbell, Clock } from 'lucide-react'
import { UserWorkout } from '@/types/workout'

interface AddToWorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: any
  userWorkouts: UserWorkout[]
  onCreateWorkout: (name: string, exercises: any[], difficulty: 'beginner' | 'intermediate' | 'advanced') => Promise<string>
  onAddToExistingWorkout: (workoutId: string, exercise: any) => Promise<void>
  isSubmitting?: boolean
}

export function AddToWorkoutModal({
  isOpen,
  onClose,
  exercise,
  userWorkouts,
  onCreateWorkout,
  onAddToExistingWorkout,
  isSubmitting = false
}: AddToWorkoutModalProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('')
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [newWorkoutDifficulty, setNewWorkoutDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  const handleSubmit = async () => {
    try {
      if (mode === 'existing' && selectedWorkoutId) {
        await onAddToExistingWorkout(selectedWorkoutId, exercise)
      } else if (mode === 'new' && newWorkoutName.trim()) {
        await onCreateWorkout(newWorkoutName.trim(), [exercise], newWorkoutDifficulty)
      }
      onClose()
      // Reset form
      setSelectedWorkoutId('')
      setNewWorkoutName('')
      setMode('existing')
    } catch (error) {
      console.error('Error adding to workout:', error)
    }
  }

  const canSubmit = mode === 'existing' ? selectedWorkoutId : newWorkoutName.trim()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-greek-gold/10 rounded-full flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-greek-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Add to Workout</h2>
                    <p className="text-sm text-gray-600">{exercise?.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Exercise Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-800">{exercise?.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Muscle Group: <span className="capitalize">{exercise?.muscleGroup}</span></div>
                    <div>Difficulty: <span className="capitalize">{exercise?.difficulty}</span></div>
                    {exercise?.reps && <div>Reps: {exercise.reps}</div>}
                    {exercise?.duration && <div>Duration: {exercise.duration}</div>}
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMode('existing')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        mode === 'existing'
                          ? 'border-greek-gold bg-greek-gold/10 text-greek-gold'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium">Add to Existing</div>
                    </button>
                    <button
                      onClick={() => setMode('new')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        mode === 'new'
                          ? 'border-greek-gold bg-greek-gold/10 text-greek-gold'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-medium">Create New</div>
                    </button>
                  </div>

                  {/* Existing Workout Selection */}
                  {mode === 'existing' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Workout
                      </label>
                      {userWorkouts.length > 0 ? (
                        <select
                          value={selectedWorkoutId}
                          onChange={(e) => setSelectedWorkoutId(e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Choose a workout...</option>
                          {userWorkouts.map((workout) => (
                            <option key={workout.id} value={workout.id}>
                              {workout.name} ({workout.totalExercises} exercises, {workout.estimatedDuration}min)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No workouts found</p>
                          <p className="text-xs">Create your first workout below</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Workout Creation */}
                  {mode === 'new' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workout Name
                        </label>
                        <Input
                          value={newWorkoutName}
                          onChange={(e) => setNewWorkoutName(e.target.value)}
                          placeholder="Enter workout name..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level
                        </label>
                        <select
                          value={newWorkoutDifficulty}
                          onChange={(e) => setNewWorkoutDifficulty(e.target.value as any)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-greek-gold hover:bg-greek-gold/90"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? (
                      'Adding...'
                    ) : mode === 'existing' ? (
                      'Add to Workout'
                    ) : (
                      'Create & Add'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}