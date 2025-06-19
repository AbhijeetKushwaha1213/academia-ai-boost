
import React from 'react';
import { Home, BookOpen, Bot, Calendar, Trophy, Settings, Wand2 } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'flashcards', label: 'Cards', icon: BookOpen },
    { id: 'ai-chat', label: 'AI Chat', icon: Bot },
    { id: 'ai-generator', label: 'Generate', icon: Wand2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
