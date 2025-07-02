
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Brain } from 'lucide-react';

interface AdaptiveDifficultyProps {
  userPerformance: {
    accuracy: number;
    responseTime: number;
    recentSessions: number[];
  };
  onDifficultyChange: (newDifficulty: 'easy' | 'medium' | 'hard') => void;
}

export const AdaptiveDifficulty = ({ userPerformance, onDifficultyChange }: AdaptiveDifficultyProps) => {
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [adaptationReason, setAdaptationReason] = useState<string>('');

  useEffect(() => {
    const newDifficulty = calculateOptimalDifficulty(userPerformance);
    if (newDifficulty !== currentDifficulty) {
      setCurrentDifficulty(newDifficulty);
      onDifficultyChange(newDifficulty);
      setAdaptationReason(getAdaptationReason(newDifficulty, userPerformance));
    }
  }, [userPerformance, currentDifficulty, onDifficultyChange]);

  const calculateOptimalDifficulty = (performance: typeof userPerformance) => {
    const { accuracy, responseTime, recentSessions } = performance;
    
    // Calculate trend from recent sessions
    const trend = calculateTrend(recentSessions);
    
    // Decision logic
    if (accuracy >= 85 && responseTime < 10 && trend > 0) {
      return 'hard';
    } else if (accuracy >= 70 && responseTime < 15) {
      return 'medium';
    } else if (accuracy < 60 || responseTime > 20 || trend < -5) {
      return 'easy';
    }
    
    return currentDifficulty; // Keep current if no clear change needed
  };

  const calculateTrend = (sessions: number[]) => {
    if (sessions.length < 2) return 0;
    
    const recent = sessions.slice(-3).reduce((sum, score) => sum + score, 0) / Math.min(3, sessions.length);
    const older = sessions.slice(-6, -3).reduce((sum, score) => sum + score, 0) / Math.min(3, sessions.slice(-6, -3).length);
    
    return recent - older;
  };

  const getAdaptationReason = (difficulty: string, performance: typeof userPerformance) => {
    const { accuracy, responseTime } = performance;
    
    switch (difficulty) {
      case 'hard':
        return `Increased difficulty - you're performing excellently with ${accuracy}% accuracy!`;
      case 'easy':
        return accuracy < 60 
          ? `Reduced difficulty to help build confidence (${accuracy}% accuracy)`
          : `Reduced difficulty due to longer response times (${responseTime}s average)`;
      case 'medium':
        return 'Maintaining balanced difficulty level based on your performance';
      default:
        return '';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <TrendingDown className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'hard': return <TrendingUp className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const performanceLevel = userPerformance.accuracy >= 80 ? 'excellent' : 
                          userPerformance.accuracy >= 60 ? 'good' : 'needs-improvement';

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">Adaptive Difficulty</h3>
              <p className="text-sm text-indigo-700">AI-powered difficulty adjustment</p>
            </div>
          </div>
          <Badge className={getDifficultyColor(currentDifficulty)}>
            <div className="flex items-center space-x-1">
              {getDifficultyIcon(currentDifficulty)}
              <span className="capitalize">{currentDifficulty}</span>
            </div>
          </Badge>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium">{userPerformance.accuracy}%</span>
            </div>
            <Progress 
              value={userPerformance.accuracy} 
              className="h-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">{userPerformance.responseTime}s</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (userPerformance.responseTime * 5))} 
              className="h-2"
            />
          </div>
        </div>

        {/* Adaptation Explanation */}
        {adaptationReason && (
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-800">{adaptationReason}</p>
          </div>
        )}

        {/* Performance Indicators */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              performanceLevel === 'excellent' ? 'bg-green-500' :
              performanceLevel === 'good' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-gray-600">
              Performance: {performanceLevel.replace('-', ' ')}
            </span>
          </div>
          <span className="text-gray-500">
            {userPerformance.recentSessions.length} recent sessions
          </span>
        </div>
      </div>
    </Card>
  );
};
