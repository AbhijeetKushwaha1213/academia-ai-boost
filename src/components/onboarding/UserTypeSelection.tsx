
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users, Target, Code, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const UserTypeSelection = () => {
  const { updateUserType } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'exam' | 'college' | null>(null);
  const [examType, setExamType] = useState('');
  const [college, setCollege] = useState('');
  const [semester, setSemester] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedType) {
      toast({
        title: "Please select a path",
        description: "Choose between Competitive Exams or College Student.",
        variant: "destructive",
      });
      return;
    }

    if (selectedType === 'exam' && !examType) {
      toast({
        title: "Please specify exam type",
        description: "Enter the exam you're preparing for (e.g., JEE, NEET, UPSC).",
        variant: "destructive",
      });
      return;
    }

    if (selectedType === 'college' && !college) {
      toast({
        title: "Please enter your college",
        description: "Enter your college or university name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const details: any = {};
      
      if (selectedType === 'exam') {
        details.examType = examType;
      } else {
        details.college = college;
        if (semester) details.semester = parseInt(semester);
      }

      await updateUserType(selectedType, details);
    } catch (error) {
      console.error('Error updating user type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const examOptions = [
    'JEE (Joint Entrance Examination)',
    'NEET (Medical Entrance)',
    'UPSC (Civil Services)',
    'GATE (Graduate Aptitude Test)',
    'CAT (MBA Entrance)',
    'Bank PO/Clerk',
    'SSC (Staff Selection Commission)',
    'Railway Exams',
    'Other'
  ];

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
            className={`p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
              selectedType === 'exam' ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-300'
            }`}
            onClick={() => setSelectedType('exam')}
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
            className={`p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
              selectedType === 'college' ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-300'
            }`}
            onClick={() => setSelectedType('college')}
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

        {/* Additional Details Form */}
        {selectedType && (
          <Card className="mt-6 p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Tell us more</h3>
            
            {selectedType === 'exam' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="examType">Which exam are you preparing for?</Label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {examOptions.map((exam) => (
                        <SelectItem key={exam} value={exam}>
                          {exam}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedType === 'college' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="college">College/University Name</Label>
                  <Input
                    id="college"
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter your college name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Current Semester (Optional)</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button 
              onClick={handleNext}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? 'Setting up...' : 'Continue'}
            </Button>
          </Card>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't worry! You can change this later in settings
          </p>
        </div>
      </div>
    </div>
  );
};
