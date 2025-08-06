
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
import { ScheduleMockTestModal } from '../exam/ScheduleMockTestModal';
import { ViewResultsModal } from '../exam/ViewResultsModal';
import { DeleteTrackerModal } from '../exam/DeleteTrackerModal';
import { RevisionLogModal } from '../exam/RevisionLogModal';
import { useSubjects } from '@/hooks/useSubjects';
import { useDailyStats } from '@/hooks/useDailyStats';
import { AddSubjectDialog } from '../subjects/AddSubjectDialog';


export const ExamDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'session' | 'plan'>('dashboard');
  const [showScheduleMockTest, setShowScheduleMockTest] = useState(false);
  const [showViewResults, setShowViewResults] = useState(false);
  const [showDeleteTracker, setShowDeleteTracker] = useState(false);
  const [showRevisionLog, setShowRevisionLog] = useState(false);

  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { dailyStats, weeklyTotals } = useDailyStats();

  // Calculate dynamic data
  const todaysStudyTimeHours = dailyStats ? (dailyStats.study_time_minutes / 60).toFixed(1) : '0';
  const syllabusComplete = subjects.length > 0 
    ? Math.round((subjects.reduce((acc, s) => acc + s.completed_topics, 0) / subjects.reduce((acc, s) => acc + s.total_topics, 0)) * 100) || 0
    : 0;
  const topicsLeft = subjects.reduce((acc, s) => acc + (s.total_topics - s.completed_topics), 0);
  const studyStreak = user?.study_streak || 0;

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


  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Generate AI recommendation based on user data
  const getAIRecommendation = () => {
    if (subjects.length === 0) {
      return {
        title: "Get Started! 📚",
        message: "Add your first subject to begin tracking your study progress.",
        action: "Add Subject"
      };
    }
    
    const inProgressSubjects = subjects.filter(s => s.completed_topics < s.total_topics);
    if (inProgressSubjects.length === 0) {
      return {
        title: "Excellent Progress! 🎉",
        message: "You've completed all subjects! Consider adding more topics or reviewing completed ones.",
        action: "Review Completed"
      };
    }
    
    const nextSubject = inProgressSubjects[0];
    const progressPercent = Math.round((nextSubject.completed_topics / nextSubject.total_topics) * 100);
    
    return {
      title: `Focus on ${nextSubject.name} 🎯`,
      message: `You're ${progressPercent}% through ${nextSubject.name}. Keep the momentum going!`,
      action: "Continue Learning"
    };
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
              <p className="text-indigo-100">Day {studyStreak} of your {user?.examType || 'exam'} preparation journey</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{syllabusComplete}%</div>
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
            <div className="text-2xl font-bold text-gray-900">{studyStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{todaysStudyTimeHours}h</div>
            <div className="text-sm text-gray-600">Today</div>
          </Card>

          <Card className="p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{topicsLeft}</div>
            <div className="text-sm text-gray-600">Topics Left</div>
          </Card>
        </div>

        {/* Today's Plan */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Your Subjects</h3>
            <AddSubjectDialog />
          </div>

          {subjectsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading subjects...</div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Subjects Added</h4>
              <p className="text-gray-600 mb-4">Start by adding your first subject to track your progress</p>
              <AddSubjectDialog trigger={
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Subject
                </Button>
              } />
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.map((subject) => {
                const progress = subject.total_topics > 0 ? (subject.completed_topics / subject.total_topics) * 100 : 0;
                const isCompleted = subject.completed_topics === subject.total_topics;
                
                return (
                  <div key={subject.id} className={`flex items-center p-3 rounded-lg border ${
                    isCompleted ? 'bg-green-50 border-green-200' :
                    progress > 50 ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isCompleted ? 'bg-green-500' :
                      progress > 50 ? 'bg-blue-500' :
                      'bg-gray-400'
                    }`}>
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                      <p className="text-sm text-gray-600">{subject.completed_topics} / {subject.total_topics} topics</p>
                    </div>
                    <Badge variant={isCompleted ? 'secondary' : progress > 50 ? 'default' : 'outline'}>
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={handleStartNextSession}
              disabled={subjects.length === 0}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Session
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
          
          {subjects.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No subjects to track yet
            </div>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => {
                const progress = subject.total_topics > 0 ? (subject.completed_topics / subject.total_topics) * 100 : 0;
                return (
                  <div key={subject.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{subject.name}</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Exam-Focused Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mock Tests</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowScheduleMockTest(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Mock Test
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowViewResults(true)}
              >
                <Target className="w-4 h-4 mr-2" />
                View Results
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Exam Tools</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => setShowDeleteTracker(true)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Delete Tracker
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowRevisionLog(true)}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Revision Log
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

      </div>

      {/* Exam Modals */}
      <ScheduleMockTestModal open={showScheduleMockTest} onOpenChange={setShowScheduleMockTest} />
      <ViewResultsModal open={showViewResults} onOpenChange={setShowViewResults} />
      <DeleteTrackerModal open={showDeleteTracker} onOpenChange={setShowDeleteTracker} />
      <RevisionLogModal open={showRevisionLog} onOpenChange={setShowRevisionLog} />
    </>
  );
};
