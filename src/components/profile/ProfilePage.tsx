import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  Clock, 
  Target, 
  Trophy, 
  BookOpen, 
  TrendingUp,
  Edit
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const levelProgress = ((user.experience_points || 0) % 1000) / 1000 * 100;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {getInitials(user.name || 'U')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                {user.userType === 'exam' ? 'Exam Preparation' : 'College Student'}
              </Badge>
              {user.examType && (
                <Badge variant="outline">{user.examType}</Badge>
              )}
              {user.college && (
                <Badge variant="outline">{user.college}</Badge>
              )}
              {user.semester && (
                <Badge variant="outline">Semester {user.semester}</Badge>
              )}
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-2">
            <Trophy className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.current_level || 1}</p>
          <p className="text-sm text-gray-600">Current Level</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.experience_points || 0}</p>
          <p className="text-sm text-gray-600">Experience Points</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.study_streak || 0}</p>
          <p className="text-sm text-gray-600">Study Streak</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.total_study_hours || 0}</p>
          <p className="text-sm text-gray-600">Total Hours</p>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Level Progress</h2>
          </div>
          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            Level {user.current_level || 1}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{(user.experience_points || 0) % 1000} XP</span>
            <span>{Math.floor((user.current_level || 1)) * 1000} XP</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <p className="text-sm text-gray-500 text-center">
            {1000 - ((user.experience_points || 0) % 1000)} XP until next level
          </p>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Completed Flash Card Review</p>
              <p className="text-xs text-gray-500">Physics - Wave Optics • 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Study Session Completed</p>
              <p className="text-xs text-gray-500">Mathematics - Calculus • 5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Achievement Unlocked</p>
              <p className="text-xs text-gray-500">Study Streak Master • 1 day ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
