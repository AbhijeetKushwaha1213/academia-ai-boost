
import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Target, BookOpen, Calendar, User, CheckCircle } from 'lucide-react';

const OnboardingFlow = () => {
  const { user, updateUserType } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mode: '' as 'college' | 'exam_preparation',
    // College fields
    college: '',
    course: '',
    semester: '',
    // Exam fields
    examType: '',
    targetYear: '',
    examDate: '',
    // Additional fields
    subjects: [] as string[],
    studyPreference: '',
    motivation: '',
    dailyHours: '',
    reviewModes: [] as string[]
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter((item: string) => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const completeOnboarding = async () => {
    if (!formData.mode) {
      toast({
        title: "Selection Required",
        description: "Please select your study mode to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updateUserType(formData.mode === 'college' ? 'college' : 'exam', {
        name: formData.name,
        college: formData.college,
        course: formData.course,
        semester: parseInt(formData.semester),
        examType: formData.examType,
        targetYear: formData.targetYear,
        examDate: formData.examDate,
        subjects: formData.subjects,
        studyPreference: formData.studyPreference,
        motivation: formData.motivation,
        dailyHours: formData.dailyHours,
        reviewModes: formData.reviewModes
      });

      toast({
        title: "Welcome to StudyMate AI! 🎉",
        description: "Your profile has been set up successfully.",
      });
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: "Setup Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <User className="w-6 h-6" />
                Welcome to StudyMate AI!
              </CardTitle>
              <CardDescription>
                Let's personalize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>What's your primary goal?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.mode === 'college' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleInputChange('mode', 'college')}
                  >
                    <CardContent className="p-6 text-center">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <h3 className="font-semibold text-lg mb-2">College Student</h3>
                      <p className="text-sm text-gray-600">
                        I'm currently studying in college and need help with coursework
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.mode === 'exam_preparation' ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`}
                    onClick={() => handleInputChange('mode', 'exam_preparation')}
                  >
                    <CardContent className="p-6 text-center">
                      <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
                      <h3 className="font-semibold text-lg mb-2">Exam Preparation</h3>
                      <p className="text-sm text-gray-600">
                        I'm preparing for competitive exams like JEE, NEET, CAT, etc.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between">
                <div></div>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.mode || !formData.name.trim()}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                {formData.mode === 'college' ? <GraduationCap className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                {formData.mode === 'college' ? 'College Details' : 'Exam Details'}
              </CardTitle>
              <CardDescription>
                Tell us more about your {formData.mode === 'college' ? 'academic' : 'exam'} details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.mode === 'college' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="college">College/University Name</Label>
                    <Input
                      id="college"
                      placeholder="Enter your college name"
                      value={formData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="course">Course/Branch</Label>
                    <Select value={formData.course} onValueChange={(value) => handleInputChange('course', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="information-technology">Information Technology</SelectItem>
                        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                        <SelectItem value="electrical">Electrical Engineering</SelectItem>
                        <SelectItem value="civil">Civil Engineering</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Current Semester</Label>
                    <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="examType">Target Exam</Label>
                    <Select value={formData.examType} onValueChange={(value) => handleInputChange('examType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your target exam" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JEE">JEE (Joint Entrance Examination)</SelectItem>
                        <SelectItem value="NEET">NEET (Medical)</SelectItem>
                        <SelectItem value="CAT">CAT (Management)</SelectItem>
                        <SelectItem value="GATE">GATE (Engineering)</SelectItem>
                        <SelectItem value="UPSC">UPSC (Civil Services)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetYear">Target Year</Label>
                    <Select value={formData.targetYear} onValueChange={(value) => handleInputChange('targetYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="When do you plan to take the exam?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examDate">Exam Date (if known)</Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={formData.examDate}
                      onChange={(e) => handleInputChange('examDate', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6" />
                Study Preferences
              </CardTitle>
              <CardDescription>
                Help us customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Subjects of Interest</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Programming', 'History', 'Geography'].map(subject => (
                    <Badge
                      key={subject}
                      variant={formData.subjects.includes(subject) ? "default" : "outline"}
                      className="cursor-pointer p-2 justify-center"
                      onClick={() => handleMultiSelect('subjects', subject)}
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyPreference">Preferred Study Style</Label>
                <Select value={formData.studyPreference} onValueChange={(value) => handleInputChange('studyPreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How do you prefer to study?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual (diagrams, charts, videos)</SelectItem>
                    <SelectItem value="auditory">Auditory (lectures, discussions)</SelectItem>
                    <SelectItem value="reading">Reading & Writing</SelectItem>
                    <SelectItem value="kinesthetic">Hands-on Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyHours">Daily Study Hours Target</Label>
                <Select value={formData.dailyHours} onValueChange={(value) => handleInputChange('dailyHours', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How many hours per day?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 hours</SelectItem>
                    <SelectItem value="2-4">2-4 hours</SelectItem>
                    <SelectItem value="4-6">4-6 hours</SelectItem>
                    <SelectItem value="6+">6+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={completeOnboarding}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Setting up...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Setup
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber === step 
                    ? 'bg-blue-600 text-white' 
                    : stepNumber < step 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    stepNumber < step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
