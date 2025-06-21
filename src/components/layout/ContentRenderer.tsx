
import React from 'react';
import { CollegeDashboard } from '../dashboard/CollegeDashboard';
import { ExamDashboard } from '../dashboard/ExamDashboard';
import { FlashcardVault } from '../flashcards/FlashcardVault';
import { AIChat } from '../chat/AIChat';
import { AIFlashcardGenerator } from '../ai/AIFlashcardGenerator';
import { StudyCalendar } from '../calendar/StudyCalendar';
import { ProfilePage } from '../profile/ProfilePage';
import { SettingsPage } from '../settings/SettingsPage';
import { AchievementsPage } from '../achievements/AchievementsPage';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { DiscoverResources } from '../discover/DiscoverResources';
import { useAuth } from '../auth/AuthProvider';

interface ContentRendererProps {
  activeTab: string;
}

export const ContentRenderer = ({ activeTab }: ContentRendererProps) => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return user?.userType === 'college' ? <CollegeDashboard /> : <ExamDashboard />;
      case 'flashcards':
        return <FlashcardVault />;
      case 'ai':
        return <AIChat />;
      case 'generate':
        return <AIFlashcardGenerator />;
      case 'calendar':
        return <StudyCalendar />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'notifications':
        return <NotificationCenter />;
      case 'discover':
        return <DiscoverResources />;
      default:
        return user?.userType === 'college' ? <CollegeDashboard /> : <ExamDashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderContent()}
    </div>
  );
};
