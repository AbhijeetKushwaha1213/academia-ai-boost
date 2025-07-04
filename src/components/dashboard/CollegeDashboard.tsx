
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code, Calendar, Users, Trophy, BookOpen, Briefcase, Star, Zap, ArrowRight } from 'lucide-react';
import ProjectFocusView from '../projects/ProjectFocusView';

export const CollegeDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'project-focus'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const currentProjects = [
    { name: 'React Portfolio Website', progress: 75, type: 'coding', deadline: '2 days' },
    { name: 'Data Structures Assignment', progress: 90, type: 'academic', deadline: '1 week' },
    { name: 'Freelance Logo Design', progress: 40, type: 'freelance', deadline: '3 days' }
  ];

  const skillsLearning = [
    { skill: 'React.js', progress: 65, category: 'Frontend' },
    { skill: 'Node.js', progress: 40, category: 'Backend' },
    { skill: 'UI/UX Design', progress: 80, category: 'Design' }
  ];

  const handleContinueProject = (project: any) => {
    setSelectedProject(project);
    setCurrentView('project-focus');
  };

  const handleContinueSkill = (skill: any) => {
    const skillProject = {
      name: `${skill.skill} Learning`,
      type: skill.category.toLowerCase(),
      deadline: 'ongoing'
    };
    setSelectedProject(skillProject);
    setCurrentView('project-focus');
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
            <h2 className="text-2xl font-bold mb-2">Hey Abhijeet! 🚀</h2>
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
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Code className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">5</div>
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
          <Button variant="outline" size="sm">
            Add Project
          </Button>
        </div>

        <div className="space-y-4">
          {currentProjects.map((project, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
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
                </div>
              </div>
              <Button 
                onClick={() => handleContinueProject(project)}
                size="sm" 
                className="ml-4 bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Working
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Progress</h3>
        
        <div className="space-y-4">
          {skillsLearning.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              <Button 
                onClick={() => handleContinueSkill(item)}
                size="sm" 
                variant="outline"
                className="ml-4"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          <Star className="w-4 h-4 mr-2" />
          Add New Skill
        </Button>
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
    </div>
  );
};
