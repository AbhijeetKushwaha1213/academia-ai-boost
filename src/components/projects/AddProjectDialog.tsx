import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Globe, FileText, Calendar, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProjectDialog = ({ open, onOpenChange }: AddProjectDialogProps) => {
  const { toast } = useToast();
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    type: '',
    deadline: '',
    technologies: [] as string[],
    githubUrl: '',
    demoUrl: '',
    notionUrl: ''
  });

  const [newTech, setNewTech] = useState('');

  const addTechnology = () => {
    if (newTech.trim() && !projectData.technologies.includes(newTech.trim())) {
      setProjectData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setProjectData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSave = () => {
    if (!projectData.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required.",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving to database
    console.log('Saving project:', projectData);
    
    toast({
      title: "Project Added! 🎉",
      description: `${projectData.name} has been added to your portfolio.`,
    });

    // Reset form
    setProjectData({
      name: '',
      description: '',
      type: '',
      deadline: '',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      notionUrl: ''
    });
    
    onOpenChange(false);
  };

  const connectGitHub = () => {
    toast({
      title: "GitHub Integration",
      description: "Connect your GitHub account to sync repositories automatically.",
    });
  };

  const connectNotion = () => {
    toast({
      title: "Notion Integration",
      description: "Connect your Notion workspace to sync project documentation.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">📝 Manual Entry</TabsTrigger>
            <TabsTrigger value="connect">🔗 Connect Services</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={projectData.name}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <Label htmlFor="type">Project Type</Label>
                <Select onValueChange={(value) => setProjectData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Application</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="desktop">Desktop App</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={projectData.deadline}
                onChange={(e) => setProjectData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>

            <div>
              <Label>Technologies</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology..."
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                />
                <Button onClick={addTechnology} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="cursor-pointer">
                    {tech}
                    <X 
                      className="w-3 h-3 ml-1" 
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  value={projectData.githubUrl}
                  onChange={(e) => setProjectData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div>
                <Label htmlFor="demo">Demo URL</Label>
                <Input
                  id="demo"
                  value={projectData.demoUrl}
                  onChange={(e) => setProjectData(prev => ({ ...prev, demoUrl: e.target.value }))}
                  placeholder="https://myproject.com"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connect" className="space-y-4">
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Github className="w-8 h-8" />
                    <div>
                      <h4 className="font-semibold">GitHub</h4>
                      <p className="text-sm text-gray-600">Sync repositories and track commits</p>
                    </div>
                  </div>
                  <Button onClick={connectGitHub}>Connect</Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8" />
                    <div>
                      <h4 className="font-semibold">Notion</h4>
                      <p className="text-sm text-gray-600">Import project documentation and tasks</p>
                    </div>
                  </div>
                  <Button onClick={connectNotion}>Connect</Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-8 h-8" />
                    <div>
                      <h4 className="font-semibold">Locofy</h4>
                      <p className="text-sm text-gray-600">Track UI/UX design work</p>
                    </div>
                  </div>
                  <Button variant="outline">Coming Soon</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
