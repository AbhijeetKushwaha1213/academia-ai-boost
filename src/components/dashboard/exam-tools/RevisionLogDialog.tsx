
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RotateCcw, Plus, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RevisionLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RevisionItem {
  id: number;
  topic: string;
  subject: string;
  completed: boolean;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const RevisionLogDialog = ({ open, onOpenChange }: RevisionLogDialogProps) => {
  const [newTopic, setNewTopic] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const { toast } = useToast();

  // Sample revision data
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([
    {
      id: 1,
      topic: "Thermodynamics - Heat Engines",
      subject: "Physics",
      completed: true,
      date: "2025-01-10",
      difficulty: "medium"
    },
    {
      id: 2,
      topic: "Organic Reactions - SN1/SN2",
      subject: "Chemistry", 
      completed: false,
      date: "2025-01-11",
      difficulty: "hard"
    },
    {
      id: 3,
      topic: "Integration by Parts",
      subject: "Mathematics",
      completed: false,
      date: "2025-01-11",
      difficulty: "easy"
    }
  ]);

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newSubject.trim()) return;

    const newItem: RevisionItem = {
      id: Date.now(),
      topic: newTopic,
      subject: newSubject,
      completed: false,
      date: new Date().toISOString().split('T')[0],
      difficulty: 'medium'
    };

    setRevisionItems([...revisionItems, newItem]);
    setNewTopic('');
    setNewSubject('');
    
    toast({
      title: "Topic Added! 📝",
      description: `${newTopic} added to revision log`,
    });
  };

  const toggleComplete = (id: number) => {
    setRevisionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = revisionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / revisionItems.length) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Daily Revision Log</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Summary */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-purple-900">Today's Progress</h3>
            <Badge className="bg-purple-100 text-purple-800">
              {completedCount}/{revisionItems.length} completed
            </Badge>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-purple-700 mt-2">{completionPercentage}% completion rate</p>
        </Card>

        {/* Add New Topic */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Topic for Revision</span>
          </h3>
          
          <form onSubmit={handleAddTopic} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g., Quadratic Equations"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., Mathematics"
                  className="mt-1"
                />
              </div>
            </div>
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Topic
            </Button>
          </form>
        </Card>

        {/* Revision Items */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Revision Checklist</h3>
          
          {revisionItems.map((item) => (
            <Card key={item.id} className={`p-4 transition-all duration-200 ${
              item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleComplete(item.id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {item.topic}
                      </h4>
                      <p className="text-sm text-gray-600">{item.subject}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                      {item.completed && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Scheduled: {item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Study Tips */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Revision Tips 💡</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Review topics multiple times with increasing intervals (spaced repetition)</p>
            <p>• Focus more time on topics marked as 'hard' difficulty</p>
            <p>• Use active recall - test yourself without looking at notes</p>
            <p>• Create summary notes or mind maps for complex topics</p>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
