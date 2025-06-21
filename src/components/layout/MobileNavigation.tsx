
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  User
} from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'flashcards', icon: BookOpen, label: 'Cards' },
    { id: 'ai-chat', icon: MessageSquare, label: 'AI Chat' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('MobileNavigation: Navigating to tab:', item.id);
              onTabChange(item.id);
            }}
            className={`flex flex-col items-center p-2 h-auto ${
              activeTab === item.id 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
