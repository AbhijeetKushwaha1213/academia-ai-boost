
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Brain, Calendar, Trophy, Settings } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'flashcards', icon: BookOpen, label: 'Cards' },
    { id: 'ai-chat', icon: Brain, label: 'AI Chat' },
    { id: 'calendar', icon: Calendar, label: 'Progress' },
    { id: 'achievements', icon: Trophy, label: 'Badges' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-2 h-auto ${
              activeTab === item.id ? 'text-indigo-600' : 'text-gray-600'
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className={`w-5 h-5 ${
              activeTab === item.id ? 'text-indigo-600' : 'text-gray-600'
            }`} />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
