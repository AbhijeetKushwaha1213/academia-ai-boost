
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Target, Brain, Zap } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

export const AnalyticsDashboard = () => {
  const { analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  const improvementIcon = analytics.improvementTrend > 0 ? 
    <TrendingUp className="w-4 h-4 text-green-600" /> : 
    <TrendingDown className="w-4 h-4 text-red-600" />;

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Study Time</p>
              <p className="text-2xl font-bold">{Math.floor(analytics.totalStudyTime / 60)}h {analytics.totalStudyTime % 60}m</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accuracy Rate</p>
              <p className="text-2xl font-bold">{analytics.accuracyRate.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold">{analytics.streakDays} days</p>
            </div>
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Improvement</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold">{Math.abs(analytics.improvementTrend).toFixed(1)}%</p>
                {improvementIcon}
              </div>
            </div>
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Line type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subject Time Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.subjectBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, timeSpent }) => `${subject}: ${timeSpent.toFixed(1)}h`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="timeSpent"
                >
                  {analytics.subjectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Subject Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Subject Performance Analysis</h3>
        <div className="space-y-4">
          {analytics.subjectBreakdown.map((subject, index) => (
            <div key={subject.subject} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div>
                  <h4 className="font-medium">{subject.subject}</h4>
                  <p className="text-sm text-gray-600">{subject.timeSpent.toFixed(1)} hours studied</p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={subject.accuracy >= 80 ? "default" : subject.accuracy >= 60 ? "secondary" : "destructive"}
                >
                  {subject.accuracy.toFixed(1)}% accuracy
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Personalized Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generateRecommendations(analytics).map((rec, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <rec.icon className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <h4 className="font-medium text-indigo-900">{rec.title}</h4>
                  <p className="text-sm text-indigo-700">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

function generateRecommendations(analytics: any) {
  const recommendations = [];

  if (analytics.averageSessionLength < 30) {
    recommendations.push({
      icon: Clock,
      title: "Extend Study Sessions",
      description: "Try studying for 30-45 minutes per session for better retention."
    });
  }

  if (analytics.accuracyRate < 70) {
    recommendations.push({
      icon: Target,
      title: "Focus on Weak Areas",
      description: "Review topics where you're scoring below 70% accuracy."
    });
  }

  if (analytics.improvementTrend < 0) {
    recommendations.push({
      icon: TrendingUp,
      title: "Adjust Study Strategy",
      description: "Your performance trend suggests trying a different approach."
    });
  }

  const lowPerformanceSubjects = analytics.subjectBreakdown.filter(s => s.accuracy < 60);
  if (lowPerformanceSubjects.length > 0) {
    recommendations.push({
      icon: Brain,
      title: "Subject-Specific Help",
      description: `Focus more on ${lowPerformanceSubjects[0].subject} - consider additional resources.`
    });
  }

  return recommendations;
}
