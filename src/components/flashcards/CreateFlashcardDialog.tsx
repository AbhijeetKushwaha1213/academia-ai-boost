
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';

interface CreateFlashcardDialogProps {
  children: React.ReactNode;
}

export const CreateFlashcardDialog = ({ children }: CreateFlashcardDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const { createFlashcard, isCreating } = useFlashcards();

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !question.trim() || !answer.trim()) {
      return;
    }

    createFlashcard({
      title: title.trim(),
      question: question.trim(),
      answer: answer.trim(),
      difficulty,
      tags,
    });

    // Reset form
    setTitle('');
    setQuestion('');
    setAnswer('');
    setDifficulty('medium');
    setTags([]);
    setNewTag('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter flashcard title..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Question
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Answer
            </label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <span>#{tag}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Flashcard'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
