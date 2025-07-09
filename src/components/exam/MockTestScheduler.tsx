
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, BookOpen } from 'lucide-react';

interface MockTestSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MockTestScheduler: React.FC<MockTestSchedulerProps> = ({ open, onOpenChange }) => {
  const [testName, setTestName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [duration, setDuration] = useState('180');

  const handleSchedule = () => {
    // Placeholder for scheduling logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Mock Test</DialogTitle>
        </DialogHeader>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 mb-2">Coming Soon!</h3>
            <p className="text-blue-700 text-sm">
              Mock test scheduling feature is under development. 
              You'll be able to create and schedule personalized mock tests soon.
            </p>
          </div>
        </Card>

        <div className="space-y-4 opacity-50">
          <div>
            <Label htmlFor="testName">Test Name</Label>
            <Input id="testName" value={testName} onChange={(e) => setTestName(e.target.value)} disabled />
          </div>
          
          <div>
            <Label htmlFor="testDate">Test Date</Label>
            <Input id="testDate" type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} disabled />
          </div>
          
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} disabled />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Close
          </Button>
          <Button onClick={handleSchedule} disabled className="flex-1">
            Schedule Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
