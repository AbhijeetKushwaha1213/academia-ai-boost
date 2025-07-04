
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Clock, 
  Star,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  name: string;
  age: string;
  learningMode: 'college' | 'exam' | '';
  subjects: string[];
  examType?: string;
  targetYear?: string;
  semester?: string;
  course?: string;
  college?: string;
  studyPreference: string[];
  motivation: string[];
  dailyHours: string;
  reviewModes: string[];
  email: string;
  studyReminder?: string;
}

const STEPS = [
  'Welcome & Identity',
  'Learning Mode & Context',
  'Academic Details',
  'Study Preferences',
  'Review & Schedule',
  'Complete Profile'
];

export const OnboardingFlow = () => {
  const { updateUserType } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: '',
    learningMode: '',
    subjects: [],
    studyPreference: [],
    motivation: [],
    dailyHours: '',
    reviewModes: [],
    email: ''
  });

  const subjects = [
    'Physics', 'Chemistry', 'Biology', 'Math', 'Programming', 
    'English/Language', 'Current Affairs', 'History', 'Geography', 'Economics'
  ];

  const examTypes = [
    'NEET', 'JEE', 'UPSC', 'GATE', 'CUET', 'Bank/SSC', 'CAT', 'Other'
  ];

  const studyPreferences = [
    'Solo sessions', 'Group learning', 'Guided/structured plan', 'Revision-heavy'
  ];

  const motivations = [
    'Achievements/Gamification', 'Progress tracking', 'AI assistant', 'Smart planning tools'
  ];

  const reviewModes = ['Flashcards', 'Mind Maps', 'Quizzes', 'Notes'];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleArrayToggle = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
        : [value]
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const userType = data.learningMode;
      const details: any = {
        name: data.name,
        subjects: data.subjects,
        studyPreference: data.studyPreference,
        motivation: data.motivation,
        dailyHours: data.dailyHours,
        reviewModes: data.reviewModes
      };

      if (userType === 'exam') {
        details.examType = data.examType;
        details.targetYear = data.targetYear;
      } else {
        details.college = data.college;
        details.course = data.course;
        details.semester = parseInt(data.semester || '1');
      }

      await updateUserType(userType as 'exam' | 'college', details);
      
      toast({
        title: "Welcome to StudyMate AI! 🎉",
        description: "Your personalized learning journey begins now!",
      });
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast({
        title: "Setup Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.name && data.age;
      case 1: return data.learningMode && data.subjects.length > 0;
      case 2: 
        if (data.learningMode === 'exam') {
          return data.examType && data.targetYear;
        } else {
          return data.semester && data.course;
        }
      case 3: return data.studyPreference.length > 0 && data.motivation.length > 0;
      case 4: return data.dailyHours && data.reviewModes.length > 0;
      case 5: return data.email;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to StudyMate AI!</h2>
              <p className="text-gray-600">Let's get to know you better to personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData({...data, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age">How old are you?</Label>
                <Select value={data.age} onValueChange={(value) => setData({...data, age: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="13-16">13-16 years</SelectItem>
                    <SelectItem value="17-20">17-20 years</SelectItem>
                    <SelectItem value="21-25">21-25 years</SelectItem>
                    <SelectItem value="26-30">26-30 years</SelectItem>
                    <SelectItem value="30+">30+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What describes your learning journey?</h2>
              <p className="text-gray-600">This helps us customize your dashboard and features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card 
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  data.learningMode === 'college' 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'hover:border-blue-300 bg-white hover:shadow-md'
                }`}
                onClick={() => setData({...data, learningMode: 'college'})}
              >
                <div className="text-center">
                  <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">College Student</h3>
                  <p className="text-sm text-gray-600">Building skills, managing coursework, working on projects</p>
                </div>
              </Card>

              <Card 
                className={`p-6 cursor-pointer transition-all duration-200 ${
                  data.learningMode === 'exam' 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'hover:border-green-300 bg-white hover:shadow-md'
                }`}
                onClick={() => setData({...data, learningMode: 'exam'})}
              >
                <div className="text-center">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Exam Preparation</h3>
                  <p className="text-sm text-gray-600">Focused preparation for competitive exams</p>
                </div>
              </Card>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Which subjects are you most focused on?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant={data.subjects.includes(subject) ? "default" : "outline"}
                    className={`cursor-pointer p-2 text-center justify-center transition-all ${
                      data.subjects.includes(subject) 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your academic details</h2>
              <p className="text-gray-600">This helps us create the perfect study plan for you</p>
            </div>

            {data.learningMode === 'exam' ? (
              <div className="space-y-4">
                <div>
                  <Label>Which exam are you preparing for?</Label>
                  <Select value={data.examType} onValueChange={(value) => setData({...data, examType: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your target exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((exam) => (
                        <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>What is your target year?</Label>
                  <Select value={data.targetYear} onValueChange={(value) => setData({...data, targetYear: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select target year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Which semester are you currently in?</Label>
                  <Select value={data.semester} onValueChange={(value) => setData({...data, semester: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>What is your course/branch?</Label>
                  <Input
                    value={data.course || ''}
                    onChange={(e) => setData({...data, course: e.target.value})}
                    placeholder="e.g., BTech (CS), BSc (Biology)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Which college are you from? (optional)</Label>
                  <Input
                    value={data.college || ''}
                    onChange={(e) => setData({...data, college: e.target.value})}
                    placeholder="Enter your college name"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you prefer to study?</h2>
              <p className="text-gray-600">Let's customize your learning experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Study Preference (select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {studyPreferences.map((pref) => (
                    <Badge
                      key={pref}
                      variant={data.studyPreference.includes(pref) ? "default" : "outline"}
                      className={`cursor-pointer p-3 text-center justify-center transition-all ${
                        data.studyPreference.includes(pref) 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'hover:bg-purple-50'
                      }`}
                      onClick={() => handleArrayToggle('studyPreference', pref)}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">What motivates you to study?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {motivations.map((motivation) => (
                    <Badge
                      key={motivation}
                      variant={data.motivation.includes(motivation) ? "default" : "outline"}
                      className={`cursor-pointer p-3 text-center justify-center transition-all ${
                        data.motivation.includes(motivation) 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'hover:bg-green-50'
                      }`}
                      onClick={() => handleArrayToggle('motivation', motivation)}
                    >
                      {motivation}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan your study schedule</h2>
              <p className="text-gray-600">Help us create the perfect study routine for you</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>How many hours do you plan to study daily?</Label>
                <Select value={data.dailyHours} onValueChange={(value) => setData({...data, dailyHours: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select daily study hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1">Less than 1 hour</SelectItem>
                    <SelectItem value="1-2">1-2 hours</SelectItem>
                    <SelectItem value="3-5">3-5 hours</SelectItem>
                    <SelectItem value="5+">5+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Preferred review methods (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {reviewModes.map((mode) => (
                    <Badge
                      key={mode}
                      variant={data.reviewModes.includes(mode) ? "default" : "outline"}
                      className={`cursor-pointer p-3 text-center justify-center transition-all ${
                        data.reviewModes.includes(mode) 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'hover:bg-orange-50'
                      }`}
                      onClick={() => handleArrayToggle('reviewModes', mode)}
                    >
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete your profile</h2>
              <p className="text-gray-600">Just a few more details to get started</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="reminder">Daily Study Reminder (optional)</Label>
                <Input
                  id="reminder"
                  type="time"
                  value={data.studyReminder || ''}
                  onChange={(e) => setData({...data, studyReminder: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Your Profile Summary:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Mode:</strong> {data.learningMode === 'college' ? 'College Student' : 'Exam Preparation'}</p>
                <p><strong>Subjects:</strong> {data.subjects.join(', ')}</p>
                <p><strong>Daily Study:</strong> {data.dailyHours} hours</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">{STEPS[currentStep]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center"
              >
                {isLoading ? 'Creating your profile...' : 'Complete Setup'}
                <Star className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex items-center"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
