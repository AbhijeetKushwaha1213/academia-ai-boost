
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Target, BookOpen } from 'lucide-react';
import { useStudySessions } from '@/hooks/useStudySessions';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export const ProgressChart = () => {
  const { studySessions } = useStudySessions();

  // Generate last 7 days data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const dailyData = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const daySessions = studySessions.filter(session => session.session_date === dayStr);
    const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    
    return {
      date: format(day, 'MMM dd'),
      hours: Math.round((totalMinutes / 60) * 10) / 10,
      sessions: daySessions.length,
      flashcards: daySessions.reduce((sum, session) => sum + session.flashcards_reviewed, 0)
    };
  });

  // Session type distribution
  const sessionTypeData = studySessions.reduce((acc: any[], session) => {
    const existing = acc.find(item => item.type === session.session_type);
    if (existing) {
      existing.count += 1;
      existing.hours += session.duration_minutes / 60;
    } else {
      acc.push({
        type: session.session_type,
        count: 1,
        hours: session.duration_minutes / 60
      });
    }
    return acc;
  }, []);

  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Study Hours */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold">Daily Study Hours</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Session Count */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold">Daily Sessions</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Bar 
                  dataKey="sessions" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Session Type Distribution */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold">Session Types</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sessionTypeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ type, count }) => `${type}: ${count}`}
                  labelLine={false}
                >
                  {sessionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Summary */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Weekly Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {dailyData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {dailyData.reduce((sum, day) => sum + day.sessions, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {dailyData.reduce((sum, day) => sum + day.flashcards, 0)}
                </div>
                <div className="text-sm text-gray-600">Flashcards</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {dailyData.filter(day => day.hours > 0).length}
                </div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
