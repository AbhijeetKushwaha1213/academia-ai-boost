
import React, { useState } from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavigation } from './MobileNavigation';
import { AppHeader } from './AppHeader';
import { ContentRenderer } from './ContentRenderer';
import { QuickActions } from '../common/QuickActions';
import { ErrorBoundary } from '../ErrorBoundary';
import { Button } from '@/components/ui/button';
import { X, Menu, Maximize, Minimize, EyeOff } from 'lucide-react';

interface AppLayoutProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
  isOnline: boolean;
}

export const AppLayout = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  handleSignOut, 
  isOnline 
}: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  console.log('AppLayout render - activeTab:', activeTab, 'user:', user?.id);

  const handleTabChange = (tab: string) => {
    console.log('AppLayout: Tab change to:', tab);
    setActiveTab(tab);
    // Close mobile menu when navigating
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarVisibility = () => {
    setSidebarHidden(!sidebarHidden);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleFullScreen = () => {
    setFullScreenMode(!fullScreenMode);
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar - Collapsible and Hideable */}
      <div className={`hidden lg:flex transition-all duration-300 ease-in-out ${
        fullScreenMode || sidebarHidden ? 'w-0' : sidebarOpen ? 'w-64' : 'w-0'
      }`}>
        <div className={`w-64 transition-transform duration-300 ease-in-out ${
          sidebarOpen && !sidebarHidden ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <DesktopSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-background shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="h-full overflow-y-auto">
              <DesktopSidebar 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                onSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header with controls */}
        <div className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle - Desktop */}
            {!fullScreenMode && !sidebarHidden && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="hidden lg:flex"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <h1 className="text-xl font-semibold text-foreground">
              {activeTab === 'home' ? 'Dashboard' :
               activeTab === 'flashcards' ? 'Flashcards' :
               activeTab === 'ai' ? 'AI Chat' :
               activeTab === 'achievements' ? 'Achievements' :
               activeTab === 'resources' ? 'Resources' :
               activeTab === 'generate' ? 'AI Generator' :
               activeTab === 'settings' ? 'Settings' :
               'StudyMate AI'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Hide Sidebar Toggle */}
            {!fullScreenMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebarVisibility}
                className="hidden lg:flex"
                title={sidebarHidden ? 'Show Sidebar' : 'Hide Sidebar'}
              >
                <EyeOff className="w-5 h-5" />
              </Button>
            )}

            {/* Full Screen Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullScreen}
              className="hidden sm:flex"
              title={fullScreenMode ? 'Exit Full Screen' : 'Enter Full Screen'}
            >
              {fullScreenMode ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>

            {/* Online Status */}
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 pb-20 lg:pb-6">
            <ErrorBoundary>
              <ContentRenderer activeTab={activeTab} onNavigate={handleTabChange} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hide in full screen */}
      {!fullScreenMode && (
        <MobileNavigation 
          user={user}
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          handleSignOut={handleSignOut}
          isOnline={isOnline}
        />
      )}
    </div>
  );
};
