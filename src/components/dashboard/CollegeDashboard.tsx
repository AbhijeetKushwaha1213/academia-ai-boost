
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Code, 
  Trophy, 
  BookOpen, 
  Target, 
  Plus,
  Github,
  ExternalLink,
  Clock,
  Star,
  Flame,
  TrendingUp
} from 'lucide-react';
import { AddProjectDialog } from '../projects/AddProjectDialog';
import { AddSkillDialog } from '../skills/AddSkillDialog';

export const CollegeDashboard = () => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Sample data - in real app this would come from API
  const projects = [
    {
      id: 1,
      title: "E-commerce Website",
      description: "Full-stack React & Node.js project",
      status: "in-progress",
      progress: 75,
      technologies: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "Mobile Weather App",
      description: "React Native app with weather API",
      status: "completed",
      progress: 100,
      technologies: ["React Native", "API Integration"]
    }
  ];

  const skills = [
    { name: "JavaScript", level: 85, category: "Programming" },
    { name: "React", level: 80, category: "Frontend" },
    { name: "Node.js", level: 70, category: "Backend" },
    { name: "Python", level: 60, category: "Programming" }
  ];

  const handleProjectAction = (projectId: number, action: string) => {
    console.log(`Project ${projectId} action: ${action}`);
    // Implement project actions here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">Welcome to your College Dashboard! 🎓</h1>
        <p className="text-blue-100">Track your projects, develop skills, and build your portfolio</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-800">12</p>
              <p className="text-sm text-green-600">Projects Completed</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center space-x-3">
            <Code className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">8</p>
              <p className="text-sm text-blue-600">Skills Mastered</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="flex items-center space-x-3">
            <Flame className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-orange-800">47</p>
              <p className="text-sm text-orange-600">Day Streak</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-800">2.4k</p>
              <p className="text-sm text-purple-600">XP Points</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Projects Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Active Projects</span>
            </h2>
            <Button 
              onClick={() => setShowAddProject(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    {project.status === 'in-progress' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleProjectAction(project.id, 'continue')}
                      >
                        Continue
                      </Button>
                    )}
                    {project.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleProjectAction(project.id, 'view')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Skill Development</span>
            </h2>
            <Button 
              onClick={() => setShowAddSkill(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <Badge variant="outline">{skill.category}</Badge>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Proficiency</span>
                  <span className="font-medium">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Today's Study Plan</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">React Advanced Concepts</h3>
                <p className="text-sm text-blue-700">Complete Context API tutorial</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <Github className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Portfolio Project</h3>
                <p className="text-sm text-green-700">Push latest changes to GitHub</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-900">Code Review</h3>
                <p className="text-sm text-orange-700">Review team project submissions</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Project Dialog */}
      <AddProjectDialog 
        open={showAddProject}
        onOpenChange={setShowAddProject}
      />

      {/* Add Skill Dialog */}
      <AddSkillDialog 
        open={showAddSkill}
        onOpenChange={setShowAddSkill}
      />
    </div>
  );
};
