
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code, Calendar, Users, Trophy, BookOpen, Briefcase, Star, Zap, ArrowRight, Plus } from 'lucide-react';
import ProjectFocusView from '../projects/ProjectFocusView';
import { AddProjectDialog } from '../projects/AddProjectDialog';
import { AddSkillDialog } from '../skills/AddSkillDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../auth/AuthProvider';
import { useProjects } from '@/hooks/useProjects';
import { useSkills } from '@/hooks/useSkills';
import { useUserStats } from '@/hooks/useUserStats';


export const CollegeDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'project-focus'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { projects, updateProject } = useProjects();
  const { skills, updateSkill } = useSkills();
  const { userStats } = useUserStats();

  const handleContinueProject = (project: any) => {
    setSelectedProject(project);
    setCurrentView('project-focus');
    toast({
      title: "Project Opened",
      description: `Continuing work on ${project.name}`,
    });
  };

  const handleCompleteProject = (projectId: string) => {
    updateProject({ id: projectId, updates: { progress: 100, status: 'completed' } });
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

  const handleProgressSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      const newProgress = Math.min(skill.progress + 10, 100);
      updateSkill({ id: skillId, updates: { progress: newProgress } });
      toast({
        title: "Progress Updated! 📈",
        description: "Your skill progress has been updated.",
      });
    }
  };

  const handleAddProject = () => {
    // Projects are now added via the AddProjectDialog
    toast({
      title: "Add Project",
      description: "Use the Add Project button to create a new project.",
    });
  };

  const handleAddSkill = () => {
    // Skills are now added via the AddSkillDialog
    toast({
      title: "Add Skill",
      description: "Use the Add Skill button to add a new skill.",
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
              <h2 className="text-2xl font-bold mb-2">Hey there, {user?.name || 'Student'}! 🚀</h2>
              <p className="text-purple-100">{user?.semester ? `Semester ${user.semester}` : 'College'} • {user?.branch || 'Computer Science'}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userStats?.cgpa?.toFixed(1) || '0.0'}</div>
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
          <div className="text-2xl font-bold text-foreground">{projects.length}</div>
          <div className="text-sm text-muted-foreground">Active Projects</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Code className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">{skills.length}</div>
          <div className="text-sm text-muted-foreground">Skills Learning</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-foreground">₹{userStats?.monthly_earnings || 0}</div>
          <div className="text-sm text-muted-foreground">This Month</div>
        </Card>
      </div>

      {/* Current Projects */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Active Projects</h3>
          <AddProjectDialog />
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Projects Added</h4>
            <p className="text-muted-foreground mb-4">Start by adding your first project to track your progress</p>
            <AddProjectDialog trigger={
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            } />
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center p-4 bg-muted rounded-lg">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                  project.type === 'coding' ? 'bg-blue-100' :
                  project.type === 'academic' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {project.type === 'coding' ? <Code className="w-5 h-5 text-blue-600" /> :
                   project.type === 'academic' ? <BookOpen className="w-5 h-5 text-green-600" /> :
                   <Briefcase className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{project.name}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Progress value={project.progress} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    {project.deadline && (
                      <Badge variant="outline" className="text-xs">
                        Due in {project.deadline}
                      </Badge>
                    )}
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
        )}
      </Card>

      {/* Skills Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Learning Progress</h3>
          <AddSkillDialog />
        </div>
        
        {skills.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Skills Added</h4>
            <p className="text-muted-foreground mb-4">Start by adding your first skill to track your learning progress</p>
            <AddSkillDialog trigger={
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Skill
              </Button>
            } />
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{item.skill}</span>
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
        )}
      </Card>

      {/* Achievements & Freelance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Remove hardcoded achievement */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Achievement</h3>
        <div className="text-center py-4">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-semibold text-muted-foreground mb-1">No achievements yet</h4>
          <p className="text-sm text-muted-foreground">Complete projects to unlock achievements!</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Freelance Status</h3>
        {userStats ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Clients</span>
              <span className="font-medium">{userStats?.active_clients || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projects Done</span>
              <span className="font-medium">{userStats?.projects_completed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <span className="font-medium">{userStats?.rating?.toFixed(1) || '0.0'} ⭐</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No freelance data yet</p>
          </div>
        )}
      </Card>
      </div>

      {/* Remove hardcoded career tip */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-2">Career Tip</h4>
            <p className="text-muted-foreground">
              {projects.length === 0 
                ? "Start building projects to showcase your skills and advance your career!"
                : skills.length === 0
                ? "Add skills to track your learning progress and identify areas for improvement."
                : "Keep building projects and learning new skills to stay competitive in the job market!"
              }
            </p>
            <Button variant="outline" size="sm" className="mt-3 text-green-700 border-green-300">
              {projects.length === 0 ? "Add Your First Project" : "Explore More Ideas"}
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
};
