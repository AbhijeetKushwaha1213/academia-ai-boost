
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Award } from 'lucide-react';

interface TestResultsViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TestResultsViewer: React.FC<TestResultsViewerProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Test Results Dashboard</DialogTitle>
        </DialogHeader>
        
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-900 mb-2">Coming Soon!</h3>
            <p className="text-green-700 text-sm">
              Comprehensive test results and analytics dashboard is being developed. 
              Track your performance trends, identify weak areas, and monitor improvement.
            </p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 opacity-50">
          <Card className="p-3 text-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xs text-gray-600">Average Score</div>
            <div className="font-bold">--</div>
          </Card>
          
          <Card className="p-3 text-center">
            <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-xs text-gray-600">Best Score</div>
            <div className="font-bold">--</div>
          </Card>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
