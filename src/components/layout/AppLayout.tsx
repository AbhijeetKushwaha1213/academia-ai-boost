
import React, { useState } from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavigation } from './MobileNavigation';
import { AppHeader } from './AppHeader';
import { ContentRenderer } from './ContentRenderer';
import { QuickActions } from '../common/QuickActions';
import { ErrorBoundary } from '../ErrorBoundary';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('AppLayout render - activeTab:', activeTab, 'user:', user?.id);

  const handleTabChange = (tab: string) => {
    console.log('AppLayout: Tab change to:', tab);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
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
                  console.log('AppLayout: Mobile sidebar tab change to:', tab);
                  handleTabChange(tab);
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
        <AppHeader 
          user={user}
          isOnline={isOnline}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onNavigate={handleTabChange}
        />

        {/* Page Content */}
        <div className="p-4 lg:p-6 pb-20 lg:pb-6">
          <ErrorBoundary>
            {/* Quick Actions for Home Tab */}
            {activeTab === 'home' && (
              <div className="mb-6">
                <QuickActions onNavigate={handleTabChange} />
              </div>
            )}
            
            <ContentRenderer activeTab={activeTab} userType={user?.userType || 'exam'} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};
