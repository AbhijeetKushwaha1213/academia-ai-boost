
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Calendar, 
  BookOpen, 
  Brain, 
  Trophy,
  Clock,
  TrendingUp,
  FileText,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { ProgressSummary } from './ProgressSummary';

export const ExamDashboard = () => {
  const { user } = useAuth();

  const examDate = user?.examDate ? new Date(user.examDate) : null;
  const today = new Date();
  const daysRemaining = examDate ? Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const quickActions = [
    {
      icon: Brain,
      title: 'AI Flashcards',
      description: 'Generate smart flashcards',
      action: 'Create Cards',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BookOpen,
      title: 'Study Plan',
      description: 'Follow your daily plan',
      action: 'View Plan',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Practice Test',
      description: 'Take a mock exam',
      action: 'Start Test',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'View progress insights',
      action: 'See Stats',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const subjectProgress = [
    { subject: 'Mathematics', progress: 75, topics: 12, completed: 9 },
    { subject: 'Physics', progress: 60, topics: 15, completed: 9 },
    { subject: 'Chemistry', progress: 85, topics: 10, completed: 8 },
    { subject: 'Biology', progress: 45, topics: 18, completed: 8 }
  ];

  const todaysPlan = [
    { task: 'Organic Chemistry - Revision', time: '9:00 AM', status: 'completed' },
    { task: 'Mathematics - Practice Problems', time: '11:00 AM', status: 'current' },
    { task: 'Physics - Mock Test', time: '2:00 PM', status: 'pending' },
    { task: 'Biology - Flashcard Review', time: '4:00 PM', status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Exam Countdown */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {user?.examType} Preparation 🎯
            </h1>
            <p className="text-indigo-100">
              Stay focused, {user?.name}! You're making great progress.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{daysRemaining}</div>
            <div className="text-indigo-200">days left</div>
          </div>
        </div>
        
        {examDate && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Target: {examDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Level {user?.current_level}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <ProgressSummary />

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{action.description}</p>
              <Button size="sm" variant="outline" className="w-full">
                {action.action}
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Subject Progress
          </h2>
          <div className="space-y-4">
            {subjectProgress.map((subject, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{subject.subject}</span>
                  <Badge variant="secondary">
                    {subject.completed}/{subject.topics} topics
                  </Badge>
                </div>
                <Progress value={subject.progress} className="h-2" />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {subject.progress}% complete
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            <Target className="w-4 h-4 mr-2" />
            View Detailed Progress
          </Button>
        </Card>

        {/* Today's Plan */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Today's Study Plan
          </h2>
          <div className="space-y-3">
            {todaysPlan.map((plan, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                plan.status === 'completed' ? 'bg-green-50 border border-green-200' :
                plan.status === 'current' ? 'bg-blue-50 border border-blue-200' :
                'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  {plan.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : plan.status === 'current' ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  <div>
                    <p className="font-medium">{plan.task}</p>
                    <p className="text-sm text-gray-600">{plan.time}</p>
                  </div>
                </div>
                {plan.status === 'current' && (
                  <Badge>Current</Badge>
                )}
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Full Schedule
          </Button>
        </Card>
      </div>
    </div>
  );
};
