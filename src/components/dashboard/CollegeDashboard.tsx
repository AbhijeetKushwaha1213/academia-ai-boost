
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code, Calendar, Users, Trophy, BookOpen, Briefcase, Star, Zap, ArrowRight, Plus } from 'lucide-react';
import ProjectFocusView from '../projects/ProjectFocusView';
import { useToast } from '@/hooks/use-toast';
import { FeatureStatusCard } from '../common/FeatureStatusCard';

export const CollegeDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'project-focus'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();

  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'React Portfolio Website', 
      progress: 75, 
      type: 'coding', 
      deadline: '2 days',
      status: 'active',
      description: 'Building a personal portfolio with React and TypeScript'
    },
    { 
      id: 2, 
      name: 'Data Structures Assignment', 
      progress: 90, 
      type: 'academic', 
      deadline: '1 week',
      status: 'active',
      description: 'Implementation of trees and graphs in C++'
    },
    { 
      id: 3, 
      name: 'Freelance Logo Design', 
      progress: 40, 
      type: 'freelance', 
      deadline: '3 days',
      status: 'active',
      description: 'Logo design project for startup client'
    }
  ]);

  const [skills, setSkills] = useState([
    { id: 1, skill: 'React.js', progress: 65, category: 'Frontend' },
    { id: 2, skill: 'Node.js', progress: 40, category: 'Backend' },
    { id: 3, skill: 'UI/UX Design', progress: 80, category: 'Design' }
  ]);

  const handleContinueProject = (project: any) => {
    setSelectedProject(project);
    setCurrentView('project-focus');
    toast({
      title: "Project Opened",
      description: `Continuing work on ${project.name}`,
    });
  };

  const handleCompleteProject = (projectId: number) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, progress: 100, status: 'completed' }
        : project
    ));
    toast({
      title: "Project Completed! 🎉",
      description: "Great job! Your project has been marked as completed.",
    });
  };

  const handleContinueSkill = (skill: any) => {
    const skillProject = {
      id: `skill-${skill.id}`,
      name: `${skill.skill} Learning`,
      type: skill.category.toLowerCase(),
      deadline: 'ongoing',
      description: `Learning and practicing ${skill.skill}`,
      progress: skill.progress
    };
    setSelectedProject(skillProject);
    setCurrentView('project-focus');
    toast({
      title: "Skill Learning",
      description: `Continuing ${skill.skill} learning path`,
    });
  };

  const handleProgressSkill = (skillId: number) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { ...skill, progress: Math.min(skill.progress + 10, 100) }
        : skill
    ));
    toast({
      title: "Progress Updated! 📈",
      description: "Your skill progress has been updated.",
    });
  };

  const handleAddProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: 'New Project',
      progress: 0,
      type: 'coding',
      deadline: '1 week',
      status: 'active',
      description: 'New project description'
    };
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Project Added",
      description: "New project has been added to your dashboard.",
    });
  };

  const handleAddSkill = () => {
    const newSkill = {
      id: skills.length + 1,
      skill: 'New Skill',
      progress: 0,
      category: 'General'
    };
    setSkills(prev => [...prev, newSkill]);
    toast({
      title: "Skill Added",
      description: "New skill has been added to your learning path.",
    });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
  };

  if (currentView === 'project-focus' && selectedProject) {
    return (
      <ProjectFocusView
        projectName={selectedProject.name}
        projectType={selectedProject.type}
        deadline={selectedProject.deadline}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Hey there! 🚀</h2>
            <p className="text-purple-100">Semester 5 • Computer Science Engineering</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">8.4</div>
            <div className="text-purple-200 text-sm">Current CGPA</div>
          </div>
        </div>
      </Card>

      {/* Quick Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Code className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{skills.length}</div>
          <div className="text-sm text-gray-600">Skills Learning</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">₹12k</div>
          <div className="text-sm text-gray-600">This Month</div>
        </Card>
      </div>

      {/* Current Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Active Projects</h3>
          <Button variant="outline" size="sm" onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                project.type === 'coding' ? 'bg-blue-100' :
                project.type === 'academic' ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {project.type === 'coding' ? <Code className="w-5 h-5 text-blue-600" /> :
                 project.type === 'academic' ? <BookOpen className="w-5 h-5 text-green-600" /> :
                 <Briefcase className="w-5 h-5 text-purple-600" />}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Progress value={project.progress} className="w-20 h-2" />
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Due in {project.deadline}
                  </Badge>
                  {project.status === 'completed' && (
                    <Badge className="text-xs bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button 
                  onClick={() => handleContinueProject(project)}
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue Working
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                {project.progress < 100 && (
                  <Button 
                    onClick={() => handleCompleteProject(project.id)}
                    size="sm" 
                    variant="outline"
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Learning Progress</h3>
          <Button variant="outline" size="sm" onClick={handleAddSkill}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
        
        <div className="space-y-4">
          {skills.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{item.skill}</span>
                    <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                  </div>
                  <span className="text-sm font-medium">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
              <div className="flex space-x-2 ml-4">
                <Button 
                  onClick={() => handleContinueSkill(item)}
                  size="sm" 
                  variant="outline"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button 
                  onClick={() => handleProgressSkill(item.id)}
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                >
                  +10%
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements & Freelance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievement</h3>
          <div className="text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">Full Stack Explorer</h4>
            <p className="text-sm text-gray-600">Completed 10 coding projects!</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Freelance Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Clients</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projects Done</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rating</span>
              <span className="font-medium">4.8 ⭐</span>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Career Suggestion */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Career Tip</h4>
            <p className="text-gray-700">Your React skills are progressing well! Consider building a full-stack project with Node.js to showcase your abilities to potential employers.</p>
            <Button variant="outline" size="sm" className="mt-3 text-green-700 border-green-300">
              Explore Project Ideas
            </Button>
          </div>
        </div>
      </Card>

      {/* Feature Status Card */}
      <FeatureStatusCard />
    </div>
  );
};
