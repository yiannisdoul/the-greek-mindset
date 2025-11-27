'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HistoryItem } from '@/types/admin';
import { QuizQuestion, QuizAttempt } from '@/types/quiz';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  Brain,
  Trophy,
  Target,
  Lightbulb
} from 'lucide-react';

interface QuizComponentProps {
  historyItem: HistoryItem;
  onComplete: (score: number, answers: number[]) => void;
  onClose: () => void;
}

export function QuizComponent({ historyItem, onComplete, onClose }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [startTime] = useState(Date.now());
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Generate quiz questions based on history item
  useEffect(() => {
    const generatedQuestions = generateQuestions(historyItem);
    setQuestions(generatedQuestions);
    setSelectedAnswers(new Array(generatedQuestions.length).fill(-1));
  }, [historyItem]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(time => time - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleQuizComplete();
    }
  }, [timeRemaining, showResults]);

  const generateQuestions = (item: HistoryItem): QuizQuestion[] => {
    // Generate quiz questions based on the history item
    const baseQuestions: Omit<QuizQuestion, 'id'>[] = [
      {
        question: `What period does "${item.title}" belong to?`,
        options: [
          item.period,
          getRandomPeriod(item.category, item.period),
          getRandomPeriod(item.category, item.period),
          getRandomPeriod(item.category, item.period)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0, // Will be adjusted after sorting
        explanation: `${item.title} occurred during ${item.period}.`,
        difficulty: 'easy',
        category: item.category
      },
      {
        question: `What was the historical significance of ${item.title}?`,
        options: [
          item.significance,
          'It led to the fall of the Roman Empire',
          'It established democracy in Athens',
          'It marked the end of the Persian Wars'
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0, // Will be adjusted after sorting
        explanation: item.significance,
        difficulty: 'medium',
        category: item.category
      },
      {
        question: `Which category best describes ${item.title}?`,
        options: [
          getCategoryDisplay(item.category),
          getCategoryDisplay(getRandomCategory(item.category)),
          getCategoryDisplay(getRandomCategory(item.category)),
          getCategoryDisplay(getRandomCategory(item.category))
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0, // Will be adjusted after sorting
        explanation: `${item.title} is from the ${getCategoryDisplay(item.category)} period.`,
        difficulty: 'easy',
        category: item.category
      }
    ];

    // Add more specific questions based on content
    if (item.year) {
      baseQuestions.push({
        question: `Approximately when did ${item.title} occur?`,
        options: [
          `${Math.abs(item.year)} ${item.year < 0 ? 'BC' : 'AD'}`,
          `${Math.abs(item.year + 100)} ${(item.year + 100) < 0 ? 'BC' : 'AD'}`,
          `${Math.abs(item.year - 100)} ${(item.year - 100) < 0 ? 'BC' : 'AD'}`,
          `${Math.abs(item.year + 50)} ${(item.year + 50) < 0 ? 'BC' : 'AD'}`
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        explanation: `${item.title} occurred in ${Math.abs(item.year)} ${item.year < 0 ? 'BC' : 'AD'}.`,
        difficulty: 'hard',
        category: item.category
      });
    }

    return baseQuestions.map((q, index) => ({
      ...q,
      id: `${item.id}-${index}`,
      correctAnswer: q.options.findIndex(option => 
        option === (index === 0 ? item.period : 
                   index === 1 ? item.significance : 
                   index === 2 ? getCategoryDisplay(item.category) :
                   `${Math.abs(item.year || 0)} ${(item.year || 0) < 0 ? 'BC' : 'AD'}`)
      )
    })).slice(0, 5); // Limit to 5 questions
  };

  const getRandomPeriod = (category: string, exclude: string): string => {
    const periods = {
      ancient: ['Archaic Period', 'Classical Period', 'Bronze Age'],
      classical: ['Golden Age', 'Peloponnesian War Era', 'Athenian Empire'],
      hellenistic: ['Alexander Era', 'Ptolemaic Period', 'Seleucid Era'],
      byzantine: ['Early Byzantine', 'Middle Byzantine', 'Late Byzantine'],
      modern: ['Ottoman Period', 'Independence Era', 'Modern Greece']
    };
    const categoryPeriods = periods[category as keyof typeof periods] || periods.ancient;
    const available = categoryPeriods.filter(p => p !== exclude);
    return available[Math.floor(Math.random() * available.length)];
  };

  const getRandomCategory = (exclude: string): string => {
    const categories = ['ancient', 'classical', 'hellenistic', 'byzantine', 'modern'];
    const available = categories.filter(c => c !== exclude);
    return available[Math.floor(Math.random() * available.length)];
  };

  const getCategoryDisplay = (category: string): string => {
    const displays: Record<string, string> = {
      ancient: 'Ancient Greece',
      classical: 'Classical Period',
      hellenistic: 'Hellenistic Era',
      byzantine: 'Byzantine Empire',
      modern: 'Modern Greece'
    };
    return displays[category] || category;
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
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    setShowResults(true);
    onComplete(score, selectedAnswers);
  }, [selectedAnswers, startTime, onComplete]);

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
          <p>Generating quiz questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {!showResults ? (
          <>
            {/* Quiz Header */}
            <div className="bg-gradient-to-r from-greek-gold to-yellow-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Quiz: {historyItem.title}</h2>
                  <p className="opacity-90">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20">
                    {questions[currentQuestion]?.difficulty}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={((currentQuestion + 1) / questions.length) * 100} 
                className="mt-4 h-2 bg-white/20"
              />
            </div>

            {/* Quiz Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-stone-800 mb-6">
                    {questions[currentQuestion]?.question}
                  </h3>

                  <div className="space-y-4 mb-8">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-greek-gold bg-greek-gold/10'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-greek-gold bg-greek-gold text-white'
                              : 'border-stone-300'
                          }`}>
                            {selectedAnswers[currentQuestion] === index && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-between">
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
                      className="bg-greek-gold hover:bg-greek-gold/90"
                    >
                      {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          /* Quiz Results */
          <div className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {getScoreIcon(calculateScore())}
              <h2 className="text-3xl font-bold text-stone-800 mt-4 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-stone-600">
                You've finished the quiz on {historyItem.title}
              </p>
            </motion.div>

            <div className="bg-stone-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(calculateScore())}`}>
                    {calculateScore()}%
                  </div>
                  <div className="text-sm text-stone-600">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-stone-700">
                    {questions.filter((_, i) => selectedAnswers[i] === questions[i].correctAnswer).length}/{questions.length}
                  </div>
                  <div className="text-sm text-stone-600">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-stone-700">
                    {formatTime(Math.floor((Date.now() - startTime) / 1000))}
                  </div>
                  <div className="text-sm text-stone-600">Time Spent</div>
                </div>
              </div>
            </div>

            {/* Answer Review */}
            <div className="text-left mb-8 max-h-60 overflow-y-auto">
              <h3 className="text-lg font-semibold text-stone-800 mb-4">Review Your Answers</h3>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium text-stone-800 mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm">
                        Your answer: {question.options[selectedAnswers[index]] || 'Not answered'}
                      </span>
                    </div>
                    {selectedAnswers[index] !== question.correctAnswer && (
                      <p className="text-sm text-green-600">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <Lightbulb className="h-4 w-4 inline mr-1" />
                        {question.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={onClose} className="bg-greek-gold hover:bg-greek-gold/90">
              Continue Learning
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
