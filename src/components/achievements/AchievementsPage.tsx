import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Star,
  Target,
  BookOpen,
  Calendar,
  Award,
  Zap,
  Crown
} from 'lucide-react';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  experience_points: number;
  earned_at: string;
}

export const AchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (user?.user_id) {
      fetchAchievements();
    }
  }, [user?.user_id]);

  const fetchAchievements = async () => {
    if (!user?.user_id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.user_id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      
      const achievementsList = data || [];
      setAchievements(achievementsList);
      setTotalPoints(achievementsList.reduce((sum, achievement) => sum + (achievement.experience_points || 0), 0));
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'study_streak':
        return <Calendar className="w-6 h-6" />;
      case 'flashcard_master':
        return <BookOpen className="w-6 h-6" />;
      case 'first_project':
        return <Target className="w-6 h-6" />;
      case 'skill_collector':
        return <Star className="w-6 h-6" />;
      case 'early_bird':
        return <Zap className="w-6 h-6" />;
      case 'milestone':
        return <Crown className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'study_streak':
        return 'text-blue-600 bg-blue-100';
      case 'flashcard_master':
        return 'text-green-600 bg-green-100';
      case 'first_project':
        return 'text-purple-600 bg-purple-100';
      case 'skill_collector':
        return 'text-yellow-600 bg-yellow-100';
      case 'early_bird':
        return 'text-orange-600 bg-orange-100';
      case 'milestone':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const upcomingAchievements = [
    {
      title: "Study Streak Champion",
      description: "Study for 30 consecutive days",
      progress: 15,
      target: 30,
      points: 500,
      type: "study_streak"
    },
    {
      title: "Flashcard Expert",
      description: "Create 100 flashcards",
      progress: 45,
      target: 100,
      points: 300,
      type: "flashcard_master"
    },
    {
      title: "Project Pioneer",
      description: "Complete your first project",
      progress: 0,
      target: 1,
      points: 200,
      type: "first_project"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Track your learning milestones and celebrate success</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Achievement Points</h2>
              <p className="text-gray-600">Total points earned</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{totalPoints}</div>
            <p className="text-sm text-gray-500">{achievements.length} achievements</p>
          </div>
        </div>
      </Card>

      {achievements.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Unlocked Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAchievementColor(achievement.achievement_type)}`}>
                    {getAchievementIcon(achievement.achievement_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{achievement.achievement_name}</h3>
                      <Badge variant="secondary">+{achievement.experience_points} pts</Badge>
                    </div>
                    {achievement.description && (
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingAchievements.map((achievement, index) => (
            <Card key={index} className="p-4 opacity-75">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAchievementColor(achievement.type)}`}>
                  {getAchievementIcon(achievement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{achievement.title}</h3>
                    <Badge variant="outline">+{achievement.points} pts</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {achievements.length === 0 && (
        <Card className="p-8 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
          <p className="text-gray-600">
            Start studying, create flashcards, and complete projects to unlock your first achievements!
          </p>
        </Card>
      )}
    </div>
  );
};
