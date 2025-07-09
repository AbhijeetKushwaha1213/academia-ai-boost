
import React, { useState, useEffect } from 'react';
import { useAuth } from './auth/AuthProvider';
import { SignInPage } from './auth/SignInPage';
import { OnboardingFlow } from './onboarding/OnboardingFlow';
import { AppLayout } from './layout/AppLayout';
import { ErrorBoundary } from './ErrorBoundary';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

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
    userType: user?.userType,
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

  // Authenticated but no user type selected OR missing required onboarding data - show onboarding flow
  if (!user?.userType || !user?.name || (user.userType === 'exam' && !user.examType) || (user.userType === 'college' && !user.college)) {
    console.log('MainApp: User needs onboarding, showing OnboardingFlow. User data:', {
      userType: user?.userType,
      name: user?.name,
      examType: user?.examType,
      college: user?.college
    });
    return (
      <ErrorBoundary>
        <OnboardingFlow />
       </ErrorBoundary>
    );
  }

  console.log('MainApp: Rendering main app with activeTab:', activeTab);

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

  const handleTabChange = (tab: string) => {
    console.log('MainApp: Tab change requested:', tab);
    setActiveTab(tab);
  };

  return (
    <ErrorBoundary>
      <AppLayout 
        user={user}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        handleSignOut={handleSignOut}
        isOnline={isOnline}
      />
    </ErrorBoundary>
  );
};
