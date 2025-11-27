'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GeographyItem } from '@/types/admin';
import { QuizQuestion, QuizAttempt } from '@/types/quiz';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  Brain,
  Trophy,
  Target,
  Lightbulb,
  MapPin
} from 'lucide-react';

interface GeographyQuizComponentProps {
  geographyItem: GeographyItem;
  onComplete: (score: number, answers: number[]) => void;
  onClose: () => void;
}

export function GeographyQuizComponent({ geographyItem, onComplete, onClose }: GeographyQuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [startTime] = useState(Date.now());
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Generate quiz questions based on geography item
  useEffect(() => {
    const generatedQuestions = generateQuestions(geographyItem);
    setQuestions(generatedQuestions);
    setSelectedAnswers(new Array(generatedQuestions.length).fill(-1));
  }, [geographyItem]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(time => time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleQuizComplete();
    }
  }, [timeRemaining, showResults]);

  const generateQuestions = (item: GeographyItem): QuizQuestion[] => {
    // Generate quiz questions based on the geography item
    const baseQuestions: Omit<QuizQuestion, 'id'>[] = [
      {
        question: `What type of geographical feature is ${item.name}?`,
        options: [
          getTypeDisplay(item.type),
          getTypeDisplay(getRandomType(item.type)),
          getTypeDisplay(getRandomType(item.type)),
          getTypeDisplay(getRandomType(item.type))
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0, // Will be adjusted after sorting
        explanation: `${item.name} is classified as a ${getTypeDisplay(item.type)}.`,
        difficulty: 'easy',
        category: 'geography'
      },
      {
        question: `What is the significance of ${item.name}?`,
        options: [
          item.significance,
          'It was the birthplace of democracy',
          'It was a major trading port in ancient times',
          'It was known for its military fortifications'
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0, // Will be adjusted after sorting
        explanation: item.significance,
        difficulty: 'medium',
        category: 'geography'
      },
      {
        question: `Which best describes the geographical classification of ${item.name}?`,
        options: [
          item.type,
          getRandomType(item.type),
          getRandomType(item.type),
          getRandomType(item.type)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0, // Will be adjusted after sorting
        explanation: `${item.name} is classified as a ${item.type}.`,
        difficulty: 'easy',
        category: 'geography'
      }
    ];

    // Add coordinate-based question if available
    if (item.coordinates) {
      baseQuestions.push({
        question: `${item.name} is located in which region of Greece?`,
        options: [
          getRegionFromCoordinates(item.coordinates),
          'Northern Greece',
          'Southern Greece',
          'Eastern Islands'
        ].filter((option, index, arr) => arr.indexOf(option) === index).sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        explanation: `${item.name} is located in ${getRegionFromCoordinates(item.coordinates)} based on its coordinates.`,
        difficulty: 'medium',
        category: 'geography'
      });
    }

    // Add facts-based question if available
    if (item.facts && item.facts.length > 0) {
      const randomFact = item.facts[Math.floor(Math.random() * item.facts.length)];
      baseQuestions.push({
        question: `Which of these is a fact about ${item.name}?`,
        options: [
          randomFact,
          'It was built entirely of marble',
          'It has never been conquered',
          'It was designed by ancient architects'
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        explanation: `${randomFact}`,
        difficulty: 'hard',
        category: 'geography'
      });
    }

    return baseQuestions.map((q, index) => ({
      ...q,
      id: `${item.id}-${index}`,
      correctAnswer: q.options.findIndex(option => 
        option === (index === 0 ? getTypeDisplay(item.type) : 
                   index === 1 ? item.significance : 
                   index === 2 ? item.type :
                   index === 3 ? getRegionFromCoordinates(item.coordinates) :
                   item.facts?.[0] || option)
      )
    })).slice(0, 5); // Limit to 5 questions
  };

  const getRandomType = (exclude: string): string => {
    const types = ['city', 'region', 'island', 'mountain', 'sea', 'landmark'];
    const available = types.filter(t => t !== exclude);
    return available[Math.floor(Math.random() * available.length)];
  };

  const getTypeDisplay = (type: string): string => {
    const displays: Record<string, string> = {
      city: 'City',
      region: 'Region',
      island: 'Island',
      mountain: 'Mountain',
      sea: 'Sea',
      landmark: 'Landmark'
    };
    return displays[type] || type;
  };

  const getRegionFromCoordinates = (coordinates?: { lat: number; lng: number }): string => {
    if (!coordinates) return 'Central Greece';
    
    const { lat, lng } = coordinates;
    
    // Simple region mapping based on coordinates
    if (lat > 40) return 'Northern Greece';
    if (lat < 37) return 'Southern Greece';
    if (lng > 25) return 'Eastern Islands';
    if (lng < 21) return 'Western Islands';
    return 'Central Greece';
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = useCallback(() => {
    const score = calculateScore();
    setShowResults(true);
    onComplete(score, selectedAnswers);
  }, [selectedAnswers, onComplete]);

  const calculateScore = (): number => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-8 w-8 text-green-600" />;
    if (score >= 60) return <Target className="h-8 w-8 text-yellow-600" />;
    return <Brain className="h-8 w-8 text-red-600" />;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-greek-gold mx-auto mb-4"></div>
          <p>Generating geography quiz questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {!showResults ? (
          <>
            {/* Quiz Header */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Geography Quiz: {geographyItem.name}
                </h2>
                <button onClick={onClose} className="text-white/80 hover:text-white text-xl">
                  ✕
                </button>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {questions[currentQuestion]?.difficulty}
                </Badge>
              </div>
              
              <Progress 
                value={(currentQuestion / questions.length) * 100} 
                className="mt-4 bg-white/20"
              />
            </div>

            {/* Question Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {questions[currentQuestion]?.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswers[currentQuestion] === index && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quiz Navigation */}
            <div className="border-t p-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === -1}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </>
        ) : (
          /* Quiz Results */
          <div className="p-8 text-center">
            <div className="mb-6">
              {getScoreIcon(calculateScore())}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 mb-6">Here's how you performed:</p>
            
            <div className={`text-5xl font-bold mb-4 ${getScoreColor(calculateScore())}`}>
              {calculateScore()}%
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-gray-800">Correct Answers</div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedAnswers.filter((answer, index) => answer === questions[index]?.correctAnswer).length}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Total Questions</div>
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {calculateScore() >= 80 && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Star className="h-5 w-5" />
                  <span className="font-semibold">Excellent work! You're a geography expert!</span>
                </div>
              )}
              
              {calculateScore() >= 60 && calculateScore() < 80 && (
                <div className="flex items-center justify-center gap-2 text-yellow-600">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-semibold">Good job! Keep learning to improve further.</span>
                </div>
              )}
              
              {calculateScore() < 60 && (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <Brain className="h-5 w-5" />
                  <span className="font-semibold">Keep studying! Review the content and try again.</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Take Another Quiz
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}