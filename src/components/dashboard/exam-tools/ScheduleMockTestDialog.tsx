
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleMockTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleMockTestDialog = ({ open, onOpenChange }: ScheduleMockTestDialogProps) => {
  const [testData, setTestData] = useState({
    name: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    description: ''
  });
  const { toast } = useToast();

  const subjects = [
    'Physics',
    'Chemistry', 
    'Mathematics',
    'Biology',
    'English',
    'All Subjects (Full Length)'
  ];

  const durations = [
    '1 hour',
    '2 hours', 
    '3 hours',
    '4 hours'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically save to database
    console.log('Scheduling mock test:', testData);
    
    toast({
      title: "Mock Test Scheduled! 📅",
      description: `${testData.name} scheduled for ${testData.date} at ${testData.time}`,
    });
    
    onOpenChange(false);
    setTestData({
      name: '',
      subject: '',
      date: '',
      time: '',
      duration: '',
      description: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Schedule Mock Test</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testName">Test Name *</Label>
              <Input
                id="testName"
                value={testData.name}
                onChange={(e) => setTestData({...testData, name: e.target.value})}
                placeholder="e.g., Physics Mock Test #5"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select 
                value={testData.subject} 
                onValueChange={(value) => setTestData({...testData, subject: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={testData.date}
                onChange={(e) => setTestData({...testData, date: e.target.value})}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={testData.time}
                onChange={(e) => setTestData({...testData, time: e.target.value})}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Select 
                value={testData.duration} 
                onValueChange={(value) => setTestData({...testData, duration: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={testData.description}
              onChange={(e) => setTestData({...testData, description: e.target.value})}
              placeholder="Add any notes about this test..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Test Details</h3>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• You'll receive a reminder notification 30 minutes before the test</p>
              <p>• Test will include questions based on your current syllabus progress</p>
              <p>• Results and detailed analysis will be available immediately after completion</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Test
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
