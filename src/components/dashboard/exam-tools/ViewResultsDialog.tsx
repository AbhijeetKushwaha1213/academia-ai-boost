
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface ViewResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewResultsDialog = ({ open, onOpenChange }: ViewResultsDialogProps) => {
  // Sample results data
  const recentTests = [
    {
      id: 1,
      name: "Physics Mock Test #4",
      date: "2025-01-10",
      score: 85,
      totalMarks: 100,
      subjects: { Physics: 85 },
      improvement: 5
    },
    {
      id: 2,
      name: "Chemistry Practice Set",
      date: "2025-01-08",
      score: 72,
      totalMarks: 100,
      subjects: { Chemistry: 72 },
      improvement: -3
    },
    {
      id: 3,
      name: "Full Length Test #3",
      date: "2025-01-05",
      score: 78,
      totalMarks: 120,
      subjects: { Physics: 82, Chemistry: 75, Mathematics: 77 },
      improvement: 8
    }
  ];

  const overallStats = {
    averageScore: 78,
    totalTests: 12,
    improvement: 12,
    strongSubject: "Physics",
    weakSubject: "Chemistry"
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (improvement < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Test Results & Analytics</span>
          </DialogTitle>
        </DialogHeader>

        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{overallStats.averageScore}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{overallStats.totalTests}</p>
            <p className="text-sm text-gray-600">Tests Completed</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">+{overallStats.improvement}%</p>
            <p className="text-sm text-gray-600">Overall Improvement</p>
          </Card>
          
          <Card className="p-4 text-center">
            <p className="text-lg font-bold text-gray-900">{overallStats.strongSubject}</p>
            <p className="text-sm text-gray-600">Strongest Subject</p>
          </Card>
        </div>

        {/* Recent Test Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>
          
          {recentTests.map((test) => (
            <Card key={test.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{test.name}</h4>
                  <p className="text-sm text-gray-600">{test.date}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                      {test.score}%
                    </span>
                    {getImprovementIcon(test.improvement)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {test.score}/{test.totalMarks} marks
                  </p>
                </div>
              </div>

              {/* Subject-wise breakdown */}
              <div className="space-y-2">
                {Object.entries(test.subjects).map(([subject, score]) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{subject}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={score as number} className="w-24 h-2" />
                      <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Improvement indicator */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Improvement from last test:</span>
                  <Badge 
                    variant={test.improvement > 0 ? "default" : test.improvement < 0 ? "destructive" : "secondary"}
                    className="flex items-center space-x-1"
                  >
                    {getImprovementIcon(test.improvement)}
                    <span>{test.improvement > 0 ? '+' : ''}{test.improvement}%</span>
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Performance Insights */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Performance Insights</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Your strongest subject is <strong>{overallStats.strongSubject}</strong> with consistent high scores</p>
            <p>• Focus more on <strong>{overallStats.weakSubject}</strong> - consider additional practice sessions</p>
            <p>• You've improved by <strong>{overallStats.improvement}%</strong> over the last month - keep it up!</p>
            <p>• Try to maintain consistency in your preparation schedule</p>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
