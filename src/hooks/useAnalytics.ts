
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface StudyAnalytics {
  totalStudyTime: number;
  averageSessionLength: number;
  streakDays: number;
  accuracyRate: number;
  improvementTrend: number;
  weeklyProgress: Array<{
    week: string;
    hours: number;
    accuracy: number;
  }>;
  subjectBreakdown: Array<{
    subject: string;
    timeSpent: number;
    accuracy: number;
  }>;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [timeTracking, setTimeTracking] = useState<{
    sessionStart: Date | null;
    currentTopic: string | null;
  }>({
    sessionStart: null,
    currentTopic: null,
  });

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', user?.user_id],
    queryFn: async (): Promise<StudyAnalytics> => {
      if (!user?.user_id) throw new Error('User not authenticated');

      // Fetch study sessions
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.user_id)
        .order('session_date', { ascending: false });

      if (error) throw error;

      // Calculate analytics
      const totalStudyTime = sessions?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0;
      const averageSessionLength = sessions?.length ? totalStudyTime / sessions.length : 0;
      
      // Calculate accuracy rate
      const totalQuestions = sessions?.reduce((sum, session) => sum + (session.flashcards_reviewed || 0), 0) || 0;
      const correctAnswers = sessions?.reduce((sum, session) => sum + (session.correct_answers || 0), 0) || 0;
      const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // Calculate weekly progress
      const weeklyProgress = calculateWeeklyProgress(sessions || []);
      
      // Calculate subject breakdown
      const subjectBreakdown = calculateSubjectBreakdown(sessions || []);

      return {
        totalStudyTime,
        averageSessionLength,
        streakDays: user.study_streak || 0,
        accuracyRate,
        improvementTrend: calculateImprovementTrend(sessions || []),
        weeklyProgress,
        subjectBreakdown,
      };
    },
    enabled: !!user?.user_id,
  });

  const startStudySession = (topic: string) => {
    setTimeTracking({
      sessionStart: new Date(),
      currentTopic: topic,
    });
  };

  const endStudySession = async (correctAnswers: number = 0, totalQuestions: number = 0) => {
    if (!timeTracking.sessionStart || !user?.user_id) return;

    const duration = Math.floor((new Date().getTime() - timeTracking.sessionStart.getTime()) / (1000 * 60));
    
    const { error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.user_id,
        session_type: 'study',
        duration_minutes: duration,
        topics_covered: timeTracking.currentTopic ? [timeTracking.currentTopic] : [],
        flashcards_reviewed: totalQuestions,
        correct_answers: correctAnswers,
        session_date: new Date().toISOString().split('T')[0],
      });

    if (error) {
      console.error('Error saving study session:', error);
    }

    setTimeTracking({
      sessionStart: null,
      currentTopic: null,
    });
  };

  return {
    analytics,
    isLoading,
    startStudySession,
    endStudySession,
    currentSession: timeTracking,
  };
};

function calculateWeeklyProgress(sessions: any[]) {
  const weeks = new Map();
  
  sessions.forEach(session => {
    const date = new Date(session.session_date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, { hours: 0, correct: 0, total: 0 });
    }
    
    const week = weeks.get(weekKey);
    week.hours += session.duration_minutes / 60;
    week.correct += session.correct_answers || 0;
    week.total += session.flashcards_reviewed || 0;
  });

  return Array.from(weeks.entries()).map(([week, data]) => ({
    week,
    hours: data.hours,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
  }));
}

function calculateSubjectBreakdown(sessions: any[]) {
  const subjects = new Map();
  
  sessions.forEach(session => {
    session.topics_covered?.forEach((topic: string) => {
      if (!subjects.has(topic)) {
        subjects.set(topic, { timeSpent: 0, correct: 0, total: 0 });
      }
      
      const subject = subjects.get(topic);
      subject.timeSpent += session.duration_minutes / 60;
      subject.correct += (session.correct_answers || 0) / (session.topics_covered?.length || 1);
      subject.total += (session.flashcards_reviewed || 0) / (session.topics_covered?.length || 1);
    });
  });

  return Array.from(subjects.entries()).map(([subject, data]) => ({
    subject,
    timeSpent: data.timeSpent,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
  }));
}

function calculateImprovementTrend(sessions: any[]) {
  if (sessions.length < 2) return 0;
  
  const recentSessions = sessions.slice(0, 5);
  const olderSessions = sessions.slice(5, 10);
  
  const recentAccuracy = recentSessions.reduce((sum, s) => {
    const total = s.flashcards_reviewed || 0;
    const correct = s.correct_answers || 0;
    return sum + (total > 0 ? (correct / total) * 100 : 0);
  }, 0) / recentSessions.length;
  
  const olderAccuracy = olderSessions.reduce((sum, s) => {
    const total = s.flashcards_reviewed || 0;
    const correct = s.correct_answers || 0;
    return sum + (total > 0 ? (correct / total) * 100 : 0);
  }, 0) / (olderSessions.length || 1);
  
  return recentAccuracy - olderAccuracy;
}
