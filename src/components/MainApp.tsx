
import React, { useState } from 'react';
import { useAuth } from './auth/AuthProvider';
import { SignInPage } from './auth/SignInPage';
import { UserTypeSelection } from './onboarding/UserTypeSelection';
import { ExamDashboard } from './dashboard/ExamDashboard';
import { CollegeDashboard } from './dashboard/CollegeDashboard';
import { FlashcardVault } from './flashcards/FlashcardVault';
import { AIAssistant } from './AIAssistant';
import { MobileNavigation } from './layout/MobileNavigation';

export const MainApp = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Not authenticated - show sign in
  if (!isAuthenticated) {
    return <SignInPage />;
  }

  // Authenticated but no user type selected
  if (!user?.userType) {
    return <UserTypeSelection />;
  }

  // Main app content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return user.userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
      case 'flashcards':
        return <FlashcardVault />;
      case 'ai-chat':
        return <AIAssistant />;
      case 'calendar':
        return <div className="p-6 text-center text-gray-500">Progress Calendar Coming Soon</div>;
      case 'achievements':
        return <div className="p-6 text-center text-gray-500">Achievements Coming Soon</div>;
      case 'settings':
        return <div className="p-6 text-center text-gray-500">Settings Coming Soon</div>;
      default:
        return user.userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">StudyMate AI</h1>
              <p className="text-xs text-gray-500">
                {user.userType === 'exam' ? 'Exam Preparation' : 'College Life'}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
