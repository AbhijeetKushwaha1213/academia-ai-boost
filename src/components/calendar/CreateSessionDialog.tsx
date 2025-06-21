
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useStudySessions } from '@/hooks/useStudySessions';
import { format } from 'date-fns';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export const CreateSessionDialog = ({ open, onOpenChange, selectedDate }: CreateSessionDialogProps) => {
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState('');
  
  const { createSession, isCreating } = useStudySessions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionType || !duration) return;

    const topicsArray = topics.split(',').map(t => t.trim()).filter(Boolean);

    createSession({
      session_type: sessionType,
      duration_minutes: parseInt(duration),
      topics_covered: topicsArray,
      flashcards_reviewed: 0,
      correct_answers: 0,
      session_date: format(selectedDate, 'yyyy-MM-dd'),
    });

    // Reset form
    setSessionType('');
    setDuration('');
    setTopics('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Study Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sessionType">Session Type</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Review">Review Session</SelectItem>
                <SelectItem value="New Learning">New Learning</SelectItem>
                <SelectItem value="Practice">Practice Test</SelectItem>
                <SelectItem value="Flashcards">Flashcard Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              min="15"
              max="480"
              required
            />
          </div>

          <div>
            <Label htmlFor="topics">Topics (comma-separated)</Label>
            <Textarea
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="Mathematics, Physics, Chemistry"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
