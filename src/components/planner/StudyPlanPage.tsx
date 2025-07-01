import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { TopicDetailPage } from './TopicDetailPage';

interface StudyPlanPageProps {
  onBack?: () => void;
}

export const StudyPlanPage = ({ onBack }: StudyPlanPageProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('today');
  const [selectedTopic, setSelectedTopic] = useState<{subject: string, topic: string} | null>(null);

  const todayPlan = [
    { subject: 'Physics', topic: 'Electromagnetic Induction', status: 'completed', duration: '45m' },
    { subject: 'Chemistry', topic: 'Organic Reactions', status: 'current', duration: '60m' },
    { subject: 'Math', topic: 'Integration by Parts', status: 'pending', duration: '45m' },
    { subject: 'Physics', topic: 'AC Circuits', status: 'pending', duration: '30m' },
  ];

  const weeklyPlan = [
    { day: 'Monday', subjects: ['Physics', 'Chemistry'], progress: 100 },
    { day: 'Tuesday', subjects: ['Math', 'Physics'], progress: 75 },
    { day: 'Wednesday', subjects: ['Chemistry', 'Math'], progress: 50 },
    { day: 'Thursday', subjects: ['Physics', 'Chemistry'], progress: 0 },
    { day: 'Friday', subjects: ['Math', 'Physics'], progress: 0 },
    { day: 'Saturday', subjects: ['Review', 'Practice Tests'], progress: 0 },
    { day: 'Sunday', subjects: ['Revision', 'Mock Test'], progress: 0 },
  ];

  const monthlyGoals = [
    { subject: 'Physics', progress: 85, total: 25, completed: 21 },
    { subject: 'Chemistry', progress: 70, total: 30, completed: 21 },
    { subject: 'Mathematics', progress: 90, total: 28, completed: 25 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'current': return 'bg-blue-50 border-blue-200';
      case 'pending': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const handleEditPlan = () => {
    toast({
      title: "Edit Mode Enabled ✏️",
      description: "You can now modify your study plan.",
    });
  };

  const handleTopicClick = (subject: string, topic: string) => {
    setSelectedTopic({ subject, topic });
  };

  if (selectedTopic) {
    return (
      <TopicDetailPage
        subject={selectedTopic.subject}
        topic={selectedTopic.topic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2">
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Study Plan</h1>
            <p className="text-gray-600">Your personalized learning journey</p>
          </div>
          <Button onClick={handleEditPlan} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Plan
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="today">📋 Today</TabsTrigger>
            <TabsTrigger value="week">📅 This Week</TabsTrigger>
            <TabsTrigger value="month">🗓️ This Month</TabsTrigger>
            <TabsTrigger value="year">📆 Year Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Today's Schedule</h3>
                <Badge variant="secondary">{format(new Date(), 'EEEE, MMMM d')}</Badge>
              </div>
              
              <div className="space-y-3">
                {todayPlan.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(item.status)}`}
                    onClick={() => handleTopicClick(item.subject, item.topic)}
                  >
                    {getStatusIcon(item.status)}
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium">{item.subject} - {item.topic}</h4>
                      <p className="text-sm text-gray-600">Duration: {item.duration}</p>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                      {item.status === 'completed' ? 'Done' : 
                       item.status === 'current' ? 'Current' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Weekly Overview</h3>
              <div className="space-y-4">
                {weeklyPlan.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{day.day}</h4>
                      <p className="text-sm text-gray-600">{day.subjects.join(', ')}</p>
                    </div>
                    <div className="w-32">
                      <Progress value={day.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{day.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Monthly Goals</h3>
                <div className="space-y-4">
                  {monthlyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{goal.subject}</span>
                        <span className="text-sm text-gray-600">
                          {goal.completed}/{goal.total} topics
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="year" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Year-Long Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Target className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-semibold mb-2">JEE Preparation</h4>
                  <p className="text-sm text-gray-600">Complete syllabus by March 2024</p>
                  <Progress value={65} className="h-2 mt-3" />
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                  <h4 className="font-semibold mb-2">Mock Tests</h4>
                  <p className="text-sm text-gray-600">Weekly practice tests</p>
                  <Progress value={40} className="h-2 mt-3" />
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-purple-600" />
                  <h4 className="font-semibold mb-2">Revision Cycles</h4>
                  <p className="text-sm text-gray-600">3 complete revision rounds</p>
                  <Progress value={20} className="h-2 mt-3" />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
