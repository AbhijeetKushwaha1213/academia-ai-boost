
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Palette, Users, Briefcase, Brain, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddSkillDialog = ({ open, onOpenChange }: AddSkillDialogProps) => {
  const { toast } = useToast();
  const [skillData, setSkillData] = useState({
    name: '',
    domain: '',
    proficiency: [50],
    linkedGoal: '',
    linkedProject: ''
  });

  const domains = [
    { value: 'frontend', label: 'Frontend Development', icon: Code },
    { value: 'backend', label: 'Backend Development', icon: Wrench },
    { value: 'design', label: 'UI/UX Design', icon: Palette },
    { value: 'soft', label: 'Soft Skills', icon: Users },
    { value: 'business', label: 'Business Skills', icon: Briefcase },
    { value: 'academic', label: 'Academic Subject', icon: Brain },
  ];

  const goals = [
    'Complete Web Development Course',
    'Build 5 React Projects',
    'Learn Python for Data Science',
    'Master JavaScript Fundamentals'
  ];

  const projects = [
    'E-commerce Website',
    'Portfolio Website',
    'Task Management App',
    'Weather App'
  ];

  const getProficiencyLabel = (value: number) => {
    if (value <= 20) return 'Beginner';
    if (value <= 40) return 'Basic';
    if (value <= 60) return 'Intermediate';
    if (value <= 80) return 'Advanced';
    return 'Expert';
  };

  const getProficiencyColor = (value: number) => {
    if (value <= 20) return 'text-red-600';
    if (value <= 40) return 'text-orange-600';
    if (value <= 60) return 'text-yellow-600';
    if (value <= 80) return 'text-blue-600';
    return 'text-green-600';
  };

  const handleSave = () => {
    if (!skillData.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!skillData.domain) {
      toast({
        title: "Error",
        description: "Please select a domain.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving to database
    console.log('Saving skill:', skillData);
    
    toast({
      title: "Skill Added! 🌟",
      description: `${skillData.name} has been added to your skill set.`,
    });

    // Reset form
    setSkillData({
      name: '',
      domain: '',
      proficiency: [50],
      linkedGoal: '',
      linkedProject: ''
    });
    
    onOpenChange(false);
  };

  const selectedDomain = domains.find(d => d.value === skillData.domain);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="skillName">Skill Name *</Label>
            <Input
              id="skillName"
              value={skillData.name}
              onChange={(e) => setSkillData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, Python, Communication"
            />
          </div>

          <div>
            <Label>Domain *</Label>
            <Select onValueChange={(value) => setSkillData(prev => ({ ...prev, domain: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain.value} value={domain.value}>
                    <div className="flex items-center">
                      <domain.icon className="w-4 h-4 mr-2" />
                      {domain.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Proficiency Level</Label>
            <Card className="p-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Current Level:</span>
                <Badge className={getProficiencyColor(skillData.proficiency[0])}>
                  {getProficiencyLabel(skillData.proficiency[0])} ({skillData.proficiency[0]}%)
                </Badge>
              </div>
              <Slider
                value={skillData.proficiency}
                onValueChange={(value) => setSkillData(prev => ({ ...prev, proficiency: value }))}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </Card>
          </div>

          <div>
            <Label>Link to Goal (Optional)</Label>
            <Select onValueChange={(value) => setSkillData(prev => ({ ...prev, linkedGoal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select related goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal, index) => (
                  <SelectItem key={index} value={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Link to Project (Optional)</Label>
            <Select onValueChange={(value) => setSkillData(prev => ({ ...prev, linkedProject: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select related project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project, index) => (
                  <SelectItem key={index} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDomain && (
            <Card className="p-3 bg-blue-50">
              <div className="flex items-center">
                <selectedDomain.icon className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm text-blue-800">
                  This skill will be categorized under {selectedDomain.label}
                </span>
              </div>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
