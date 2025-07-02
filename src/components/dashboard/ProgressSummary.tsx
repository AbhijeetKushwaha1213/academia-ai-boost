
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target,
  TrendingUp,
  Star,
  Calendar,
  BookOpen,
  Brain,
  Zap
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useAnalytics } from '@/hooks/useAnalytics';

export const ProgressSummary = () => {
  const { user } = useAuth();
  const { analytics, isLoading } = useAnalytics();

  const stats = [
    {
      icon: Flame,
      label: 'Study Streak',
      value: user?.study_streak || 0,
      unit: 'days',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Clock,
      label: 'Total Hours',
      value: analytics?.totalStudyTime ? Math.floor(analytics.totalStudyTime / 60) : (user?.total_study_hours || 0),
      unit: 'hrs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Trophy,
      label: 'Current Level',
      value: user?.current_level || 1,
      unit: '',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      label: 'Experience',
      value: user?.experience_points || 0,
      unit: 'XP',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const weeklyGoals = [
    { goal: 'Study 5 hours daily', progress: 75, current: 15, target: 20 },
    { goal: 'Complete 3 practice tests', progress: 67, current: 2, target: 3 },
    { goal: 'Review 50 flashcards', progress: 90, current: 45, target: 50 }
  ];

  const recentAchievements = [
    { name: 'Study Streak Master', description: '7 days consecutive study', earned: '2 days ago', icon: Flame },
    { name: 'Quick Learner', description: 'Completed 10 flashcards in 5 min', earned: '1 week ago', icon: BookOpen },
    { name: 'Level Up!', description: 'Reached Level 3', earned: '1 week ago', icon: Trophy }
  ];

  const nextLevelXP = (user?.current_level || 1) * 1000;
  const currentXP = user?.experience_points || 0;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Enhanced Stats Overview */}
      <Card className="p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              {stat.unit && <div className="text-xs text-gray-500">{stat.unit}</div>}
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Level Progress</span>
            <Badge variant="secondary">
              Level {user?.current_level || 1}
            </Badge>
          </div>
          <Progress value={xpProgress} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentXP} XP</span>
            <span>{nextLevelXP - currentXP} XP to next level</span>
          </div>
        </div>

        {/* Performance Insights */}
        {analytics && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Brain className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Performance Insights</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Accuracy Rate:</span>
                <span className="font-semibold ml-2">{analytics.accuracyRate.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Avg Session:</span>
                <span className="font-semibold ml-2">{analytics.averageSessionLength.toFixed(0)} min</span>
              </div>
            </div>
            {analytics.improvementTrend !== 0 && (
              <div className="flex items-center mt-2">
                {analytics.improvementTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600 mr-1 rotate-180" />
                )}
                <span className="text-sm text-gray-600">
                  {analytics.improvementTrend > 0 ? 'Improving' : 'Declining'} by {Math.abs(analytics.improvementTrend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Weekly Goals */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Weekly Goals
        </h2>
        <div className="space-y-4">
          {weeklyGoals.map((goal, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{goal.goal}</span>
                <span className="text-xs text-gray-500">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="p-6 lg:col-span-3">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Recent Achievements
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <achievement.icon className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{achievement.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                <p className="text-xs text-gray-500">{achievement.earned}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      {analytics && (
        <Card className="p-6 lg:col-span-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-indigo-600" />
            AI Recommendations
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-medium text-indigo-900 mb-2">Focus Area</h3>
              <p className="text-sm text-indigo-700">
                {analytics.subjectBreakdown.length > 0 && 
                  analytics.subjectBreakdown.sort((a, b) => a.accuracy - b.accuracy)[0]?.accuracy < 70
                  ? `Spend more time on ${analytics.subjectBreakdown[0].subject} to improve your ${analytics.subjectBreakdown[0].accuracy.toFixed(0)}% accuracy rate.`
                  : "Great job! Your performance is consistent across all subjects. Consider tackling more challenging material."
                }
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-medium text-indigo-900 mb-2">Study Schedule</h3>
              <p className="text-sm text-indigo-700">
                {analytics.averageSessionLength < 30 
                  ? "Try extending your study sessions to 30-45 minutes for better retention."
                  : "Your study session length is optimal. Consider taking short breaks every 25 minutes."
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
