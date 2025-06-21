
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
  console.log('ContentRenderer: Rendering content for tab:', activeTab, 'userType:', userType);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        console.log('ContentRenderer: Rendering home dashboard');
        return userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
      case 'flashcards':
        console.log('ContentRenderer: Rendering flashcards');
        return <FlashcardVault />;
      case 'ai-chat':
        console.log('ContentRenderer: Rendering AI chat');
        return <AIChat />;
      case 'ai-generator':
        console.log('ContentRenderer: Rendering AI generator');
        return <AIFlashcardGenerator />;
      case 'calendar':
        console.log('ContentRenderer: Rendering calendar');
        return <StudyCalendar />;
      case 'progress':
        console.log('ContentRenderer: Rendering progress');
        return <StudyProgress />;
      case 'achievements':
        console.log('ContentRenderer: Rendering achievements');
        return <AchievementsPage />;
      case 'settings':
        console.log('ContentRenderer: Rendering settings');
        return <SettingsPage />;
      case 'profile':
        console.log('ContentRenderer: Rendering profile');
        return <ProfilePage />;
      default:
        console.warn('ContentRenderer: Unknown tab:', activeTab, 'falling back to home');
        return userType === 'exam' ? <ExamDashboard /> : <CollegeDashboard />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};
