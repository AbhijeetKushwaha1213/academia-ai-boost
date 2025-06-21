
import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Target, 
  Calendar, 
  BookOpen, 
  Clock, 
  Zap,
  Award,
  Lock
} from 'lucide-react';

export const AchievementsPage = () => {
  const { user } = useAuth();

  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first study session",
      icon: Target,
      earned: true,
      progress: 100,
      xp: 50,
      category: "Study",
      earnedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Study Streak",
      description: "Study for 7 consecutive days",
      icon: Calendar,
      earned: true,
      progress: 100,
      xp: 200,
      category: "Consistency",
      earnedDate: "2024-01-22"
    },
    {
      id: 3,
      name: "Flashcard Master",
      description: "Review 100 flashcards",
      icon: BookOpen,
      earned: false,
      progress: 67,
      xp: 150,
      category: "Study",
      requirement: "67/100 flashcards reviewed"
    },
    {
      id: 4,
      name: "Time Keeper",
      description: "Study for 50 total hours",
      icon: Clock,
      earned: false,
      progress: 45,
      xp: 300,
      category: "Study",
      requirement: "22.5/50 hours completed"
    },
    {
      id: 5,
      name: "Lightning Round",
      description: "Answer 20 questions correctly in under 5 minutes",
      icon: Zap,
      earned: false,
      progress: 0,
      xp: 100,
      category: "Speed",
      requirement: "Not attempted"
    },
    {
      id: 6,
      name: "Knowledge Seeker",
      description: "Create 50 flashcards",
      icon: Star,
      earned: false,
      progress: 24,
      xp: 250,
      category: "Creation",
      requirement: "12/50 flashcards created"
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalXP = earnedAchievements.reduce((sum, achievement) => sum + achievement.xp, 0);

  const getCategoryColor = (category: string) => {
    const colors = {
      Study: "bg-blue-100 text-blue-800",
      Consistency: "bg-green-100 text-green-800",
      Speed: "bg-yellow-100 text-yellow-800",
      Creation: "bg-purple-100 text-purple-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total XP Earned</p>
          <p className="text-2xl font-bold text-indigo-600">{totalXP}</p>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gold-100 rounded-lg mx-auto mb-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{earnedAchievements.length}</p>
          <p className="text-sm text-gray-600">Achievements Earned</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-2">
            <Award className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{achievements.length - earnedAchievements.length}</p>
          <p className="text-sm text-gray-600">In Progress</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round((earnedAchievements.length / achievements.length) * 100)}%</p>
          <p className="text-sm text-gray-600">Completion Rate</p>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          
          return (
            <Card key={achievement.id} className={`p-6 relative ${achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : 'bg-gray-50'}`}>
              {achievement.earned && (
                <div className="absolute top-2 right-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                  achievement.earned 
                    ? 'bg-yellow-100' 
                    : achievement.progress > 0 
                      ? 'bg-indigo-100' 
                      : 'bg-gray-200'
                }`}>
                  {achievement.earned ? (
                    <Icon className="w-6 h-6 text-yellow-600" />
                  ) : achievement.progress > 0 ? (
                    <Icon className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                    <Badge variant="secondary" className={getCategoryColor(achievement.category)}>
                      {achievement.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  {achievement.earned ? (
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Completed
                      </Badge>
                      <span className="text-sm font-medium text-yellow-600">+{achievement.xp} XP</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      <p className="text-xs text-gray-500">{achievement.requirement}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
