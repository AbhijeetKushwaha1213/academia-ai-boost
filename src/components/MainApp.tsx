
import React, { useState } from 'react';
import { useAuth } from './auth/AuthProvider';
import { SignInPage } from './auth/SignInPage';
import { UserTypeSelection } from './onboarding/UserTypeSelection';
import { ExamDashboard } from './dashboard/ExamDashboard';
import { CollegeDashboard } from './dashboard/CollegeDashboard';
import { FlashcardVault } from './flashcards/FlashcardVault';
import { AIChat } from './chat/AIChat';
import { AIFlashcardGenerator } from './ai/AIFlashcardGenerator';
import { StudyCalendar } from './calendar/StudyCalendar';
import { ProgressChart } from './calendar/ProgressChart';
import { MobileNavigation } from './layout/MobileNavigation';
import { Button } from '@/components/ui/button';

export const MainApp = () => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        return <AIChat />;
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
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
          <div className="flex items-center space-x-2">
            <div className="text-right text-xs text-gray-500">
              <p>Level {user.current_level}</p>
              <p>{user.experience_points} XP</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </Button>
          </div>
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
