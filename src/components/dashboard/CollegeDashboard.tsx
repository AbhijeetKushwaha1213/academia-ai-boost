
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Code, 
  Github, 
  Trophy, 
  Target, 
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { ProgressSummary } from './ProgressSummary';

export const CollegeDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: Code,
      title: 'Practice Coding',
      description: 'Solve problems on LeetCode, HackerRank',
      action: 'Start Coding',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Github,
      title: 'GitHub Projects',
      description: 'Work on your portfolio projects',
      action: 'View Projects',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: BookOpen,
      title: 'Study Materials',
      description: 'Access your course resources',
      action: 'Open Materials',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Study Groups',
      description: 'Join collaborative sessions',
      action: 'Find Groups',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const skillsProgress = [
    { skill: 'JavaScript', progress: 75, level: 'Intermediate' },
    { skill: 'React', progress: 60, level: 'Beginner+' },
    { skill: 'Python', progress: 85, level: 'Advanced' },
    { skill: 'Data Structures', progress: 45, level: 'Beginner' }
  ];

  const upcomingDeadlines = [
    { title: 'Database Assignment', due: '3 days', type: 'assignment' },
    { title: 'Web Dev Project', due: '1 week', type: 'project' },
    { title: 'Data Structures Quiz', due: '5 days', type: 'quiz' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 🚀
        </h1>
        <p className="text-purple-100">
          {user?.college} • {user?.branch} • Semester {user?.semester}
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Level {user?.current_level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>{user?.experience_points} XP</span>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <ProgressSummary />

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
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
        {/* Skills Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Skills Progress
          </h2>
          <div className="space-y-4">
            {skillsProgress.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skill.skill}</span>
                  <Badge variant="secondary">{skill.level}</Badge>
                </div>
                <Progress value={skill.progress} className="h-2" />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {skill.progress}%
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            <Code className="w-4 h-4 mr-2" />
            Practice More Skills
          </Button>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-gray-600 capitalize">{deadline.type}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {deadline.due}
                </Badge>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View All Tasks
          </Button>
        </Card>
      </div>
    </div>
  );
};
