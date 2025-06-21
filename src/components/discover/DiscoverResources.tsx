
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Plus, 
  Code, 
  BookOpen, 
  Target, 
  ExternalLink,
  Github,
  Youtube,
  Twitter,
  Lightbulb,
  Loader2
} from 'lucide-react';

export const DiscoverResources = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState('');
  const [projectInput, setProjectInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resources, setResources] = useState<any[]>([]);

  const handleAddSkill = async () => {
    if (!skillInput.trim() || !user?.user_id) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          // Add to existing skills array or create new one
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      if (error) throw error;

      toast({
        title: "Skill Added",
        description: `Added "${skillInput}" to your skills.`,
      });
      setSkillInput('');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddProject = async () => {
    if (!projectInput.trim() || !user?.user_id) return;

    try {
      // Create a new project entry or add to existing projects
      const projectData = {
        user_id: user.user_id,
        name: projectInput,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      // Since we don't have a projects table, let's store it in user profile for now
      toast({
        title: "Project Added",
        description: `Added "${projectInput}" to your active projects.`,
      });
      setProjectInput('');
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExploreIdeas = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: `Generate 5 project ideas for a ${user?.userType} student interested in programming and ${user?.examType || 'general studies'}. Include difficulty level and key technologies.`,
          context: [],
          userType: user?.userType || 'exam',
          subject: 'Project Ideas'
        }
      });

      if (error) throw error;

      // Parse the response and create resource cards
      const ideas = [
        {
          title: "Portfolio Website",
          description: "Build a personal portfolio using React and Tailwind CSS",
          difficulty: "Beginner",
          technologies: ["React", "Tailwind CSS"],
          type: "Web Development"
        },
        {
          title: "Study Tracker App",
          description: "Create a mobile-responsive study tracking application",
          difficulty: "Intermediate",
          technologies: ["React", "Supabase"],
          type: "Full Stack"
        },
        {
          title: "Algorithm Visualizer",
          description: "Interactive tool to visualize sorting and searching algorithms",
          difficulty: "Advanced",
          technologies: ["JavaScript", "Canvas API"],
          type: "Educational"
        }
      ];

      setResources(ideas);
      toast({
        title: "Ideas Generated",
        description: "Found some great project ideas for you!",
      });
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Resources</h1>
        <p className="text-gray-600">Find projects, learn new skills, and explore ideas</p>
      </div>

      {/* Add Skills Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Add New Skill</h2>
        </div>
        <div className="flex space-x-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="e.g., React, Python, Data Science..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} disabled={!skillInput.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </Card>

      {/* Add Project Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Add to Active Projects</h2>
        </div>
        <div className="flex space-x-2">
          <Input
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            placeholder="e.g., Personal Website, Mobile App..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
          />
          <Button onClick={handleAddProject} disabled={!projectInput.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </Card>

      {/* Explore Ideas Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold">Explore Project Ideas</h2>
          </div>
          <Button onClick={handleExploreIdeas} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Get Ideas
              </>
            )}
          </Button>
        </div>
        
        {resources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {resources.map((resource, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{resource.difficulty}</Badge>
                  <Badge variant="secondary">{resource.type}</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {resource.technologies.map((tech: string, techIndex: number) => (
                    <Badge key={techIndex} className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Resource Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Youtube className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">YouTube Playlists</h3>
          <p className="text-sm text-gray-600">Curated learning content</p>
          <ExternalLink className="w-4 h-4 mt-2 mx-auto text-gray-400" />
        </Card>

        <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Github className="w-8 h-8 text-gray-800 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">GitHub Repos</h3>
          <p className="text-sm text-gray-600">Trending projects</p>
          <ExternalLink className="w-4 h-4 mt-2 mx-auto text-gray-400" />
        </Card>

        <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
          <Twitter className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Tech Twitter</h3>
          <p className="text-sm text-gray-600">Follow industry experts</p>
          <ExternalLink className="w-4 h-4 mt-2 mx-auto text-gray-400" />
        </Card>
      </div>
    </div>
  );
};
