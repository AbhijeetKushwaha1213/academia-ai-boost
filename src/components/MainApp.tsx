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
import { DesktopSidebar } from './layout/DesktopSidebar';
import { QuickActions } from './common/QuickActions';
import { NotificationCenter } from './notifications/NotificationCenter';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/hooks/use-toast';
import { WifiOff, Wifi, Menu, X } from 'lucide-react';

export const MainApp = () => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOnline } = useOfflineSupport();
  const { measureComponentRender } = usePerformanceMonitor();
  const { toast } = useToast();

  console.log('MainApp render - Auth state:', { isAuthenticated, isLoading, user: user?.id });

  // Add keyboard shortcuts
  useKeyboardShortcuts({
    onNavigate: setActiveTab,
    onQuickAction: (action) => {
      switch (action) {
        case 'create-flashcard':
          setActiveTab('flashcards');
          break;
        case 'search':
          // Focus search if available
          break;
      }
    }
  });

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
        {/* Desktop Sidebar */}
        <DesktopSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSignOut={handleSignOut}
        />

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="h-full">
                <DesktopSidebar 
                  activeTab={activeTab} 
                  onTabChange={(tab) => {
                    setActiveTab(tab);
                    setSidebarOpen(false);
                  }}
                  onSignOut={handleSignOut}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="lg:pl-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">S</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900 text-sm">StudyMate AI</h1>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!isOnline && <WifiOff className="w-4 h-4 text-red-500" />}
                {isOnline && <Wifi className="w-4 h-4 text-green-500" />}
                
                <NotificationCenter onNavigate={setActiveTab} />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('profile')}
                  className="p-0 h-auto"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {getInitials(user.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {!isOnline && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <WifiOff className="w-4 h-4" />
                      <span>Offline</span>
                    </div>
                  )}
                  {isOnline && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm">
                      <Wifi className="w-4 h-4" />
                      <span>Online</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationCenter onNavigate={setActiveTab} />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6 pb-20 lg:pb-6">
            <ErrorBoundary>
              {/* Quick Actions for Home Tab */}
              {activeTab === 'home' && (
                <div className="mb-6">
                  <QuickActions onNavigate={setActiveTab} />
                </div>
              )}
              
              {renderContent()}
            </ErrorBoundary>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </ErrorBoundary>
  );
};
