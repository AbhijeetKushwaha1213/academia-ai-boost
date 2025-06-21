
import React from 'react';
import { ExamDashboard } from '../dashboard/ExamDashboard';
import { CollegeDashboard } from '../dashboard/CollegeDashboard';
import { FlashcardVault } from '../flashcards/FlashcardVault';
import { AIChat } from '../chat/AIChat';
import { AIFlashcardGenerator } from '../ai/AIFlashcardGenerator';
import { StudyCalendar } from '../calendar/StudyCalendar';
import { StudyProgress } from '../StudyProgress';
import { AchievementsPage } from '../achievements/AchievementsPage';
import { SettingsPage } from '../settings/SettingsPage';
import { ProfilePage } from '../profile/ProfilePage';

interface ContentRendererProps {
  activeTab: string;
  userType: 'exam' | 'college';
}

export const ContentRenderer = ({ activeTab, userType }: ContentRendererProps) => {
  console.log('ContentRenderer: Rendering content for tab:', activeTab);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
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
        console.warn('Unknown tab:', activeTab, 'falling back to home');
        return userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};
