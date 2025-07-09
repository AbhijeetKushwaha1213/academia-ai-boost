
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Target, 
  BookOpen, 
  Clock,
  TrendingUp,
  FileText,
  CheckCircle,
  Plus,
  BarChart3,
  Archive,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { ScheduleMockTestDialog } from './exam-tools/ScheduleMockTestDialog';
import { ViewResultsDialog } from './exam-tools/ViewResultsDialog';
import { RevisionLogDialog } from './exam-tools/RevisionLogDialog';

export const ExamDashboard = () => {
  const [showScheduleTest, setShowScheduleTest] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRevisionLog, setShowRevisionLog] = useState(false);

  // Sample exam preparation data
  const examStats = {
    daysLeft: 127,
    totalTopics: 45,
    completedTopics: 28,
    mockTestsCompleted: 12,
    averageScore: 78
  };

  const upcomingTests = [
    { id: 1, name: "Physics Mock Test #5", date: "2025-01-15", duration: "3 hours" },
    { id: 2, name: "Chemistry Practice Set", date: "2025-01-17", duration: "2 hours" },
    { id: 3, name: "Mathematics Full Length", date: "2025-01-20", duration: "3 hours" }
  ];

  const todaysPlan = [
    { id: 1, subject: "Physics", topic: "Thermodynamics - Heat Engines", completed: true },
    { id: 2, subject: "Chemistry", topic: "Organic Reactions - SN1/SN2", completed: false },
    { id: 3, subject: "Mathematics", topic: "Calculus - Integration by Parts", completed: false }
  ];

  const handleDeleteTracker = () => {
    // Implement delete tracker functionality
    console.log('Delete tracker clicked');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">Exam Preparation Dashboard 📚</h1>
        <p className="text-green-100">Stay focused, track progress, and ace your exams</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-800">{examStats.daysLeft}</p>
              <p className="text-sm text-red-600">Days to Exam</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">{examStats.completedTopics}/{examStats.totalTopics}</p>
              <p className="text-sm text-blue-600">Topics Covered</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-800">{examStats.mockTestsCompleted}</p>
              <p className="text-sm text-green-600">Mock Tests</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-800">{examStats.averageScore}%</p>
              <p className="text-sm text-purple-600">Average Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Exam-Specific Action Buttons */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Preparation Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            onClick={() => setShowScheduleTest(true)}
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Schedule Mock Test</span>
          </Button>
          
          <Button 
            onClick={() => setShowResults(true)}
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-green-600 hover:bg-green-700"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-medium">View Results</span>
          </Button>
          
          <Button 
            onClick={() => setShowRevisionLog(true)}
            className="h-auto p-4 flex flex-col items-center space-y-2 bg-purple-600 hover:bg-purple-700"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-sm font-medium">Revision Log</span>
          </Button>
          
          <Button 
            onClick={handleDeleteTracker}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-6 h-6" />
            <span className="text-sm font-medium">Delete Tracker</span>
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Study Plan */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Today's Study Plan</span>
          </h2>
          
          <div className="space-y-3">
            {todaysPlan.map((item) => (
              <div key={item.id} className={`p-4 rounded-lg border-2 ${
                item.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {item.completed && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                    <p className="text-sm text-gray-600">{item.topic}</p>
                  </div>
                  <Badge variant={item.completed ? "default" : "outline"}>
                    {item.completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Daily Progress</span>
              <span>33%</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>
        </Card>

        {/* Upcoming Mock Tests */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Upcoming Mock Tests</span>
          </h2>
          
          <div className="space-y-3">
            {upcomingTests.map((test) => (
              <div key={test.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600">Duration: {test.duration}</p>
                  </div>
                  <Badge variant="outline">{test.date}</Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => setShowScheduleTest(true)}
            className="w-full mt-4"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule New Test
          </Button>
        </Card>
      </div>

      {/* Subject-wise Progress */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Subject-wise Progress</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Physics</h3>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" transform="translate(36, 36)" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${75 * 0.628} ${100 * 0.628}`} className="text-blue-600" transform="translate(36, 36)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">75%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">12/16 chapters</p>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Chemistry</h3>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" transform="translate(36, 36)" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${60 * 0.628} ${100 * 0.628}`} className="text-green-600" transform="translate(36, 36)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">60%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">9/15 chapters</p>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Mathematics</h3>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" transform="translate(36, 36)" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${85 * 0.628} ${100 * 0.628}`} className="text-purple-600" transform="translate(36, 36)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">85%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">12/14 chapters</p>
          </div>
        </div>
      </Card>

      {/* Dialogs */}
      <ScheduleMockTestDialog 
        open={showScheduleTest}
        onOpenChange={setShowScheduleTest}
      />
      
      <ViewResultsDialog 
        open={showResults}
        onOpenChange={setShowResults}
      />
      
      <RevisionLogDialog 
        open={showRevisionLog}
        onOpenChange={setShowRevisionLog}
      />
    </div>
  );
};
