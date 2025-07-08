
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../auth/AuthProvider';
import { Target, Clock, Flame, BookOpen, TrendingUp, Calendar, Zap, Plus, Lightbulb } from 'lucide-react';
import { StudySessionPage } from '../session/StudySessionPage';
import { StudyPlanPage } from '../planner/StudyPlanPage';
import { AddProjectDialog } from '../projects/AddProjectDialog';
import { AddSkillDialog } from '../skills/AddSkillDialog';
import { ProjectIdeasExplorer } from '../projects/ProjectIdeasExplorer';
import { FeatureStatusCard } from '../common/FeatureStatusCard';

export const ExamDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'session' | 'plan'>('dashboard');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showProjectIdeas, setShowProjectIdeas] = useState(false);

  const todaysPlan = [
    { subject: 'Physics', topic: 'Thermodynamics', duration: '45 min', status: 'completed' },
    { subject: 'Chemistry', topic: 'Organic Reactions', duration: '30 min', status: 'current' },
    { subject: 'Math', topic: 'Calculus Practice', duration: '60 min', status: 'pending' }
  ];

  const handleStartNextSession = () => {
    console.log('Starting next study session...');
    setCurrentView('session');
    toast({
      title: "Session Started! 🚀",
      description: "Your Chemistry - Organic Reactions session has begun. Focus and give your best!",
    });
  };

  const handleViewStudyPlan = () => {
    console.log('Viewing study plan...');
    setCurrentView('plan');
    toast({
      title: "Study Plan Loaded 📚",
      description: "Your personalized study plan is now open.",
    });
  };

  const handleAddProject = () => {
    console.log('Adding new project...');
    setShowAddProject(true);
  };

  const handleAddSkill = () => {
    console.log('Adding new skill...');
    setShowAddSkill(true);
  };

  const handleExploreIdeas = () => {
    console.log('Exploring project ideas...');
    setShowProjectIdeas(true);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Generate AI recommendation based on user data
  const getAIRecommendation = () => {
    const currentSubject = todaysPlan.find(item => item.status === 'current');
    const completedCount = todaysPlan.filter(item => item.status === 'completed').length;
    const totalCount = todaysPlan.length;
    
    if (completedCount === totalCount) {
      return {
        title: "Excellent Progress! 🎉",
        message: "You've completed all today's topics. Consider reviewing weak areas or starting tomorrow's topics.",
        action: "Review Weak Topics"
      };
    } else if (currentSubject) {
      return {
        title: "Focus on Current Topic 🎯",
        message: `You're currently working on ${currentSubject.subject} - ${currentSubject.topic}. Based on your performance, spend extra time on problem-solving.`,
        action: "View Study Materials"
      };
    } else {
      return {
        title: "Ready for Next Challenge 💪",
        message: "Start with your pending Math topic. Your calculus foundation is strong, so focus on advanced integration techniques.",
        action: "Start Math Session"
      };
    }
  };

  const aiRec = getAIRecommendation();

  if (currentView === 'session') {
    return (
      <StudySessionPage 
        subject="Chemistry" 
        topic="Organic Reactions" 
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === 'plan') {
    return <StudyPlanPage onBack={handleBackToDashboard} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Header */}
        <Card className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Good morning, {user?.name || 'Student'}! 🎯</h2>
              <p className="text-indigo-100">Day 47 of your {user?.examType || 'JEE'} preparation journey</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">87%</div>
              <div className="text-indigo-200 text-sm">Syllabus Complete</div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">47</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.5h</div>
            <div className="text-sm text-gray-600">Today</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-600">Topics Left</div>
          </Card>
        </div>

        {/* Today's Plan */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Today's Study Plan</h3>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
          </div>

          <div className="space-y-3">
            {todaysPlan.map((item, index) => (
              <div key={index} className={`flex items-center p-3 rounded-lg border ${
                item.status === 'completed' ? 'bg-green-50 border-green-200' :
                item.status === 'current' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'current' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.subject} - {item.topic}</h4>
                  <p className="text-sm text-gray-600">{item.duration}</p>
                </div>
                <Badge variant={
                  item.status === 'completed' ? 'secondary' :
                  item.status === 'current' ? 'default' : 'outline'
                }>
                  {item.status === 'completed' ? 'Done' :
                   item.status === 'current' ? 'Current' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleStartNextSession}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Next Session
            </Button>
            <Button 
              variant="outline"
              onClick={handleViewStudyPlan}
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Study Plan
            </Button>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subject Progress</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Physics</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Chemistry</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Mathematics</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Exam-Focused Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mock Tests</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Mock Test Planner", description: "Create and schedule mock tests for better preparation." })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Mock Test
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Previous Tests", description: "Review your past mock test performances." })}
              >
                <Target className="w-4 h-4 mr-2" />
                View Test Results
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Study Tools</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Topic Tracker", description: "Track your syllabus completion progress." })}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Topic Tracker
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({ title: "Revision Log", description: "Plan and track your daily revision targets." })}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Daily Revision Log
              </Button>
            </div>
          </Card>
        </div>

        {/* AI Recommendation */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">{aiRec.title}</h4>
              <p className="text-gray-700 mb-3">{aiRec.message}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-purple-700 border-purple-300"
                onClick={handleViewStudyPlan}
              >
                {aiRec.action}
              </Button>
            </div>
          </div>
        </Card>

        {/* Feature Status Card */}
        <FeatureStatusCard />
      </div>

      {/* Dialogs */}
      <AddProjectDialog open={showAddProject} onOpenChange={setShowAddProject} />
      <AddSkillDialog open={showAddSkill} onOpenChange={setShowAddSkill} />
      <ProjectIdeasExplorer open={showProjectIdeas} onOpenChange={setShowProjectIdeas} />
    </>
  );
};
