
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useToast } from '@/hooks/use-toast';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export const CreateSessionDialog = ({ open, onOpenChange, selectedDate }: CreateSessionDialogProps) => {
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');
  const [description, setDescription] = useState('');

  const { createSession, isCreating } = useStudySessions();
  const { toast } = useToast();

  const sessionTypes = [
    'Flashcard Review',
    'Reading',
    'Practice Problems',
    'Video Lectures',
    'Mock Test',
    'Group Study',
    'Research',
    'Writing',
    'Lab Work',
    'Revision'
  ];

  const addTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
      setTopics([...topics, currentTopic.trim()]);
      setCurrentTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionType || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in session type and duration.",
        variant: "destructive",
      });
      return;
    }

    createSession({
      session_type: sessionType,
      duration_minutes: parseInt(duration),
      topics_covered: topics,
      session_date: format(selectedDate, 'yyyy-MM-dd'),
      flashcards_reviewed: 0,
      correct_answers: 0,
    });

    // Reset form
    setSessionType('');
    setDuration('');
    setTopics([]);
    setCurrentTopic('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Study Session</DialogTitle>
          <p className="text-sm text-gray-600">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-type">Session Type</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              min="1"
              max="480"
            />
          </div>

          <div className="space-y-2">
            <Label>Topics to Cover</Label>
            <div className="flex space-x-2">
              <Input
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                placeholder="Add a topic"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
              />
              <Button type="button" onClick={addTopic} variant="outline">
                Add
              </Button>
            </div>
            
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                    {topic}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTopic(topic)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional notes about this session..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
