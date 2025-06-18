
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Target, Code, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const UserTypeSelection = () => {
  const { updateUserType } = useAuth();

  const handleExamPrep = () => {
    updateUserType('exam', {});
  };

  const handleCollegeStudent = () => {
    updateUserType('college', {});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
          <p className="text-gray-600">Let's personalize your study experience</p>
        </div>

        <div className="space-y-4">
          {/* Exam Preparation Card */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-indigo-300"
            onClick={handleExamPrep}
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Exams</h3>
                <p className="text-gray-600 mb-3">Preparing for JEE, NEET, UPSC, GATE, CAT, or other competitive exams</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Daily Plans</Badge>
                  <Badge variant="secondary" className="text-xs">Revision Tracker</Badge>
                  <Badge variant="secondary" className="text-xs">Mock Tests</Badge>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>Structured study roadmaps</span>
                </div>
              </div>
            </div>
          </Card>

          {/* College Student Card */}
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 hover:border-purple-300"
            onClick={handleCollegeStudent}
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">College Student</h3>
                <p className="text-gray-600 mb-3">Managing academics, learning skills, building projects, and planning career</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Skill Building</Badge>
                  <Badge variant="secondary" className="text-xs">Project Tracker</Badge>
                  <Badge variant="secondary" className="text-xs">Resume Builder</Badge>
                </div>

                <div className="mt-4 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Code className="w-4 h-4 mr-1" />
                    <span>Learning coding & freelancing</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Semester planning & assignments</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't worry! You can change this later in settings
          </p>
        </div>
      </div>
    </div>
  );
};
