'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { progressService } from '@/lib/progress-service';
import { 
  UserProgress, 
  QuizAttempt, 
  Achievement, 
  UserLearningProfile,
  LearningRecommendation
} from '@/types/quiz';

export const useUserProgress = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserLearningProfile | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile and statistics
  const loadUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load or create user profile
      let profile = await progressService.getUserLearningProfile(user.uid);
      if (!profile) {
        await progressService.createUserLearningProfile(user.uid);
        profile = await progressService.getUserLearningProfile(user.uid);
      }
      
      // Initialize category progress if not exists
      if (profile && !profile.categoryProgress) {
        await progressService.initializeCategoryProgress(user.uid);
        profile = await progressService.getUserLearningProfile(user.uid);
      }
      
      setUserProfile(profile);

      // Load user statistics
      const stats = await progressService.getUserStatistics(user.uid);
      setUserStats(stats);

      // Load recommendations
      const recs = await progressService.generateRecommendations(user.uid);
      setRecommendations(recs);
      
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Record quiz completion
  const recordQuizAttempt = useCallback(async (
    quizId: string, 
    answers: number[], 
    score: number, 
    timeSpent: number
  ) => {
    if (!user) return;

    try {
      const quizAttempt: Omit<QuizAttempt, 'id'> = {
        userId: user.uid,
        quizId,
        answers,
        score,
        percentage: score,
        timeSpent,
        completed: true,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      await progressService.saveQuizAttempt(quizAttempt);
      
      // Reload user data to reflect changes
      await loadUserData();
      
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      throw error;
    }
  }, [user, loadUserData]);

  // Record reading progress
  const recordReadingProgress = useCallback(async (
    historyItemId: string, 
    timeSpent: number, 
    completed: boolean = false
  ) => {
    if (!user) return;

    try {
      await progressService.updateReadingProgress(user.uid, historyItemId, timeSpent, completed);
      
      // Reload user data if reading was completed
      if (completed) {
        await loadUserData();
      }
      
    } catch (error) {
      console.error('Error recording reading progress:', error);
      throw error;
    }
  }, [user, loadUserData]);

  // Get progress for specific history item
  const getItemProgress = useCallback(async (historyItemId: string): Promise<UserProgress | null> => {
    if (!user) return null;

    try {
      return await progressService.getUserProgress(user.uid, historyItemId);
    } catch (error) {
      console.error('Error getting item progress:', error);
      return null;
    }
  }, [user]);

  // Update user preferences
  const updatePreferences = useCallback(async (preferences: Partial<UserLearningProfile['preferences']>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          ...preferences
        }
      };

      // Update in Firestore (you'd implement this in progressService)
      // await progressService.updateUserPreferences(user.uid, preferences);
      
      setUserProfile(updatedProfile);
      
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [user, userProfile]);

  return {
    // State
    userProfile,
    userStats,
    recommendations,
    loading,
    error,
    
    // Actions
    recordQuizAttempt,
    recordReadingProgress,
    getItemProgress,
    updatePreferences,
    refreshData: loadUserData,
    
    // Computed values
    isLoggedIn: !!user,
    hasProfile: !!userProfile,
    completionRate: userStats?.completionRate || 0,
    currentLevel: userProfile?.statistics.currentLevel || 1,
    totalPoints: userProfile?.statistics.totalPoints || 0,
    averageScore: userProfile?.statistics.averageScore || 0
  };
};

// Hook for specific history item progress
export const useHistoryItemProgress = (historyItemId: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !historyItemId) {
        setLoading(false);
        return;
      }

      try {
        const itemProgress = await progressService.getUserProgress(user.uid, historyItemId);
        setProgress(itemProgress);
      } catch (error) {
        console.error('Error loading history item progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user, historyItemId]);

  const updateProgress = useCallback(async (updates: Partial<UserProgress>) => {
    if (!user) return;

    try {
      await progressService.createOrUpdateProgress(user.uid, historyItemId, updates);
      
      // Reload progress
      const itemProgress = await progressService.getUserProgress(user.uid, historyItemId);
      setProgress(itemProgress);
      
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }, [user, historyItemId]);

  return {
    progress,
    loading,
    updateProgress,
    isCompleted: progress?.readingProgress?.completed || false,
    hasQuizAttempts: (progress?.quizAttempts?.length || 0) > 0,
    bestQuizScore: progress?.quizAttempts?.reduce((best, attempt) => 
      Math.max(best, attempt.percentage), 0) || 0
  };
};