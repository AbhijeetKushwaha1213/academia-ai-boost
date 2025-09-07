import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';

interface AddSkillDialogProps {
  trigger?: React.ReactNode;
}

export const AddSkillDialog = ({ trigger }: AddSkillDialogProps) => {
  const [open, setOpen] = useState(false);
  const [skill, setSkill] = useState('');
  const [category, setCategory] = useState('General');

  const { createSkill, isCreating } = useSkills();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill.trim()) return;

    createSkill({
      skill: skill.trim(),
      category,
      progress: 0,
    });

    // Reset form
    setSkill('');
    setCategory('General');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Skill Name</Label>
            <Input
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., React.js, Python, UI/UX Design"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend">Frontend</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="DevOps">DevOps</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !skill.trim()}>
              {isCreating ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};