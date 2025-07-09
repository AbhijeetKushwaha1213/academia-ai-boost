
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, TrendingUp, BookOpen, Users, Award, Zap } from 'lucide-react';

export const ExamDashboard = () => {
  const { user } = useAuth();
  const [studyStreak, setStudyStreak] = useState(0);
  const [todayStudyHours, setTodayStudyHours] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    // Simulate loading user data
    setStudyStreak(user?.study_streak || 0);
    setTodayStudyHours(2.5);
    setWeeklyProgress(68);
  }, [user]);

  const calculateDaysToExam = () => {
    if (!user?.exam_date) return null;
    const examDate = new Date(user.exam_date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysToExam = calculateDaysToExam();

  const quickActions = [
    { icon: BookOpen, label: 'Study Session', action: 'study' },
    { icon: Target, label: 'Practice Test', action: 'test' },
    { icon: Calendar, label: 'Schedule', action: 'schedule' },
    { icon: Users, label: 'Study Group', action: 'group' }
  ];

  const recentActivity = [
    { subject: 'Mathematics', time: '2 hours ago', score: 85, type: 'Practice Test' },
    { subject: 'Physics', time: '1 day ago', score: 92, type: 'Flashcards' },
    { subject: 'Chemistry', time: '2 days ago', score: 78, type: 'Study Session' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 🎯
          </h1>
          <p className="text-gray-600 mt-1">
            Preparing for {user?.exam_type || 'your exam'} {daysToExam && `• ${daysToExam} days to go`}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Level {user?.current_level || 1}
          </Badge>
          <Badge variant="outline">
            {user?.experience_points || 0} XP
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days to Exam</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {daysToExam || 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.exam_date ? new Date(user.exam_date).toLocaleDateString() : 'Set exam date'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {studyStreak} days
            </div>
            <p className="text-xs text-muted-foreground">
              Keep it going! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Study</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todayStudyHours}h
            </div>
            <p className="text-xs text-muted-foreground">
              Target: 4h daily
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {weeklyProgress}%
            </div>
            <Progress value={weeklyProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Start your study session or track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4"
                  onClick={() => console.log(`Action: ${action.action}`)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest study sessions and practice tests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">{activity.subject}</div>
                    <div className="text-sm text-gray-500">{activity.type} • {activity.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={activity.score >= 80 ? "default" : "secondary"}>
                    {activity.score}%
                  </Badge>
                  <Award className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Plan Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Study Plan Progress</CardTitle>
          <CardDescription>
            Track your progress across different subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Mathematics', 'Physics', 'Chemistry', 'Biology'].map((subject, index) => {
              const progress = [75, 60, 85, 45][index];
              return (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject}</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
