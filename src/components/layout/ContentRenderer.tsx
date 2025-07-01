import React from 'react';
import { CollegeDashboard } from '../dashboard/CollegeDashboard';
import { ExamDashboard } from '../dashboard/ExamDashboard';
import { FlashcardVault } from '../flashcards/FlashcardVault';
import { AIChat } from '../chat/AIChat';
import { AIStudyMaterialGenerator } from '../ai/AIStudyMaterialGenerator';
import { StudyCalendar } from '../calendar/StudyCalendar';
import { ProfilePage } from '../profile/ProfilePage';
import { SettingsPage } from '../settings/SettingsPage';
import { AchievementsPage } from '../achievements/AchievementsPage';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { DiscoverResources } from '../discover/DiscoverResources';
import { useAuth } from '../auth/AuthProvider';

import { ResourceSpace } from '../resources/ResourceSpace';
import { MultiLevelPlanner } from '../planner/MultiLevelPlanner';

interface ContentRendererProps {
  activeTab: string;
  onNavigate?: (tab: string) => void;
}

export const ContentRenderer = ({ activeTab, onNavigate }: ContentRendererProps) => {
  const { user } = useAuth();

  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const renderContent = () => {
    console.log('ContentRenderer: Rendering activeTab:', activeTab);
    
    switch (activeTab) {
      case 'home':
        return user?.userType === 'college' ? <CollegeDashboard /> : <ExamDashboard />;
      case 'flashcards':
        return <FlashcardVault />;
      case 'ai':
        return <AIChat />;
      case 'generate':
        return <AIStudyMaterialGenerator />;
      case 'calendar':
        return <MultiLevelPlanner />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'achievements':
        return <ResourceSpace />;
      case 'notifications':
        return <NotificationCenter onNavigate={handleNavigate} />;
      case 'discover':
        return <DiscoverResources onNavigate={handleNavigate} />;
      default:
        console.log('ContentRenderer: Unknown tab, rendering default dashboard');
        return user?.userType === 'college' ? <CollegeDashboard /> : <ExamDashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderContent()}
    </div>
  );
};
