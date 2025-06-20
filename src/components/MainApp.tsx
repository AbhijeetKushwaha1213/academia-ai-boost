
import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { SignInPage } from './auth/SignInPage';
import { UserTypeSelection } from './onboarding/UserTypeSelection';
import { ExamDashboard } from './dashboard/ExamDashboard';
import { CollegeDashboard } from './dashboard/CollegeDashboard';
import { FlashcardVault } from './flashcards/FlashcardVault';
import { AIChat } from './chat/AIChat';
import { AIFlashcardGenerator } from './ai/AIFlashcardGenerator';
import { StudyCalendar } from './calendar/StudyCalendar';
import { StudyProgress } from './StudyProgress';
import { SettingsPage } from './settings/SettingsPage';
import { ProfilePage } from './profile/ProfilePage';
import { AchievementsPage } from './achievements/AchievementsPage';
import { MobileNavigation } from './layout/MobileNavigation';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useToast } from '@/hooks/use-toast';
import { WifiOff, Wifi, User } from 'lucide-react';

export const MainApp = () => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const { isOnline } = useOfflineSupport();
  const { measureComponentRender } = usePerformanceMonitor();
  const { toast } = useToast();

  console.log('MainApp render - Auth state:', { isAuthenticated, isLoading, user: user?.id });

  useEffect(() => {
    const startTime = performance.now();
    
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    return () => {
      measureComponentRender('MainApp', startTime);
    };
  }, [measureComponentRender]);

  useEffect(() => {
    // Show offline/online status
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Some features may be limited. We'll sync when you're back online.",
        variant: "default",
      });
    }
  }, [isOnline, toast]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('MainApp: Showing loading state');
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
    console.log('MainApp: User not authenticated, showing SignInPage');
    return (
      <ErrorBoundary>
        <SignInPage />
      </ErrorBoundary>
    );
  }

  // Authenticated but no user type selected
  if (!user?.userType) {
    console.log('MainApp: User authenticated but no userType, showing UserTypeSelection');
    return (
      <ErrorBoundary>
        <UserTypeSelection />
      </ErrorBoundary>
    );
  }

  console.log('MainApp: Rendering main app with activeTab:', activeTab);

  // Main app content based on active tab
  const renderContent = () => {
    console.log('MainApp: Rendering content for tab:', activeTab);
    switch (activeTab) {
      case 'home':
        return user.userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
      case 'flashcards':
        return <FlashcardVault />;
      case 'ai-chat':
        return <AIChat />;
      case 'ai-generator':
        return <AIFlashcardGenerator />;
      case 'calendar':
        return <StudyCalendar />;
      case 'progress':
        return <StudyProgress />;
      case 'achievements':
        return <AchievementsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return user.userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('MainApp: Signing out user');
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-bold text-gray-900">StudyMate AI</h1>
                  {!isOnline && (
                    <div>
                      <WifiOff className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  {isOnline && (
                    <div>
                      <Wifi className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {user.userType === 'exam' ? 'Exam Preparation' : 'College Life'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right text-xs text-gray-500 hidden md:block">
                <p>Level {user.current_level || 1}</p>
                <p>{user.experience_points || 0} XP</p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('profile')}
                className="p-0 h-auto"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {getInitials(user.name || 'U')}
                  </AvatarFallback>
                </Avatar>
              </Button>
              
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
        <div className="px-4 py-6 pb-20">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </div>

        {/* Bottom Navigation */}
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
};
