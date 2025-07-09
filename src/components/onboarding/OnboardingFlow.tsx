
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingData } from '../../types/user';
import { useToast } from '@/hooks/use-toast';

const OnboardingFlow: React.FC = () => {
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    full_name: '',
    mode: 'college'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        onboarding_completed: true
      });
      
      toast({
        title: "Welcome to StudyMate! 🎉",
        description: "Your profile has been set up successfully.",
      });
      
      // Let the auth context handle the redirect
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StudyMate! 🎓</h1>
          <p className="text-gray-600">Let's personalize your learning experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your full name?
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => updateFormData({ full_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!formData.full_name.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Mode Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What best describes you?
              </label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.mode === 'college' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="mode"
                    value="college"
                    checked={formData.mode === 'college'}
                    onChange={(e) => updateFormData({ mode: e.target.value as 'college' | 'exam_preparation' })}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">🎓 College Student</div>
                    <div className="text-sm text-gray-500">I'm currently studying in college</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.mode === 'exam_preparation' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="mode"
                    value="exam_preparation"
                    checked={formData.mode === 'exam_preparation'}
                    onChange={(e) => updateFormData({ mode: e.target.value as 'college' | 'exam_preparation' })}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">📚 Exam Preparation</div>
                    <div className="text-sm text-gray-500">I'm preparing for competitive exams</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Specific Details */}
        {step === 3 && (
          <div className="space-y-6">
            {formData.mode === 'college' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which semester are you in?
                  </label>
                  <select
                    value={formData.semester || ''}
                    onChange={(e) => updateFormData({ semester: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your semester</option>
                    {Array.from({ length: 8 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Semester {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your college name?
                  </label>
                  <input
                    type="text"
                    value={formData.college_name || ''}
                    onChange={(e) => updateFormData({ college_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your college/university name"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which exam are you preparing for?
                  </label>
                  <input
                    type="text"
                    value={formData.target_exam || ''}
                    onChange={(e) => updateFormData({ target_exam: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., JEE, NEET, UPSC, CAT, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When do you plan to attempt the exam?
                  </label>
                  <select
                    value={formData.attempt_year || ''}
                    onChange={(e) => updateFormData({ attempt_year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup ✨
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
