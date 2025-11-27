// src/app/pages/body/spartan-workout/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar, MobileNavbar } from '@/components/layout/navbar'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Play, Clock, Target, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CartProvider } from '@/hooks/use-cart'
import { useBodyExercises } from '@/hooks/use-body-exercises'
import { useAuth } from '@/hooks/use-auth'
import { useUserWorkouts } from '@/hooks/use-user-workouts'
import { ExerciseItem } from '@/types/admin'
import { AddToWorkoutModal } from '@/components/body/AddToWorkoutModal'

// Muscle group positions on the body diagram
const muscleGroupPositions = {
  chest: { top: '34%', left: '32%' },
  shoulders: { top: '33%', left: '58%' },
  arms: { top: '35%', left: '18%' },
  back: { top: '33%', left: '75%' },
  core: { top: '45%', left: '28%' },
  legs: { top: '55%', left: '70%' }
}

export default function SpartanWorkoutPage() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
  const [selectedExercises, setSelectedExercises] = useState<ExerciseItem[]>([])
  const [showBody, setShowBody] = useState(true)
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string | null>(null)
  const [showAddToWorkoutModal, setShowAddToWorkoutModal] = useState(false)
  const [exerciseToAdd, setExerciseToAdd] = useState<ExerciseItem | null>(null)
  
  const { items: exercises, loading, getByMuscleGroup } = useBodyExercises()
  const { user, loading: authLoading } = useAuth()
  const { userWorkouts, addExerciseToWorkout, createWorkout } = useUserWorkouts()
  const router = useRouter()

  // Group exercises by muscle group
  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscleGroup]) {
      acc[exercise.muscleGroup] = []
    }
    acc[exercise.muscleGroup].push(exercise)
    return acc
  }, {} as Record<string, ExerciseItem[]>)

  // Get available muscle groups that have exercises
  const availableMuscleGroups = Object.keys(exercisesByMuscleGroup).filter(
    (muscleGroup) => muscleGroupPositions[muscleGroup as keyof typeof muscleGroupPositions]
  )

  const handleMuscleClick = async (muscleGroup: string) => {
    try {
      const exercises = await getByMuscleGroup(muscleGroup)
      setSelectedExercises(exercises)
      setSelectedMuscle(muscleGroup)
    } catch (error) {
      console.error('Error fetching exercises:', error)
      // Fallback to local exercises if available
      setSelectedExercises(exercisesByMuscleGroup[muscleGroup] || [])
      setSelectedMuscle(muscleGroup)
    }
  }

  const generateWorkout = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    const filteredExercises = exercises.filter(ex => ex.difficulty === difficulty)
    if (filteredExercises.length === 0) {
      // Fallback: get exercises of any difficulty if none match
      return exercises.slice(0, difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 6 : 8)
    }
    
    // Select exercises ensuring variety across muscle groups
    const workoutExercises: ExerciseItem[] = []
    const usedMuscleGroups = new Set<string>()
    
    // First, try to get one exercise from each muscle group
    Object.keys(exercisesByMuscleGroup).forEach(muscleGroup => {
      const groupExercises = exercisesByMuscleGroup[muscleGroup].filter(ex => ex.difficulty === difficulty)
      if (groupExercises.length > 0 && workoutExercises.length < (difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 6 : 8)) {
        workoutExercises.push(groupExercises[Math.floor(Math.random() * groupExercises.length)])
        usedMuscleGroups.add(muscleGroup)
      }
    })
    
    // Fill remaining slots with random exercises of the right difficulty
    while (workoutExercises.length < (difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 6 : 8) && filteredExercises.length > workoutExercises.length) {
      const remainingExercises = filteredExercises.filter(ex => !workoutExercises.includes(ex))
      if (remainingExercises.length > 0) {
        workoutExercises.push(remainingExercises[Math.floor(Math.random() * remainingExercises.length)])
      } else {
        break
      }
    }
    
    return workoutExercises
  }

  const handleWorkoutStart = (type: 'beginner' | 'intermediate' | 'advanced') => {
    const workoutExercises = generateWorkout(type)
    setSelectedExercises(workoutExercises)
    setSelectedWorkoutType(type)
    setShowBody(false)
  }

  const handleAddToWorkout = (exercise: ExerciseItem) => {
    // Check if user is authenticated
    if (!user) {
      // Store the current page and exercise info for redirect after login
      sessionStorage.setItem('redirectAfterLogin', '/body/spartan-workout')
      sessionStorage.setItem('exerciseToAdd', JSON.stringify(exercise))
      router.push('/auth/login')
      return
    }

    // User is authenticated, show the modal
    setExerciseToAdd(exercise)
    setShowAddToWorkoutModal(true)
  }

  const handleWorkoutModalSubmit = async (workoutId: string, exerciseData: any) => {
    try {
      await addExerciseToWorkout(workoutId, exerciseData)
      setShowAddToWorkoutModal(false)
      setExerciseToAdd(null)
    } catch (error) {
      console.error('Error adding exercise to workout:', error)
      // You could show a toast notification here
    }
  }

  // Check if user returned from login with an exercise to add
  useEffect(() => {
    if (user && !authLoading) {
      const exerciseToAddFromStorage = sessionStorage.getItem('exerciseToAdd')
      if (exerciseToAddFromStorage) {
        try {
          const exercise = JSON.parse(exerciseToAddFromStorage)
          setExerciseToAdd(exercise)
          setShowAddToWorkoutModal(true)
          // Clear the stored data
          sessionStorage.removeItem('exerciseToAdd')
          sessionStorage.removeItem('redirectAfterLogin')
        } catch (error) {
          console.error('Error parsing stored exercise:', error)
        }
      }
    }
  }, [user, authLoading])

  return (
    <div className="min-h-screen marble-texture">
      <CartProvider>
        <Navbar />
      </CartProvider>
      <MobileNavbar />
      
      <main className="md:ml-64 pt-16 md:pt-0 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/body" className="inline-flex items-center text-greek-blue hover:text-greek-gold transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Body Training
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
              Spartan Training
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Click on muscle groups to explore targeted exercises and build your warrior physique.
            </p>
          </motion.div>

          {/* Statistics Bar */}
          {showBody && exercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-greek-gold/20"
            >
              <div className="flex justify-center items-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-greek-blue">{exercises.length}</div>
                  <div className="text-gray-600">Total Exercises</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-greek-gold">{availableMuscleGroups.length}</div>
                  <div className="text-gray-600">Muscle Groups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {exercises.filter(ex => ex.demoUrl).length}
                  </div>
                  <div className="text-gray-600">With Demos</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Interactive Body Diagram */}
          {showBody && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mx-auto mb-12"
              style={{ maxWidth: '500px', height: '700px' }}
            >
              {/* Human Body Silhouette */}
              <div className="relative w-full h-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-greek-gold/20">
                <Image
                  src="/images/full_body.png"
                  alt="Human body anatomy diagram"
                  width={460}
                  height={660}
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
                />

                {/* Clickable Muscle Group Buttons */}
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  availableMuscleGroups.map((muscleGroup) => {
                    const position = muscleGroupPositions[muscleGroup as keyof typeof muscleGroupPositions];
                    return (
                      <button
                        key={muscleGroup}
                        className="absolute w-6 h-6 bg-greek-gold rounded-full border-2 border-white shadow-lg hover:bg-greek-blue hover:scale-110 transition-all duration-200 flex items-center justify-center"
                        style={{
                          top: position.top,
                          left: position.left,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => handleMuscleClick(muscleGroup)}
                        title={`${muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)} Exercises`}
                      >
                        <span className="text-white text-xs font-bold">+</span>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Exercise Modal */}
          {(selectedMuscle || selectedWorkoutType) && (
            <Dialog open={!!(selectedMuscle || selectedWorkoutType)} onOpenChange={() => {
              setSelectedMuscle(null);
              setSelectedExercises([]);
              setSelectedWorkoutType(null);
              setShowBody(true);
            }}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-greek-blue">
                    {selectedWorkoutType 
                      ? `${selectedWorkoutType.charAt(0).toUpperCase() + selectedWorkoutType.slice(1)} Workout Plan`
                      : selectedMuscle 
                        ? `${selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)} Exercises`
                        : 'Exercises'
                    }
                  </DialogTitle>
                </DialogHeader>
                
                {selectedWorkoutType && (
                  <div className="mb-4 p-3 bg-greek-gold/10 rounded-lg border border-greek-gold/20">
                    <p className="text-sm text-greek-blue">
                      <strong>Workout Duration:</strong> {
                        selectedWorkoutType === 'beginner' ? '20 minutes' :
                        selectedWorkoutType === 'intermediate' ? '35 minutes' : '45 minutes'
                      } • <strong>Exercises:</strong> {selectedExercises.length}
                    </p>
                  </div>
                )}
                
                {selectedExercises.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No exercises available {selectedWorkoutType ? 'for this difficulty level' : 'for this muscle group'} yet.</p>
                    <p className="text-sm">Check back later or contact admin to add exercises.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedExercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 border"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {exercise.imageUrl && (
                                <img 
                                  src={exercise.imageUrl} 
                                  alt={exercise.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
                                <p className="text-sm text-gray-600">{exercise.description}</p>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium shrink-0 ${
                            exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Target className="h-4 w-4" />
                            <span><strong>Reps:</strong> {exercise.reps}</span>
                          </div>
                          {exercise.sets && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span><strong>Sets:</strong> {exercise.sets}</span>
                            </div>
                          )}
                          {exercise.equipment && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span><strong>Equipment:</strong> {exercise.equipment}</span>
                            </div>
                          )}
                          {exercise.targetMuscles.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span><strong>Targets:</strong> {exercise.targetMuscles.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {exercise.instructions.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-2">Instructions:</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                              {exercise.instructions.map((instruction, idx) => (
                                <li key={idx}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {exercise.tips && exercise.tips.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-2">Tips:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {exercise.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-3 border-t">
                          {exercise.demoUrl ? (
                            <Button 
                              size="sm" 
                              className="bg-greek-blue hover:bg-greek-blue/90"
                              onClick={() => window.open(exercise.demoUrl, '_blank')}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              View Demo
                            </Button>
                          ) : (
                            <Button size="sm" disabled className="bg-gray-400">
                              <Play className="h-3 w-3 mr-1" />
                              No Demo Available
                            </Button>
                          )}
                          {!selectedWorkoutType && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddToWorkout(exercise)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Workout
                            </Button>
                          )}
                          {exercise.benefits && exercise.benefits.length > 0 && (
                            <Button size="sm" variant="outline" title={exercise.benefits.join(', ')}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Benefits
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {selectedWorkoutType && (
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedWorkoutType(null);
                        setSelectedExercises([]);
                        setShowBody(true);
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Body Diagram
                    </Button>
                    <div className="text-sm text-gray-500">
                      Generated workout with {selectedExercises.length} exercises
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}

          {/* Empty State */}
          {!loading && exercises.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-greek-gold/20"
            >
              <Target className="h-16 w-16 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-greek-blue mb-4">No Exercises Available</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                It looks like no exercises have been added to the system yet. 
                Contact the administrator to add workout content.
              </p>
              <Link href="/body">
                <Button variant="outline" className="border-greek-gold text-greek-blue hover:bg-greek-gold/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Body Section
                </Button>
              </Link>
            </motion.div>
          )}

          {/* Quick Workout Options */}
          {exercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid md:grid-cols-3 gap-6"
            >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-greek-gold/20">
              <h3 className="text-xl font-bold text-greek-blue mb-3">Beginner Spartan</h3>
              <p className="text-gray-600 mb-4">Perfect for those starting their warrior journey</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• 20 minutes</li>
                <li>• Basic bodyweight exercises</li>
                <li>• Low intensity</li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleWorkoutStart('beginner')}
                disabled={loading || exercises.filter(ex => ex.difficulty === 'beginner').length === 0}
              >
                {loading ? 'Loading...' : 'Start Workout'}
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-greek-gold/20">
              <h3 className="text-xl font-bold text-greek-blue mb-3">Warrior Training</h3>
              <p className="text-gray-600 mb-4">Intermediate level for developing strength</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• 35 minutes</li>
                <li>• Mixed difficulty exercises</li>
                <li>• Moderate intensity</li>
              </ul>
              <Button 
                className="w-full bg-greek-gold hover:bg-greek-gold/90"
                onClick={() => handleWorkoutStart('intermediate')}
                disabled={loading || exercises.filter(ex => ex.difficulty === 'intermediate').length === 0}
              >
                {loading ? 'Loading...' : 'Start Workout'}
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-greek-gold/20">
              <h3 className="text-xl font-bold text-greek-blue mb-3">Spartan Elite</h3>
              <p className="text-gray-600 mb-4">Advanced training for true warriors</p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• 45 minutes</li>
                <li>• Advanced movements</li>
                <li>• High intensity</li>
              </ul>
              <Button 
                className="w-full bg-greek-blue hover:bg-greek-blue/90"
                onClick={() => handleWorkoutStart('advanced')}
                disabled={loading || exercises.filter(ex => ex.difficulty === 'advanced').length === 0}
              >
                {loading ? 'Loading...' : 'Start Workout'}
              </Button>
            </div>
          </motion.div>
          )}
        </div>
      </main>
      
      {/* Add to Workout Modal */}
      {exerciseToAdd && (
        <AddToWorkoutModal
          isOpen={showAddToWorkoutModal}
          exercise={exerciseToAdd}
          userWorkouts={userWorkouts}
          onClose={() => {
            setShowAddToWorkoutModal(false)
            setExerciseToAdd(null)
          }}
          onAddToExistingWorkout={handleWorkoutModalSubmit}
          onCreateWorkout={createWorkout}
        />
      )}
    </div>
  )
}