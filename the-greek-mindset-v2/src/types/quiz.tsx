export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  historyItemId: string;
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: number[]; // indices of selected answers
  score: number;
  percentage: number;
  timeSpent: number; // in seconds
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface UserProgress {
  userId: string;
  historyItemId: string;
  quizAttempts: QuizAttempt[];
  readingProgress: {
    completed: boolean;
    timeSpent: number; // in seconds
    lastVisited: string;
  };
  achievements: Achievement[];
  totalScore: number;
  level: number;
  lastUpdated: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'reading' | 'streak' | 'perfect' | 'explorer';
  points: number;
  unlockedAt: string;
}

export interface LearningRecommendation {
  id: string;
  userId: string;
  historyItemId: string;
  title: string;
  reason: string;
  confidence: number; // 0-1
  category: 'similar_period' | 'related_topic' | 'difficulty_match' | 'interest_based';
  createdAt: string;
}

export interface UserLearningProfile {
  userId: string;
  preferences: {
    favoriteCategories: string[];
    difficultyPreference: 'easy' | 'medium' | 'hard';
    learningStyle: 'visual' | 'textual' | 'interactive';
  };
  statistics: {
    totalQuizzesTaken: number;
    averageScore: number;
    totalTimeSpent: number;
    streakDays: number;
    currentLevel: number;
    totalPoints: number;
  };
  completedItems: string[]; // historyItem IDs
  strongTopics: string[]; // categories where user excels
  weakTopics: string[]; // categories needing improvement
  categoryProgress?: {
    history: { completed: string[]; total: number };
    geography: { completed: string[]; total: number };
    mythology: { completed: string[]; total: number };
    philosophy: { completed: string[]; total: number };
  };
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}