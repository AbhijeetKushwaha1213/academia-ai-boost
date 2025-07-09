
import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { SignInPage } from './auth/SignInPage';
import OnboardingFlow from './onboarding/OnboardingFlow';
import { ErrorBoundary } from './ErrorBoundary';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hero } from './Hero';
import { Features } from './Features';
import { Dashboard } from './Dashboard';
import { StudyProgress } from './StudyProgress';
import { AIAssistant } from './AIAssistant';

export const MainApp = () => {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const { isOnline } = useOfflineSupport();
  const { measureComponentRender } = usePerformanceMonitor();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('MainApp render - Auth state:', { 
    isAuthenticated, 
    isLoading, 
    user: user?.id, 
    userType: user?.user_type,
    activeTab 
  });

  // Redirect to landing page if user comes to root and is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname === '/') {
      navigate('/landing');
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  // Add keyboard shortcuts
  useKeyboardShortcuts({
    onNavigate: (tab: string) => {
      console.log('MainApp: Keyboard shortcut navigation to:', tab);
      setActiveTab(tab);
    },
    onQuickAction: (action) => {
      console.log('MainApp: Keyboard shortcut quick action:', action);
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

    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', darkMode);

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

  // Authenticated but no user type selected - show onboarding flow
  if (!user?.user_type) {
    console.log('MainApp: User authenticated but no user_type, showing OnboardingFlow');
    return (
      <ErrorBoundary>
        <OnboardingFlow />
       </ErrorBoundary>
    );
  }

  console.log('MainApp: Rendering main app with user authenticated');

  const handleSignOut = async () => {
    try {
      console.log('MainApp: Signing out user');
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/landing');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show the original dashboard design
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">StudyMate AI</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Welcome, {user?.name || user?.email}
                </div>
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                {!isOnline && (
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Offline
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content - Original Dashboard Design */}
        <Hero />
        <Features />
        <Dashboard />
        <StudyProgress />
        <AIAssistant />
      </div>
    </ErrorBoundary>
  );
};
